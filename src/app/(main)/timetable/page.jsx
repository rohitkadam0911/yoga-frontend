"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const [sessions, setSessions] = useState([]);
  const [selectedDay, setSelectedDay] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setError("");
      const res = await api.get("/class-sessions");
      setSessions(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load the schedule. Please try again."
      );
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", { weekday: "long" });

  const filteredSessions = sessions
    .filter((s) =>
      selectedDay === "All" ? true : getDayName(s.date).toLowerCase() === selectedDay.toLowerCase()
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-slate-800 font-sans">
      {/* Header */}
      <section className="relative bg-[#eaf2f0] py-16 px-6 text-center border-b border-[#3b6861]/10">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#3b6861]">
            Weekly Schedule
          </span>
          <h1 className="text-4xl sm:text-5xl font-light text-[#2b5752]">
            Class Timetable
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Explore our weekly scheduled sessions. Book a single date, or pick
            several sessions for a monthly package.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Day Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {["All", ...DAYS].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedDay.toLowerCase() === day.toLowerCase()
                  ? "bg-[#3b6861] text-white shadow-md scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[#3b6861] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading session schedule...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 text-sm font-medium mb-3">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                fetchSessions();
              }}
              className="text-sm font-semibold text-[#3b6861] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto shadow-sm">
            <svg
              className="w-12 h-12 text-slate-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-bold text-slate-700">No Sessions Available</h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedDay === "All"
                ? "There are no sessions scheduled right now."
                : `There are no classes scheduled for ${selectedDay}.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const availableSeats = Math.max(0, session.capacity - session.bookedSeats);
              const isFull = availableSeats === 0;
              const classObj = session.classId || {};
              const classId = classObj._id;

              return (
                <div
                  key={session._id}
                  className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase bg-[#eaf2f0] text-[#3b6861] px-3 py-1 rounded-md">
                        {getDayName(session.date)}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {classObj.title || "Yoga Session"}
                    </h3>

                    {classObj.category && (
                      <p className="text-xs text-slate-500 mb-3">
                        {classObj.category}
                        {classObj.level ? ` · ${classObj.level}` : ""}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-slate-600 mb-4 gap-2">
                      <svg className="w-4 h-4 text-[#3b6861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{session.startTime} - {session.endTime}</span>
                    </div>

                    <div className="bg-[#f8fbfb] rounded-lg p-3 border border-slate-100 mb-6 flex justify-between text-xs">
                      <div>
                        <span className="text-slate-400 block">Class Fee</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {classObj.price === 0 ? "Free" : `₹${classObj.price ?? "—"}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block">Available Seats</span>
                        <span className={`font-bold text-sm ${isFull ? "text-red-500" : "text-[#3b6861]"}`}>
                          {isFull ? "Full" : `${availableSeats} / ${session.capacity}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {classId ? (
                      <>
                        <Link
                          href={`/classes/${classId}`}
                          className="w-full text-center bg-[#3b6861] hover:bg-[#2b5752] text-white text-xs font-bold uppercase py-3 rounded-lg transition-all duration-200 block shadow-sm"
                        >
                          View & Book This Session
                        </Link>
                        <Link
                          href={`/classes/${classId}/book-recurring`}
                          className="w-full text-center bg-white border border-[#3b6861] text-[#3b6861] hover:bg-[#eaf2f0] text-xs font-bold uppercase py-3 rounded-lg transition-all duration-200 block"
                        >
                          Book Monthly Package
                        </Link>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">
                        Class details unavailable
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}