"use client";

import { useState } from "react";
import Link from "next/link";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Yoga Meditation Group"
        className="absolute inset-0 w-full h-full bg-radial-[at_25%_25%] object-cover object-center -z-10"
      />

      {/* Teal Color Overlay Matching Yoku Theme */}
      <div className="absolute inset-0 bg-[#2b5752]/75 backdrop-blur-[2px] -z-10" />

      {/* Hero Content Section */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* Top Divider Line & Subheading */}
          <div className="flex items-center justify-center gap-6">
            <span className="h-[1px] w-24 sm:w-36 bg-white/40" />
            <p className="text-white text-xl sm:text-2xl font-serif tracking-widest italic">
              We Are
            </p>
            <span className="h-[1px] w-24 sm:w-36 bg-white/40" />
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-widest uppercase leading-none drop-shadow-sm">
            COMING
            <br />
            SOON
          </h1>

          {/* Bottom Divider Line */}
          <div className="flex justify-center">
            <span className="h-[2px] w-48 sm:w-72 bg-white/50" />
          </div>

          {/* Subtitle */}
          <p className="text-white/90 text-sm sm:text-base font-medium tracking-wide">
            Please subscribe to newsletter to get updates from us.
          </p>

          {/* Subscription Form */}
          <div className="max-w-xl mx-auto pt-2">
            {subscribed ? (
              <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white py-4 px-6 rounded-md text-sm font-medium animate-fade-in">
                Thank you for subscribing! We will notify you when we launch.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-stretch shadow-2xl rounded-sm overflow-hidden"
              >
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-slate-800 placeholder-slate-400 px-6 py-4 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#426b65] hover:bg-[#345651] text-white font-bold text-xs sm:text-sm tracking-widest uppercase px-8 py-4 transition-colors shrink-0"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer Copy */}
      <footer className="w-full py-6 text-center text-xs text-white/60 tracking-wider uppercase z-10">
        © {new Date().getFullYear()} YogaConnect. All Rights Reserved.
      </footer>
    </div>
  );
}