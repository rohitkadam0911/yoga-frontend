"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getMyBookingsApi, cancelBookingApi } from "@/services/booking.service";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookingsApi();
      setBookings(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    if (filter === "All") return bookings;
    return bookings.filter((b) => b.bookingStatus === filter);
  }, [bookings, filter]);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await cancelBookingApi(id);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, bookingStatus: "Cancelled" } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setCancellingId(null);
      setConfirmingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!mounted || !dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Booked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "Completed":
        return "bg-slate-100 text-slate-700 border-slate-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Failed":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      case "Refunded":
        return "bg-slate-100 text-slate-600 border-slate-200/60";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200/60";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your upcoming sessions, view class schedules, and review past history.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          {["All", "Booked", "Completed", "Cancelled"].map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer shrink-0 ${isActive
                    ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-white border border-slate-200/80 rounded-2xl animate-pulse p-6 flex flex-col sm:flex-row gap-5"
              >
                <div className="w-full sm:w-36 h-36 bg-slate-100 rounded-xl shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-1/3 pt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div role="alert" className="mb-6 rounded-2xl bg-rose-50 border border-rose-200/80 p-4 text-rose-800 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-rose-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBookings.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              {filter === "All"
                ? "You haven't reserved any classes yet. Browse our list of available sessions to get started."
                : `There are currently no bookings with status "${filter}".`}
            </p>
            <Link
              href="/classes"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm shadow-emerald-600/20"
            >
              Browse Classes
            </Link>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && filteredBookings.length > 0 && (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const cls = booking.classId;
              const instructor = booking.instructorId;
              const session = booking.sessionId;

              return (
                <div
                  key={booking._id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-5 items-start"
                >
                  {/* Class Thumbnail */}
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shrink-0 relative">
                    {cls?.thumbnail?.url ? (
                      <img
                        src={cls.thumbnail.url}
                        alt={cls.title || "Class Thumbnail"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-2 text-center">
                        <svg className="w-8 h-8 mb-1 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium uppercase tracking-wider">{cls?.category || "Yoga"}</span>
                      </div>
                    )}
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(booking.bookingStatus)}`}>
                          {booking.bookingStatus}
                        </span>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getPaymentBadge(booking.paymentStatus)}`}>
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>
                      <span className="text-base font-bold text-slate-900">
                        {booking.totalAmount === 0 ? "Free" : `₹${booking.totalAmount}`}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                      {cls?.title || "Class Information Unavailable"}
                    </h3>

                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Instructor: <strong className="text-slate-700 font-medium">{instructor?.userId?.name || "Assigned Trainer"}</strong></span>
                    </p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-4">
                      {session?.date && (
                        <div className="flex items-center gap-1.5" suppressHydrationWarning>
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">{formatDate(session.date)}</span>
                        </div>
                      )}
                      {session?.startTime && session?.endTime && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{session.startTime} - {session.endTime}</span>
                        </div>
                      )}
                      {cls?.mode && (
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="capitalize">{cls.mode}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {cls?._id ? (
                        <Link
                          href={`/classes/${cls._id}`}
                          className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                        >
                          <span>View Details</span>
                          <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ) : (
                        <div />
                      )}

                      {booking.bookingStatus === "Booked" && (
                        <button
                          onClick={() => setConfirmingId(booking._id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Modal Overlay */}
        {confirmingId && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Cancel Booking?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfirmingId(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Keep Booking
                </button>
                <button
                  onClick={() => handleCancel(confirmingId)}
                  disabled={cancellingId === confirmingId}
                  className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-rose-600/30 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  {cancellingId === confirmingId ? (
                    <span>Cancelling...</span>
                  ) : (
                    <span>Confirm Cancel</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}