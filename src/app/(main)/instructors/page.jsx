"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllInstructorsApi } from "@/services/instructor.service";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await getAllInstructorsApi();
        setInstructors(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load instructors.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const stats = useMemo(() => {
    if (instructors.length === 0) return null;

    const totalExperience = instructors.reduce(
      (sum, i) => sum + (i.experience || 0),
      0
    );
    const avgRating =
      instructors.filter((i) => i.totalReviews > 0).reduce((sum, i) => sum + i.rating, 0) /
      (instructors.filter((i) => i.totalReviews > 0).length || 1);
    const languageSet = new Set(instructors.flatMap((i) => i.languages || []));
    const availableCount = instructors.filter((i) => i.availability).length;

    return {
      totalExperience,
      avgRating: avgRating.toFixed(1),
      languages: languageSet.size,
      availableCount,
    };
  }, [instructors]);

  return (
    <div className="bg-[#f8fbf9] text-[#2c3e38] font-sans min-h-screen overflow-x-hidden">
      
      {/* 1. HERO TITLE SECTION */}
      <section className="pt-15 pb-8 text-center relative px-6">
        {/* Abstract Background Curve Deco */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-100/40 rounded-full blur-3xl -z-10" />
        
        <h1 className="text-4xl sm:text-6xl font-bold text-[#2d5248] tracking-tight mb-3">
          Our Instructors
        </h1>
        <p className="text-[#5b8077] font-medium text-lg sm:text-xl">
          Our Story
        </p>
      </section>

      {/* 2. FEATURED STORY SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Side Oval Cutout Photo */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm h-[400px] rounded-t-full bg-[#dbe6e2] overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800"
              alt="Lead Instructor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Side Quote Content */}
        <div className="md:col-span-7 space-y-6">
          <span className="text-6xl sm:text-7xl font-serif text-[#f26457] leading-none block -mb-4">
            “
          </span>
          <p className="text-slate-600 italic text-lg sm:text-xl leading-relaxed font-light">
            Modern yoga consists of a range of techniques including asanas and meditation derived from some of the philosophies, teachings and practices of the Yoga school, which is one of the six schools of traditional Hindu philosophies, and organised into a wide variety of schools and denominations.
          </p>
          <div>
            <h4 className="text-xl font-bold text-[#2d5248]">Anna Curtis</h4>
            <p className="text-sm text-[#5b8077]">Vinyasa Yoga</p>
          </div>
        </div>
      </section>

      {/* 3. INSTRUCTORS GRID SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2d5248]">
              Our Instructors
            </h2>
            <div className="h-[2px] w-16 bg-[#2d5248]/20" />
          </div>
          <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-2xl leading-relaxed">
            A meditative means of discovering dysfunctional perception and cognition, as well as overcoming it to release any suffering, find inner peace and salvation.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[4/5] bg-slate-200/60 rounded-xl animate-pulse" />
                <div className="h-6 w-1/2 bg-slate-200/60 rounded animate-pulse mx-auto" />
                <div className="h-4 w-1/3 bg-slate-200/60 rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded-xl p-4 text-center">
            {error}
          </p>
        )}

        {/* Empty State */}
        {!loading && !error && instructors.length === 0 && (
          <p className="text-slate-500 text-center py-12">
            No instructors available yet.
          </p>
        )}

        {/* Instructors Dynamic Grid */}
        {!loading && !error && instructors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {instructors.map((instructor) => (
              <Link
                key={instructor._id}
                href={`/instructors/${instructor._id}`}
                className="group text-center block"
              >
                {/* Image Container with Hover Scale */}
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#dbe6e2] mb-5 shadow-sm group-hover:shadow-md transition">
                  {instructor.userId?.profileImage?.url ? (
                    <img
                      src={instructor.userId.profileImage.url}
                      alt={instructor.userId.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100/50">
                      <span className="text-6xl font-bold text-[#5b8077]">
                        {instructor.userId?.name?.[0]?.toUpperCase() || "I"}
                      </span>
                    </div>
                  )}

                  {/* Fee Overlay Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#2d5248] shadow-sm">
                    ₹{instructor.fees}/session
                  </div>
                </div>

                {/* Name & Title Below Image */}
                <h3 className="text-xl font-bold text-[#2d5248] group-hover:text-[#5b8077] transition mb-1">
                  {instructor.userId?.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {instructor.expertise?.length > 0
                    ? instructor.expertise.slice(0, 2).join(" · ")
                    : instructor.qualification || "Yoga Instructor"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. STATS SECTION ("What's the numbers") */}
      {stats && (
        <section className="bg-[#eef3f1] py-20 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d5248]">
              What’s the numbers
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Modern yoga consists of a range of techniques including asanas (postures) and meditation derived from some of the philosophies, teachings and practices of the Yoga school, which is one of the six schools of traditional Hindu.
            </p>
            <div>
              <Link
                href="/classes"
                className="inline-block px-8 py-3.5 rounded-full bg-white text-[#2d5248] font-bold text-sm shadow-sm border border-slate-200 hover:bg-slate-50 transition"
              >
                Browse Courses
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#2d5248] mb-2">
                {instructors.length}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">
                Instructors
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#2d5248] mb-2">
                {stats.totalExperience}+
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">
                Years Combined Exp.
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#2d5248] mb-2">
                {stats.avgRating > 0 ? `${stats.avgRating}` : "—"}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">
                Avg Rating
              </p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold text-[#2d5248] mb-2">
                {stats.languages}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">
                Languages Spoken
              </p>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}