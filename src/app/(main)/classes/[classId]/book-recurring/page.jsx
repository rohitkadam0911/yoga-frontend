"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookRecurringPage() {
    const params = useParams();
    const classId = params?.classId;
    const router = useRouter();

    const [sessions, setSessions] = useState([]);
    const [selectedSessionIds, setSelectedSessionIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!classId) {
            return;
        }

        const fetchClassSessions = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(
                    `${API_URL}/class-sessions/class/${classId}`
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch class sessions"
                    );
                }

                setSessions(data.data || []);
            } catch (error) {
                console.error(
                    "Failed to fetch sessions:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load sessions"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchClassSessions();
    }, [classId]);

    const toggleSessionSelection = (sessionId) => {
        const selectedSession = sessions.find(
            (session) => session._id === sessionId
        );

        if (!selectedSession) {
            return;
        }

        const availableSeats =
            selectedSession.capacity -
            selectedSession.bookedSeats;

        if (availableSeats <= 0) {
            return;
        }

        setSelectedSessionIds((previousIds) => {
            if (previousIds.includes(sessionId)) {
                return previousIds.filter(
                    (id) => id !== sessionId
                );
            }

            return [
                ...previousIds,
                sessionId
            ];
        });
    };

    const handleBooking = async () => {
        if (!classId) {
            alert("Class ID is missing.");
            return;
        }

        if (selectedSessionIds.length === 0) {
            alert(
                "Please select at least one session to book."
            );
            return;
        }

        setSubmitting(true);

        try {
            const bookingResults = [];

            for (const sessionId of selectedSessionIds) {
                const res = await fetch(
                    `${API_URL}/bookings/create`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            classId,
                            sessionId
                        })
                    }
                );

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Booking failed"
                    );
                }

                bookingResults.push(data);
            }

            alert(
                `Successfully booked ${bookingResults.length} session(s)!`
            );

            router.push("/classes/timetable");
        } catch (error) {
            console.error(
                "Booking submission error:",
                error
            );

            alert(
                error.message ||
                "An error occurred during booking."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white text-slate-800 min-h-screen py-12 px-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#3b6861] block mb-1">
                    Flexible Schedule Booking
                </span>

                <h1 className="text-3xl font-bold text-slate-800">
                    Select Monthly Sessions
                </h1>

                <p className="text-slate-500 text-sm mt-1">
                    Pick twice, thrice, or any number of
                    sessions available for this class in
                    the month.
                </p>
            </div>

            <div className="bg-[#eaf2f0] p-4 rounded-lg flex justify-between items-center mb-6">
                <div>
                    <span className="text-sm font-semibold text-[#2b5752]">
                        Selected Sessions:{" "}
                        <span className="text-lg font-bold">
                            {selectedSessionIds.length}
                        </span>
                    </span>
                </div>

                <button
                    onClick={handleBooking}
                    disabled={
                        selectedSessionIds.length === 0 ||
                        submitting
                    }
                    className="bg-[#3b6861] hover:bg-[#2b5752] disabled:bg-slate-300 text-white text-xs font-bold uppercase px-6 py-3 rounded-full transition-all"
                >
                    {submitting
                        ? "Processing..."
                        : `Book ${selectedSessionIds.length} Session(s)`}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-400">
                    Loading available sessions...
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    No active sessions found for this class.
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => {
                        const isSelected =
                            selectedSessionIds.includes(
                                session._id
                            );

                        const availableSeats = Math.max(
                            0,
                            session.capacity -
                                session.bookedSeats
                        );

                        const isFull =
                            availableSeats === 0;

                        return (
                            <div
                                key={session._id}
                                onClick={() => {
                                    if (!isFull) {
                                        toggleSessionSelection(
                                            session._id
                                        );
                                    }
                                }}
                                className={`p-5 rounded-lg border transition-all flex items-center justify-between ${
                                    isFull
                                        ? "border-slate-200 bg-slate-100 cursor-not-allowed opacity-60"
                                        : isSelected
                                            ? "border-[#3b6861] bg-[#f4f7f6] shadow-sm cursor-pointer"
                                            : "border-slate-200 bg-white hover:border-slate-300 cursor-pointer"
                                }`}
                            >
                                <div>
                                    <p className="text-base font-bold text-slate-800">
                                        {new Date(
                                            session.date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                weekday:
                                                    "long",
                                                day: "numeric",
                                                month:
                                                    "long",
                                                year:
                                                    "numeric"
                                            }
                                        )}
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        Time:{" "}
                                        {session.startTime} -{" "}
                                        {session.endTime}
                                    </p>

                                    <p
                                        className={`text-xs mt-0.5 ${
                                            isFull
                                                ? "text-red-500"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {isFull
                                            ? "Session Full"
                                            : `Seats Available: ${availableSeats}`}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            toggleSessionSelection(
                                                session._id
                                            )
                                        }
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                        disabled={isFull}
                                        className="w-5 h-5 accent-[#3b6861] rounded cursor-pointer disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
