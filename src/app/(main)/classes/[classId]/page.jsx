"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    getClassByIdApi,
    getClassSessionsByClassApi
} from "@/services/class.service";
import { createBookingApi } from "@/services/booking.service";
import { createPaymentApi } from "@/services/payment.service";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function ClassDetailPage() {
    const { classId } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [yogaClass, setYogaClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const [classResult, sessionResult] = await Promise.allSettled([
                    getClassByIdApi(classId),
                    getClassSessionsByClassApi(classId)
                ]);

                if (classResult.status === "fulfilled") {
                    const classData =
                        classResult.value.data?.data ||
                        classResult.value.data;

                    setYogaClass(classData);
                } else {
                    throw classResult.reason;
                }

                if (sessionResult.status === "fulfilled") {
                    const sessionData =
                        sessionResult.value.data?.data || [];

                    const activeSessions = Array.isArray(sessionData)
                        ? sessionData.filter(
                            (session) => session.status === true
                        )
                        : [];

                    setSessions(activeSessions);

                    if (activeSessions.length > 0) {
                        setSelectedSession(activeSessions[0]);
                    }
                } else {
                    console.error(
                        "Class Sessions Error:",
                        sessionResult.reason
                    );
                    setSessions([]);
                }
            } catch (err) {
                console.error("Class Details Error:", err);

                setError(
                    err.response?.data?.message ||
                    "Class details could not be loaded."
                );
            } finally {
                setLoading(false);
            }
        };

        if (classId) {
            fetchClassData();
        }
    }, [classId]);

    const formatDate = (dateStr) => {
        if (!dateStr) {
            return "";
        }

        return new Date(dateStr).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    useEffect(() => {
        const loadRazorpay = () => {
            if (window.Razorpay) {
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.async = true;

            document.body.appendChild(script);
        };

        loadRazorpay();
    }, []);

    const openRazorpay = (paymentData, bookingId) => {
        return new Promise((resolve, reject) => {
            if (!window.Razorpay) {
                reject(
                    new Error(
                        "Razorpay SDK failed to load. Please check your internet connection."
                    )
                );
                return;
            }

            const options = {
                key: paymentData.key,
                amount: paymentData.amount,
                currency: paymentData.currency || "INR",
                name: paymentData.name || "YogaConnect",
                description:
                    paymentData.description ||
                    `Class Booking - ${bookingId}`,
                order_id: paymentData.razorpayOrderId,

                prefill: {
                    name:
                        paymentData.prefill?.name ||
                        user?.name ||
                        "",
                    email:
                        paymentData.prefill?.email ||
                        user?.email ||
                        "",
                    contact:
                        paymentData.prefill?.contact ||
                        user?.phone ||
                        ""
                },

                theme: {
                    color: "#2d5248"
                },

                handler: async (response) => {
                    try {
                        const verifyRes = await api.post(
                            "/payments/success",
                            {
                                razorpay_order_id:
                                    response.razorpay_order_id,
                                razorpay_payment_id:
                                    response.razorpay_payment_id,
                                razorpay_signature:
                                    response.razorpay_signature
                            }
                        );

                        if (!verifyRes.data?.success) {
                            throw new Error(
                                verifyRes.data?.message ||
                                "Payment verification failed."
                            );
                        }

                        setShowPaymentModal(false);
                        setBookingSuccess(true);
                        setBooking(false);

                        resolve(verifyRes.data);
                    } catch (error) {
                        console.error(
                            "Payment Verification Error:",
                            error
                        );

                        setBookingError(
                            error.response?.data?.message ||
                            error.message ||
                            "Payment verification failed."
                        );

                        setBooking(false);
                        reject(error);
                    }
                },

                modal: {
                    ondismiss: async () => {
                        try {
                            await api.post(
                                "/payments/failure",
                                {
                                    razorpay_order_id:
                                        paymentData.razorpayOrderId
                                }
                            );
                        } catch (error) {
                            console.error(
                                "Payment Failure Update Error:",
                                error
                            );
                        }

                        setBooking(false);

                        reject(
                            new Error("Payment was cancelled.")
                        );
                    }
                }
            };

            const razorpay = new window.Razorpay(options);

            razorpay.on(
                "payment.failed",
                async (response) => {
                    console.error(
                        "Razorpay Payment Failed:",
                        response.error
                    );

                    try {
                        await api.post(
                            "/payments/failure",
                            {
                                razorpay_order_id:
                                    paymentData.razorpayOrderId
                            }
                        );
                    } catch (error) {
                        console.error(
                            "Payment Failure Update Error:",
                            error
                        );
                    }

                    setBookingError(
                        response.error?.description ||
                        "Payment failed. Please try again."
                    );

                    setBooking(false);
                }
            );

            razorpay.open();
        });
    };

    const handleFreeBooking = async () => {
        setBooking(true);
        setBookingError("");

        try {
            await createBookingApi(classId, selectedSession?._id);

            setBookingSuccess(true);
        } catch (err) {
            setBookingError(
                err.response?.data?.message ||
                "Failed to reserve class spot."
            );
        } finally {
            setBooking(false);
        }
    };

    const processBooking = async () => {
        if (!selectedSession) {
            setBookingError("Please select a session date.");
            return;
        }

        setBooking(true);
        setBookingError("");

        try {
            const bookingRes = await createBookingApi(
                classId,
                selectedSession._id
            );

            const bookingData =
                bookingRes.data?.data || bookingRes.data;

            const bookingId = bookingData?._id;

            if (!bookingId) {
                throw new Error(
                    "Booking registration failed. No booking ID returned."
                );
            }

            const paymentMethodMap = {
                upi: "UPI",
                card: "Card",
                netbanking: "Net Banking"
            };

            const paymentRes = await createPaymentApi({
                bookingId,
                paymentMethod:
                    paymentMethodMap[paymentMethod]
            });

            const paymentData =
                paymentRes.data?.data || paymentRes.data;

            if (!paymentData) {
                throw new Error(
                    "Payment gateway initiation failed."
                );
            }

            await openRazorpay(paymentData, bookingId);
        } catch (err) {
            console.error("Payment Error:", err);

            setBookingError(
                err.response?.data?.message ||
                err.message ||
                "Failed to initiate payment procedure."
            );

            setBooking(false);
        }
    };

    const handleInitiateBooking = () => {
        if (!user) {
            router.push(
                `/login?redirect=/classes/${classId}`
            );
            return;
        }

        if (user.role !== "user") {
            setBookingError(
                "Only registered students can reserve class spots."
            );
            return;
        }

        if (sessions.length > 0 && !selectedSession) {
            setBookingError(
                "Please select a session date from the schedule."
            );
            return;
        }

        setBookingError("");

        if (yogaClass.price === 0) {
            handleFreeBooking();
        } else {
            setShowPaymentModal(true);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#f8fbf9] min-h-screen py-12 px-6">
                <div className="max-w-6xl mx-auto animate-pulse space-y-8">
                    <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-200/80 rounded-3xl" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-8 bg-slate-200/80 rounded-md w-1/2" />
                            <div className="h-24 bg-slate-200/80 rounded-2xl" />
                        </div>

                        <div className="h-64 bg-slate-200/80 rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !yogaClass) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[#f8fbf9]">
                <div className="bg-white rounded-3xl p-10 text-center max-w-sm border border-slate-100 shadow-sm">
                    <div className="text-4xl mb-3">
                        🧘‍♂️
                    </div>

                    <h2 className="text-xl font-bold text-[#2d5248] mb-2">
                        Class Unavailable
                    </h2>

                    <p className="text-[#5b8077] text-sm mb-6">
                        {error ||
                            "Class details could not be loaded."}
                    </p>

                    <Link
                        href="/classes"
                        className="px-6 py-3 rounded-full bg-[#f26457] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e05346] transition shadow-md shadow-[#f26457]/20 inline-block"
                    >
                        Explore Classes
                    </Link>
                </div>
            </div>
        );
    }

    const instructor = yogaClass.instructorId;

    const platformFee =
        yogaClass.price > 0 ? 20 : 0;

    const totalPrice =
        yogaClass.price + platformFee;

    return (
        <div className="bg-[#f8fbf9] min-h-screen text-[#2c3e38] pb-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between">
                <Link
                    href="/classes"
                    className="text-xs font-bold uppercase tracking-wider text-[#5b8077] hover:text-[#2d5248] transition flex items-center gap-1.5"
                >
                    <span>←</span>
                    Back to Explore
                </Link>

                <span className="text-xs font-bold px-3.5 py-1 bg-[#eef3f1] text-[#2d5248] rounded-full uppercase tracking-wider">
                    {yogaClass.category}
                </span>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="relative rounded-3xl overflow-hidden bg-[#2d5248] aspect-[16/9] sm:aspect-[21/9] w-full shadow-sm mb-8">
                    {yogaClass.thumbnail?.url ? (
                        <img
                            src={yogaClass.thumbnail.url}
                            alt={yogaClass.title}
                            className="w-full h-full object-cover object-center opacity-80"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2d5248] text-emerald-100 text-3xl font-light">
                            {yogaClass.title}
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b342e]/90 via-[#1b342e]/30 to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-[#a3c2b8] text-xs font-bold uppercase tracking-widest">
                                {yogaClass.level}
                            </p>

                            <h1 className="text-2xl sm:text-4xl font-bold text-white mt-1">
                                {yogaClass.title}
                            </h1>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-medium px-3.5 py-1.5 rounded-full">
                                ⏱ {yogaClass.duration} mins
                            </span>

                            <span className="bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs font-medium px-3.5 py-1.5 rounded-full capitalize">
                                📍 {yogaClass.mode}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-lg font-bold text-[#2d5248] mb-4">
                                About this class
                            </h2>

                            <p className="text-[#5b8077] leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {yogaClass.description}
                            </p>
                        </div>

                        {instructor && (
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                                <p className="text-xs font-bold text-[#5b8077] uppercase tracking-widest mb-4">
                                    Your Instructor
                                </p>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#eef3f1] overflow-hidden shrink-0 border border-slate-200/60 shadow-sm">
                                            {instructor.userId?.profileImage?.url ? (
                                                <img
                                                    src={
                                                        instructor
                                                            .userId
                                                            .profileImage
                                                            .url
                                                    }
                                                    alt={
                                                        instructor
                                                            .userId
                                                            .name
                                                    }
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-[#2d5248] text-xl">
                                                    {instructor.userId?.name?.[0]?.toUpperCase() ||
                                                        "I"}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#2d5248] text-base">
                                                {instructor.userId?.name}
                                            </h3>

                                            <p className="text-xs text-[#5b8077]">
                                                Certified Yoga & Wellness Guide
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/instructors/${instructor._id}`}
                                        className="px-4 py-2.5 rounded-xl bg-[#f8fbf9] border border-slate-200 text-[#2d5248] text-xs font-bold hover:bg-[#eef3f1] transition shrink-0"
                                    >
                                        View Bio
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-8">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
                            <div className="flex items-baseline justify-between border-b border-slate-100 pb-6">
                                <div>
                                    <span className="text-xs font-bold text-[#5b8077] uppercase tracking-wider block mb-1">
                                        Class Price
                                    </span>

                                    <span className="text-3xl font-bold text-[#2d5248]">
                                        {yogaClass.price === 0
                                            ? "Free"
                                            : `₹${yogaClass.price}`}
                                    </span>
                                </div>

                                <span className="text-xs font-semibold px-3 py-1 bg-[#eef3f1] text-[#2d5248] rounded-full">
                                    {yogaClass.capacity} Spots Max
                                </span>
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs font-bold text-[#2d5248] uppercase tracking-wider block">
                                    Select Session Date
                                </span>

                                {sessions.length === 0 ? (
                                    <p className="text-xs text-[#5b8077] italic p-3 bg-[#f8fbf9] rounded-2xl text-center border border-slate-100">
                                        No active upcoming dates available right now.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                                        {sessions.map((session) => {
                                            const isSelected =
                                                selectedSession?._id ===
                                                session._id;

                                            const date = new Date(
                                                session.date
                                            );

                                            const dayName =
                                                date.toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        weekday: "short"
                                                    }
                                                );

                                            const dateNum =
                                                date.toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        month: "short",
                                                        day: "numeric"
                                                    }
                                                );

                                            const timeStr = `${session.startTime} - ${session.endTime}`;

                                            const availableSeats =
                                                Math.max(
                                                    0,
                                                    (session.capacity || 0) -
                                                    (session.bookedSeats || 0)
                                                );

                                            const isFull =
                                                availableSeats <= 0;

                                            return (
                                                <button
                                                    key={session._id}
                                                    type="button"
                                                    disabled={isFull}
                                                    onClick={() =>
                                                        setSelectedSession(
                                                            session
                                                        )
                                                    }
                                                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${isSelected
                                                        ? "border-[#2d5248] bg-[#2d5248] text-white shadow-md"
                                                        : isFull
                                                            ? "border-red-100 bg-red-50 text-slate-400 cursor-not-allowed"
                                                            : "border-slate-200 bg-[#f8fbf9] text-[#2d5248] hover:border-[#2d5248]/50"
                                                        }`}
                                                >
                                                    <span
                                                        className={`text-[10px] font-bold uppercase ${isSelected
                                                            ? "text-emerald-200"
                                                            : isFull
                                                                ? "text-red-400"
                                                                : "text-[#5b8077]"
                                                            }`}
                                                    >
                                                        {dayName}
                                                    </span>

                                                    <span className="text-xs font-bold mt-1">
                                                        {dateNum}
                                                    </span>

                                                    <span
                                                        className={`text-[10px] mt-1 ${isSelected
                                                            ? "text-emerald-100"
                                                            : isFull
                                                                ? "text-red-400"
                                                                : "text-[#5b8077]"
                                                            }`}
                                                    >
                                                        ⏰ {timeStr}
                                                    </span>

                                                    <span
                                                        className={`text-[10px] mt-1 ${isSelected
                                                            ? "text-emerald-100"
                                                            : isFull
                                                                ? "text-red-400"
                                                                : "text-[#5b8077]"
                                                            }`}
                                                    >
                                                        {isFull
                                                            ? "Full"
                                                            : `Seats: ${availableSeats}`}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {yogaClass.price > 0 && (
                                <div className="space-y-2 pt-2 text-xs text-[#5b8077]">
                                    <div className="flex justify-between">
                                        <span>Base Fare</span>
                                        <span>
                                            ₹{yogaClass.price}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Booking Fee</span>
                                        <span>₹{platformFee}</span>
                                    </div>

                                    <div className="flex justify-between font-bold text-[#2d5248] pt-2 border-t border-slate-100 text-sm">
                                        <span>Total Amount</span>
                                        <span>₹{totalPrice}</span>
                                    </div>
                                </div>
                            )}

                            {bookingSuccess ? (
                                <div className="bg-[#2d5248] text-white rounded-2xl p-5 text-center space-y-2">
                                    <div className="text-2xl">
                                        🎉
                                    </div>

                                    <p className="font-bold text-sm">
                                        You are successfully enrolled!
                                    </p>

                                    {selectedSession && (
                                        <p className="text-xs text-[#a3c2b8]">
                                            Date:{" "}
                                            {formatDate(
                                                selectedSession.date
                                            )}
                                        </p>
                                    )}

                                    <Link
                                        href="/bookings"
                                        className="inline-block text-xs font-semibold underline text-[#a3c2b8] hover:text-white pt-2"
                                    >
                                        Go to My Bookings
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {bookingError && (
                                        <div className="p-3 bg-red-50 text-[#f26457] rounded-xl text-xs font-medium border border-red-100">
                                            {bookingError}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleInitiateBooking}
                                        disabled={
                                            booking ||
                                            sessions.length === 0 ||
                                            !selectedSession
                                        }
                                        className="w-full py-3.5 rounded-full bg-[#f26457] hover:bg-[#e05346] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#f26457]/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {yogaClass.price === 0
                                            ? booking
                                                ? "Reserving..."
                                                : "Reserve Free Spot"
                                            : `Proceed to Pay ₹${totalPrice}`}
                                    </button>

                                    <p className="text-[11px] text-center text-[#5b8077] flex items-center justify-center gap-1">
                                        <span>🔒</span>
                                        256-Bit Secure Checkout
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {showPaymentModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#2d5248]">
                                    Complete Payment
                                </h3>

                                <p className="text-xs text-[#5b8077]">
                                    Select your payment method
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowPaymentModal(false)
                                }
                                disabled={booking}
                                className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-full bg-slate-50 disabled:opacity-50"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="bg-[#f8fbf9] rounded-2xl p-4 space-y-1 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-[#5b8077]">
                                    Amount Due
                                </span>

                                <span className="text-xl font-bold text-[#2d5248]">
                                    ₹{totalPrice}
                                </span>
                            </div>

                            {selectedSession && (
                                <div className="text-[11px] text-[#5b8077]">
                                    Selected Session:{" "}
                                    <span className="font-bold text-[#2d5248]">
                                        {formatDate(
                                            selectedSession.date
                                        )}
                                        {" | "}
                                        {selectedSession.startTime}
                                        {" - "}
                                        {selectedSession.endTime}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            {[
                                {
                                    id: "upi",
                                    name: "UPI / Google Pay / PhonePe",
                                    icon: "⚡"
                                },
                                {
                                    id: "card",
                                    name: "Credit / Debit Card",
                                    icon: "💳"
                                },
                                {
                                    id: "netbanking",
                                    name: "Net Banking",
                                    icon: "🏦"
                                }
                            ].map((method) => (
                                <label
                                    key={method.id}
                                    onClick={() =>
                                        !booking &&
                                        setPaymentMethod(
                                            method.id
                                        )
                                    }
                                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === method.id
                                        ? "border-[#2d5248] bg-[#eef3f1]/50 text-[#2d5248]"
                                        : "border-slate-100 text-[#5b8077] hover:bg-slate-50"
                                        } ${booking
                                            ? "pointer-events-none opacity-70"
                                            : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-base">
                                            {method.icon}
                                        </span>

                                        <span className="text-xs font-bold">
                                            {method.name}
                                        </span>
                                    </div>

                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={
                                            paymentMethod ===
                                            method.id
                                        }
                                        onChange={() =>
                                            setPaymentMethod(
                                                method.id
                                            )
                                        }
                                        className="accent-[#2d5248]"
                                    />
                                </label>
                            ))}
                        </div>

                        {bookingError && (
                            <div className="p-3 bg-red-50 text-[#f26457] rounded-xl text-xs font-medium border border-red-100">
                                {bookingError}
                            </div>
                        )}

                        <button
                            onClick={processBooking}
                            disabled={
                                booking ||
                                !selectedSession
                            }
                            className="w-full py-4 rounded-full bg-[#f26457] hover:bg-[#e05346] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#f26457]/20 transition-all active:scale-[0.98] disabled:opacity-60"
                        >
                            {booking
                                ? "Processing..."
                                : `Pay ₹${totalPrice} Now`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}