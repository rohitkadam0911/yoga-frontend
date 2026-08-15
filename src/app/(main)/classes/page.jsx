"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllClassesApi } from "@/services/class.service";

const CATEGORIES = [
  "Hatha Yoga",
  "Power Yoga",
  "Meditation",
  "Kids Yoga",
  "Prenatal Yoga",
  "Pranayama",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const MODES = ["Online", "Offline"];

function ClassesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const queryMode = searchParams.get("mode");
  const queryCategory = searchParams.get("category");
  const queryLevel = searchParams.get("level");

  const initialMode = queryMode
    ? MODES.find((m) => m.toLowerCase() === queryMode.toLowerCase()) || "All"
    : "All";

  const initialCategory = queryCategory
    ? CATEGORIES.find((c) => c.toLowerCase() === queryCategory.toLowerCase()) || "All"
    : "All";

  const initialLevel = queryLevel
    ? LEVELS.find((l) => l.toLowerCase() === queryLevel.toLowerCase()) || "All"
    : "All";

  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState(initialLevel);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    if (queryMode) {
      const match = MODES.find((m) => m.toLowerCase() === queryMode.toLowerCase());
      if (match) setMode(match);
    } else {
      setMode("All");
    }

    if (queryCategory) {
      const match = CATEGORIES.find((c) => c.toLowerCase() === queryCategory.toLowerCase());
      if (match) setCategory(match);
    } else {
      setCategory("All");
    }

    if (queryLevel) {
      const match = LEVELS.find((l) => l.toLowerCase() === queryLevel.toLowerCase());
      if (match) setLevel(match);
    } else {
      setLevel("All");
    }
  }, [queryMode, queryCategory, queryLevel]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClassesApi();
        setClasses(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      if (category !== "All" && cls.category?.toLowerCase() !== category.toLowerCase()) return false;
      if (level !== "All" && cls.level?.toLowerCase() !== level.toLowerCase()) return false;
      if (mode !== "All" && cls.mode?.toLowerCase() !== mode.toLowerCase()) return false;
      return true;
    });
  }, [classes, category, level, mode]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const handleClearFilters = () => {
    setCategory("All");
    setLevel("All");
    setMode("All");
    router.push("/classes");
  };

  return (
    <div className="bg-[#f8fbf9] min-h-screen text-[#2c3e38]">
      {/* Hero Header */}
      <section className="bg-[#eef3f1] py-16 px-6 border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#2d5248] text-xs font-bold uppercase tracking-wider shadow-sm border border-slate-200/60 mb-4">
            Find Your Practice
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#2d5248] mb-4">
            Browse All Sessions
          </h1>
          <p className="text-[#5b8077] text-base max-w-xl mx-auto leading-relaxed">
            Discover live online or in-studio yoga classes tailored to every experience level.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#f8fbf9] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2d5248] focus:outline-none focus:ring-2 focus:ring-[#2d5248] transition cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="bg-[#f8fbf9] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2d5248] focus:outline-none focus:ring-2 focus:ring-[#2d5248] transition cursor-pointer"
            >
              <option value="All">All Levels</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="bg-[#f8fbf9] border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#2d5248] focus:outline-none focus:ring-2 focus:ring-[#2d5248] transition cursor-pointer"
            >
              <option value="All">All Modes (Online & Offline)</option>
              {MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {(category !== "All" || level !== "All" || mode !== "All") && (
              <button
                onClick={handleClearFilters}
                className="ml-auto text-xs font-bold text-[#f26457] hover:bg-red-50 px-3.5 py-2 rounded-xl transition"
              >
                Reset Filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-5 space-y-4 animate-pulse shadow-sm"
              >
                <div className="h-48 bg-slate-200/80 rounded-2xl" />
                <div className="h-6 w-3/4 bg-slate-200/80 rounded-md" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                </div>
                <div className="h-10 w-full bg-slate-200/80 rounded-full mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl p-4 text-center mb-8 font-medium">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredClasses.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 max-w-md mx-auto my-12 shadow-sm">
            <div className="text-4xl mb-3">🧘‍♀️</div>
            <h3 className="text-lg font-bold text-[#2d5248] mb-1">No classes found</h3>
            <p className="text-[#5b8077] text-sm mb-6">Try adjusting your filters to discover available sessions.</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 rounded-full bg-[#f26457] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#e05346] transition shadow-md shadow-[#f26457]/20"
            >
              Show All Classes
            </button>
          </div>
        )}

        {/* Class Cards Grid */}
        {!loading && !error && filteredClasses.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClasses.map((cls) => (
              <div
                key={cls._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header Media */}
                  <div className="relative h-52 bg-[#dbe6e2] overflow-hidden">
                    {cls.thumbnail?.url ? (
                      <img
                        src={cls.thumbnail.url}
                        alt={cls.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5b8077] font-medium">
                        No Image
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#2d5248] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      {cls.price === 0 ? "Free" : `₹${cls.price}`}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#5b8077] text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                      {cls.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2d5248] mb-1 line-clamp-1">
                      {cls.title}
                    </h3>

                    <p className="text-xs text-[#5b8077] mb-4">
                      With <span className="font-semibold text-[#2d5248]">{cls.instructorId?.userId?.name || "Yoga Guide"}</span>
                    </p>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium">
                        Level: {cls.level}
                      </span>
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium">
                        {cls.duration} mins
                      </span>
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium capitalize">
                        {cls.mode}
                      </span>
                    </div>

                    {/* Schedule Details */}
                    <div className="pt-4 border-t border-slate-100 space-y-1">
                      <p className="text-xs uppercase tracking-wider text-[#5b8077] font-bold">
                        Schedule
                      </p>
                      <p className="text-sm font-semibold text-[#2d5248]">
                        {formatDate(cls.scheduleDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* View Details Action Button */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/classes/${cls._id}`}
                    className="block text-center w-full py-3 rounded-full bg-[#f26457] hover:bg-[#e05346] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#f26457]/20 transition-all active:scale-[0.98]"
                  >
                    View Class
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClassesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fbf9]" />}>
      <ClassesContent />
    </Suspense>
  );
}