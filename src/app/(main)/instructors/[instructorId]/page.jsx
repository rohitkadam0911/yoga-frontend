"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getInstructorByIdApi } from "@/services/instructor.service";
import { getAllClassesApi } from "@/services/class.service";

export default function InstructorDetailPage() {
  const { instructorId } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const instructorRes = await getInstructorByIdApi(instructorId);
        const instructorData = instructorRes.data.data;
        setInstructor(instructorData);

        const classRes = await getAllClassesApi();
        const allClasses = classRes.data.data || [];

        const instructorClasses = allClasses.filter(
          (classItem) => classItem.instructorId?._id === instructorData._id
        );

        setClasses(instructorClasses);
      } catch (err) {
        setError(err.response?.data?.message || "Instructor not found.");
      } finally {
        setLoading(false);
      }
    };

    if (instructorId) {
      fetchInstructor();
    }
  }, [instructorId]);

  if (loading) {
    return (
      <div className="bg-[#f8fbf9] min-h-screen">
        {/* Banner Skeleton */}
        <div className="bg-[#eef3f1] py-10 px-6 animate-pulse">
          <div className="max-w-5xl mx-auto h-5 w-36 bg-slate-200/80 rounded-full" />
        </div>

        {/* Profile Section Skeleton */}
        <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-[280px_1fr] gap-12 items-center">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-56 h-56 rounded-full bg-slate-200/80 animate-pulse" />
            <div className="h-6 w-32 bg-slate-200/80 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="h-10 w-2/3 bg-slate-200/80 rounded-lg animate-pulse" />
            <div className="h-5 w-1/3 bg-slate-200/80 rounded-md animate-pulse" />
            <div className="pt-4 space-y-2">
              <div className="h-5 w-28 bg-slate-200/80 rounded-md animate-pulse" />
              <div className="h-4 w-full bg-slate-200/80 rounded-md animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-200/80 rounded-md animate-pulse" />
              <div className="h-4 w-4/6 bg-slate-200/80 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* Quick Facts Skeleton */}
        <div className="bg-[#eef3f1] px-6 py-14">
          <div className="max-w-5xl mx-auto">
            <div className="h-7 w-36 bg-slate-200/80 rounded-md animate-pulse mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 h-28 flex flex-col justify-center items-center space-y-2 animate-pulse shadow-sm"
                >
                  <div className="h-8 w-12 bg-slate-200/80 rounded-md" />
                  <div className="h-3 w-20 bg-slate-200/80 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Classes Section Skeleton */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="h-8 w-64 bg-slate-200/80 rounded-md animate-pulse mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 p-5 space-y-4 animate-pulse shadow-sm"
              >
                <div className="h-48 bg-slate-200/80 rounded-2xl" />
                <div className="h-6 w-3/4 bg-slate-200/80 rounded-md" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200/80 rounded-md" />
                </div>
                <div className="h-10 w-full bg-slate-200/80 rounded-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2">
          {error || "Instructor not found."}
        </p>
        <Link
          href="/instructors"
          className="text-[#2d5248] font-semibold text-sm hover:underline mt-4 inline-block"
        >
          ← Back to instructors
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fbf9] min-h-screen text-[#2c3e38]">
      {/* Header banner */}
      <section className="bg-[#eef3f1] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/instructors"
            className="text-sm font-semibold text-[#2d5248] hover:underline"
          >
            ← Back to instructors
          </Link>
        </div>
      </section>

      {/* Profile block: circular photo + name/bio side by side */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[280px_1fr] gap-12">
          {/* Circular photo */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-56 h-56 rounded-full bg-[#dbe6e2] flex items-center justify-center overflow-hidden mb-6 shadow-sm">
              {instructor.userId?.profileImage?.url ? (
                <img
                  src={instructor.userId.profileImage.url}
                  alt={instructor.userId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-bold text-[#5b8077]">
                  {instructor.userId?.name?.[0]?.toUpperCase() || "I"}
                </span>
              )}
            </div>

            <span
              className={`text-xs font-semibold px-4 py-1.5 rounded-full ${
                instructor.availability
                  ? "bg-[#eef3f1] text-[#2d5248] border border-[#2d5248]/10"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {instructor.availability
                ? "Available for booking"
                : "Not available"}
            </span>
          </div>

          {/* Name + Bio */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#2d5248] mb-2">
              {instructor.userId?.name}
            </h1>
            <p className="text-lg text-[#5b8077] font-medium mb-8">
              {instructor.qualification || "Yoga Instructor"}
            </p>

            <h2 className="text-xl font-bold text-[#2d5248] mb-3">
              Biography
            </h2>
            <p className="text-slate-600 leading-relaxed font-light">
              {instructor.bio ||
                "This instructor hasn't added a biography yet."}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="bg-[#eef3f1] px-6 py-14">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2d5248] mb-8">
            Quick Facts
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2d5248] mb-1">
                {instructor.experience}
              </p>
              <p className="text-xs uppercase font-bold tracking-wider text-[#5b8077]">
                Years Experience
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2d5248] mb-1">
                ₹{instructor.fees}
              </p>
              <p className="text-xs uppercase font-bold tracking-wider text-[#5b8077]">
                Per Session
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2d5248] mb-1">
                {instructor.totalReviews > 0
                  ? instructor.rating?.toFixed(1)
                  : "—"}
              </p>
              <p className="text-xs uppercase font-bold tracking-wider text-[#5b8077]">
                Rating ({instructor.totalReviews})
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2d5248] mb-1">
                {instructor.languages?.length || 0}
              </p>
              <p className="text-xs uppercase font-bold tracking-wider text-[#5b8077]">
                Languages Spoken
              </p>
            </div>
          </div>

          {/* Expertise + languages */}
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {instructor.expertise?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#2d5248] uppercase tracking-wider mb-3">
                  Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.map((item) => (
                    <span
                      key={item}
                      className="bg-white text-[#2d5248] border border-slate-200 text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {instructor.languages?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#2d5248] uppercase tracking-wider mb-3">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {instructor.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Courses by instructor */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold text-[#2d5248]">
            Classes by {instructor.userId?.name}
          </h2>
          <div className="h-[2px] w-16 bg-[#2d5248]/20" />
        </div>

        {classes.length === 0 ? (
          <div className="bg-[#eef3f1] rounded-3xl p-12 text-center text-slate-500 border border-slate-200/50">
            <p className="text-base font-medium">
              No classes available from this instructor right now.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail with overlay tags */}
                  <div className="relative h-52 bg-[#dbe6e2] overflow-hidden">
                    {classItem.thumbnail?.url ? (
                      <img
                        src={classItem.thumbnail.url}
                        alt={classItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#5b8077] font-medium">
                        No Image
                      </div>
                    )}

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#2d5248] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                      ₹{classItem.price}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-4 left-4 bg-[#5b8077] text-white text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider">
                      {classItem.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#2d5248] mb-3 line-clamp-1">
                      {classItem.title}
                    </h3>

                    {/* Key Meta Badges */}
                    <div className="flex flex-wrap gap-2 mb-4 text-xs">
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium">
                        Level: {classItem.level}
                      </span>
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium">
                        {classItem.duration} mins
                      </span>
                      <span className="bg-[#eef3f1] text-[#2d5248] px-2.5 py-1 rounded-md font-medium capitalize">
                        {classItem.mode}
                      </span>
                    </div>

                    {/* Schedule Details */}
                    <div className="pt-4 border-t border-slate-100 space-y-1">
                      <p className="text-xs uppercase tracking-wider text-[#5b8077] font-bold">
                        Schedule
                      </p>
                      <p className="text-sm font-semibold text-[#2d5248]">
                        {new Date(classItem.scheduleDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>

                      {classItem.startTime && classItem.endTime && (
                        <p className="text-xs text-slate-500">
                          🕒 {classItem.startTime} - {classItem.endTime}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* View Class Button */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href={`/classes/${classItem._id}`}
                    className="block text-center w-full py-3 rounded-full bg-[#f26457] hover:bg-[#e05346] text-white text-xs font-bold tracking-wider uppercase shadow-md shadow-[#f26457]/20 transition-all active:scale-[0.98]"
                  >
                    View Class
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}