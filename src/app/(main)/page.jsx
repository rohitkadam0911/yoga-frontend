"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllClassesApi } from "@/services/class.service";
import { getAllInstructorsApi } from "@/services/instructor.service";
import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-[#3b6861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Many Styles",
    description: "20+ Styles of Yoga Workout and Meditation that suit everyone.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#3b6861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Pro Instructors",
    description: "Professional Yoga Instructors from around the world.",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-[#3b6861]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Quality Content",
    description: "All Our Classes are Well Planned by Professional Yoga Instructors.",
  },
];

const testimonials = [
  {
    id: 1,
    quote:
      "The Yoga Yajnavalkya is another early text on yoga that provides description of Yoga techniques and its benefits. Two of its Sanskrit palm-leaf manuscripts have been dated accurately.",
    name: "JOHN SMITH",
    role: "Customer",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    id: 2,
    quote:
      "The Yoga Yajnavalkya is another early text on yoga that provides description of Yoga techniques and its benefits. Two of its Sanskrit palm-leaf manuscripts have been dated accurately.",
    name: "JANE DOE",
    role: "Customer",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
];

const marqueeStyles = [
  "Hatha Yoga",
  "Power Yoga",
  "Meditation",
  "Pranayama",
  "Kids Yoga",
  "Prenatal Yoga",
  "Vinyasa Flow",
  "Restorative",
];

export default function HomePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingInstructors, setLoadingInstructors] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getAllClassesApi();
        setClasses(res.data?.data?.slice(0, 3) || []);
      } catch (err) {
        setClasses([]);
      } finally {
        setLoadingClasses(false);
      }
    };

    const fetchInstructors = async () => {
      try {
        const res = await getAllInstructorsApi();
        setInstructors(res.data?.data?.slice(0, 3) || res.data?.slice(0, 3) || []);
      } catch (err) {
        setInstructors([]);
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchClasses();
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  return (
    <div className="bg-[#f6f9f8] text-slate-800 font-sans overflow-x-hidden selection:bg-[#3b6861] selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-6 lg:px-16 pt-8 pb-16 overflow-hidden">
        <div className="absolute top-12 right-0 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] bg-[#ee5950] rounded-full translate-x-1/4 -translate-y-10 pointer-events-none z-0" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-slate-800 leading-[1.1] tracking-tight">
              Online <br />
              <span className="font-bold text-[#2a4d46]">Yoga Classes</span>
            </h1>

            <p className="text-slate-600 text-lg max-w-md leading-relaxed">
              Trusted by 100,000+ practitioners. Certified instructors guiding your daily movement and mental balance.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/classes"
                className="px-8 py-3.5 rounded-full bg-[#3b6861] hover:bg-[#2e524d] text-white font-medium text-base transition-all shadow-md shadow-teal-900/10"
              >
                View Classes
              </Link>
              {user ? (
                <span className="text-sm font-semibold text-[#2a4d46]">
                  Welcome back, {user.name?.split(" ")[0]}!
                </span>
              ) : (
                <Link
                  href="/signup"
                  className="px-8 py-3.5 rounded-full border border-[#3b6861] text-[#3b6861] hover:bg-[#3b6861]/10 font-medium text-base transition-all"
                >
                  Join Us
                </Link>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center items-center">
            <div className="absolute w-[350px] h-[350px] bg-[#3b6861]/10 rounded-full blur-2xl -z-10" />

            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <Image
                src="https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=1000"
                alt="Yoga practitioner posture"
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />

              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#40c3a7] animate-ping" />
                <div>
                  <p className="text-xs font-bold text-[#2a4d46]">Daily Mindfulness</p>
                  <p className="text-[10px] text-slate-500">Live sessions every morning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Ticker Bar */}
      <section className="bg-[#2a4d46] py-3.5 overflow-hidden">
        <div className="hero-marquee flex whitespace-nowrap">
          {[...marqueeStyles, ...marqueeStyles].map((style, i) => (
            <span
              key={i}
              className="text-teal-50 text-xs sm:text-sm font-medium tracking-widest uppercase mx-8 flex items-center gap-8"
            >
              {style}
              <span className="text-emerald-300 text-xs">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className="p-3.5 rounded-2xl bg-[#f0f6f4] mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#2a4d46] mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Classes Showcase */}
      <section className="px-6 lg:px-16 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2a4d46] mb-3">
                Popular Online Classes
              </h2>
              <p className="text-slate-500 text-sm sm:text-base max-w-xl">
                Discover structured movements, breathwork, and guided routines crafted for all skill levels.
              </p>
            </div>
            <Link
              href="/classes"
              className="px-6 py-2.5 rounded-full bg-[#3b6861] text-white font-medium text-sm hover:bg-[#2e524d] transition-colors inline-flex items-center gap-2"
            >
              Browse All Classes →
            </Link>
          </div>

          {loadingClasses && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          )}

          {!loadingClasses && classes.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              No live classes available at this moment.
            </div>
          )}

          {!loadingClasses && classes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {classes.map((cls) => (
                <Link
                  key={cls._id}
                  href={`/classes/${cls._id}`}
                  className="group bg-[#fbfdfc] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
                    {cls.thumbnail?.url ? (
                      <Image
                        src={cls.thumbnail.url}
                        alt={cls.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-teal-100/50 text-[#2a4d46] font-semibold text-sm">
                        {cls.category}
                      </div>
                    )}
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#2a4d46] text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
                      {cls.category}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1">
                        With {cls.instructorId?.userId?.name || cls.instructorId?.name || "Instructor"}
                      </p>
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-[#3b6861] transition-colors mb-4">
                        {cls.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <div className="text-xs text-slate-500 space-x-1">
                        <span>{cls.duration} min</span>
                        <span>•</span>
                        <span>{formatDate(cls.scheduleDate)}</span>
                      </div>
                      <span className="text-[#3b6861] font-bold text-base">
                        {cls.price === 0 ? "Free" : `₹${cls.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Instructors Section */}
      <section className="px-6 lg:px-16 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2a4d46] mb-3">
              Our Instructors
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Professional practitioners committed to bringing physical clarity and mental calmness to your daily life.
            </p>
          </div>

          {loadingInstructors && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          )}

          {!loadingInstructors && instructors.length === 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
              No instructor profiles available at the moment.
            </div>
          )}

          {!loadingInstructors && instructors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {instructors.map((ins) => {
                const instructorId = ins._id || ins.id;
                const instructorName = ins.userId?.name || ins.name || "Instructor";
                const profileImage = ins.userId?.profileImage?.url || null;

                const classCountText = ins.classesCount
                  ? `${ins.classesCount} ${ins.classesCount === 1 ? "Class" : "Classes"}`
                  : ins.specialization || ins.bio || "Certified Instructor";

                return (
                  <Link
                    key={instructorId}
                    href={`/instructors/${instructorId}`}
                    className="group text-center block focus:outline-none"
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-all duration-300 bg-slate-100">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt={instructorName}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50 text-[#3b6861] text-4xl font-bold">
                          {instructorName?.[0]?.toUpperCase() || "I"}
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#3b6861] transition-colors">
                      {instructorName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 line-clamp-1">
                      {classCountText}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="px-6 lg:px-16 py-20 bg-[#eef4f2] border-t border-b border-teal-900/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2a4d46] mb-2">
                Testimonial
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                What people say about us
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#3b6861] shadow-sm flex flex-col justify-between space-y-6"
              >
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  &quot;{item.quote}&quot;
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wider text-[#2a4d46] uppercase">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="px-6 lg:px-16 py-24 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full border border-teal-800/10 flex items-center justify-center bg-[#f0f6f4] text-[#3b6861]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2a4d46]">
            Subscribe to our newsletter
          </h2>

          <p className="text-slate-500 text-sm sm:text-base">
            Get updates for new classes and new products
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 font-medium text-sm border border-emerald-200">
              Thank you for subscribing! Check your inbox soon for updates.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              suppressHydrationWarning
              className="flex flex-col sm:flex-row items-center max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded-full p-1.5 shadow-sm focus-within:border-[#3b6861] transition-colors"
            >
              <div className="flex items-center w-full px-4 py-2">
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={email}
                  onChange={handleChange}
                  suppressHydrationWarning
                  className="w-full bg-transparent border-none text-sm text-slate-700 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#3b6861] hover:bg-[#2e524d] text-white font-medium text-sm transition-all shadow-sm shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes hero-marquee-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .hero-marquee {
          animation: hero-marquee-scroll 30s linear infinite;
          width: max-content;
        }
      `}</style>
    </div>
  );
}