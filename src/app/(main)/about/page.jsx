"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#f7f9f8] text-[#2c3e38] font-sans overflow-x-hidden selection:bg-[#5b8077] selection:text-white">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative pt-20 pb-16 px-6 text-center bg-gradient-to-b from-[#eef3f1] to-[#f7f9f8] overflow-hidden">
        {/* Soft Background Circles/Waves */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#e3ebe8] -z-0 translate-x-1/3 -translate-y-1/3 blur-3xl opacity-60" />
        <div className="absolute bottom-4 left-1/4 w-16 h-16 rounded-full border-4 border-[#e3ebe8] -z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-[#2d5248] tracking-tight">
            About
          </h1>
        </div>
      </section>

      {/* 2. ABOUT OUR SCHOOL SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Overlapping Images */}
        <div className="lg:col-span-6 relative flex justify-center items-center">
          {/* Main Curved Image */}
          <div className="relative z-10 w-[280px] sm:w-[340px] h-[380px] sm:h-[440px] rounded-t-[140px] rounded-b-[40px] overflow-hidden shadow-xl border-4 border-white bg-[#dbe6e2]">
            <img
              src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800"
              alt="Yoga Instructors"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Side Floating Image 1 */}
          <div className="absolute left-0 bottom-4 z-20 w-[140px] sm:w-[180px] h-[180px] sm:h-[220px] rounded-2xl overflow-hidden shadow-lg border-4 border-white -translate-x-4 sm:-translate-x-8 bg-[#dbe6e2]">
            <img
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600"
              alt="Yoga Practice"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Side Floating Image 2 (FIXED URL & FALLBACK) */}
          <div className="absolute right-2 top-8 z-0 w-[120px] sm:w-[160px] h-[160px] sm:h-[200px] rounded-2xl overflow-hidden shadow-md border-4 border-white translate-x-4 bg-[#dbe6e2]">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600"
              alt="Yoga Meditation"
              className="w-full h-full object-cover opacity-90"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600";
              }}
            />
          </div>
        </div>

        {/* Right Side: Text Content */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-wider text-[#5b8077] uppercase">About Our School</span>
            <div className="w-12 h-[2px] bg-[#5b8077]/30" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#2d5248] leading-tight">
            How we become Yoga-Connect
          </h2>

          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            Modern yoga consists of a range of techniques including asanas (postures) and meditation derived from some of the philosophies, teachings and practices of the Yoga school, which is one of the six schools of traditional Hindu philosophies, and organised into a wide variety of schools and denominations. It has been described by Elizabeth de Michelis as having four types, namely: Modern Psychosomatic Yoga, as in The Yoga Institute.
          </p>

          <div className="pt-2">
            <Link
              href="/instructors"
              className="inline-block px-8 py-4 rounded-full bg-[#f26457] hover:bg-[#e05346] text-white font-bold text-sm shadow-lg shadow-[#f26457]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Meet Instructors
            </Link>
          </div>
        </div>
      </section>

      {/* 3. OUR FAITH / INCLUSIVE YOGA GRID SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Cards */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold tracking-wider text-[#5b8077] uppercase">Our Faith</span>
                <div className="w-12 h-[2px] bg-[#5b8077]/30" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2d5248]">
                We believe in Making Yoga Inclusive
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5b8077] text-white flex items-center justify-center text-2xl shadow-md">
                  🧘‍♂️
                </div>
                <h3 className="text-lg font-bold text-[#2d5248]">How we become Yoku</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Modern yoga consists of a range of techniques including asanas and meditation derived.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5b8077] text-white flex items-center justify-center text-2xl shadow-md">
                  🪷
                </div>
                <h3 className="text-lg font-bold text-[#2d5248]">How we become Yoku</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Modern yoga consists of a range of techniques including asanas and meditation derived.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5b8077] text-white flex items-center justify-center text-2xl shadow-md">
                  🧘‍♀️
                </div>
                <h3 className="text-lg font-bold text-[#2d5248]">Mindful Practice</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Comprehensive exercises designed for every body type and ability level.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#5b8077] text-white flex items-center justify-center text-2xl shadow-md">
                  ✨
                </div>
                <h3 className="text-lg font-bold text-[#2d5248]">Holistic Living</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Connecting physical postures with mental clarity and emotional peace.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Large Pose Image */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-md h-[450px] sm:h-[550px] bg-[#dbe6e2] rounded-tr-[180px] rounded-bl-[100px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
                alt="Inclusive Yoga Pose"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 4. WHAT'S THE NUMBERS SECTION */}
      <section className="bg-[#eef3f1] py-20 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d5248]">
            What's the numbers
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Modern yoga consists of a range of techniques including asanas (postures) and meditation derived from some of the philosophies, teachings and practices of the Yoga school, which is one of the six schools of traditional Hindu.
          </p>
          <div>
            <Link
              href="/classes"
              className="inline-block px-8 py-3.5 rounded-full bg-white text-[#2d5248] font-bold text-sm border border-slate-200 hover:bg-slate-50 shadow-sm transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>

        {/* Counter Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl text-[#5b8077] mb-2">🧘</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#2d5248]">1M</div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">Class Views</p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl text-[#5b8077] mb-2">🤝</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#2d5248]">48K</div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">Happy Students</p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl text-[#5b8077] mb-2">🙏</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#2d5248]">90%</div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">Satisfaction</p>
          </div>

          <div className="space-y-2">
            <div className="text-3xl text-[#5b8077] mb-2">👌</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-[#2d5248]">20</div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5b8077]">Awesome Instructors</p>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d5248] mb-2">
              Testimonial
            </h2>
            <p className="text-slate-500 text-sm">What people say about us</p>
          </div>
          {/* Slider Arrows */}
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#5b8077] hover:text-[#5b8077] transition">
              ←
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#5b8077] hover:text-[#5b8077] transition">
              →
            </button>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-b-4 border-b-[#5b8077] shadow-sm space-y-6">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              "The Yoga Yajnavalkya is another early text on yoga that provides description of Yoga techniques and its benefits. Two of its Sanskrit palm-leaf manuscripts have been dated, one is from the early 10th-century CE and another more firmly."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="John Smith"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-[#2d5248] uppercase text-sm tracking-wide">John Smith</h4>
                <p className="text-xs text-slate-400">Customer</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border-b-4 border-b-[#5b8077] shadow-sm space-y-6">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              "The Yoga Yajnavalkya is another early text on yoga that provides description of Yoga techniques and its benefits. Two of its Sanskrit palm-leaf manuscripts have been dated, one is from the early 10th-century CE and another more firmly."
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200"
                alt="Jane Doe"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold text-[#2d5248] uppercase text-sm tracking-wide">Jane Doe</h4>
                <p className="text-xs text-slate-400">Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SPONSOR / LOGO BANNER */}
      <section className="py-12 border-y border-slate-200/60 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
          <div className="font-serif text-lg font-bold text-[#2d5248]">YOGA CREATIVE</div>
          <div className="font-serif text-lg font-bold text-[#2d5248]">YOGA CLUB</div>
          <div className="font-serif text-lg font-bold text-[#2d5248]">TROPICAL BEAUTY</div>
          <div className="font-serif text-lg font-bold text-[#2d5248]">FLORA BEAUTY</div>
        </div>
      </section>

      {/* 7. NEWSLETTER SECTION */}
      <section className="py-20 px-6 bg-[#eef3f1] text-center relative">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2d5248]">
            Subscribe to our newsletter
          </h2>
          <p className="text-slate-500 text-sm">
            Get updates for new classes and new products
          </p>

          <form onSubmit={handleNewsletter} className="pt-6 flex justify-center">
            <div className="relative w-full max-w-xl flex items-center bg-white rounded-full p-2 shadow-md">
              <span className="pl-4 text-slate-400">✈️</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full px-4 py-3 bg-transparent text-slate-700 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-[#5b8077] hover:bg-[#4a6b63] text-white text-xs font-bold tracking-wider uppercase transition shrink-0"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}