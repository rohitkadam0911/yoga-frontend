"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaPinterestP,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

export default function MaintenancePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Image */}
      <img
        src="https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1920"
        alt="Yoga Meditation Group"
        className="absolute inset-0 w-full h-full object-cover object-center -z-10"
      />

      {/* Teal Color Overlay Matching Yoku Theme */}
      <div className="absolute inset-0 bg-[#2b5752]/75 backdrop-blur-[2px] -z-10" />

      {/* Top Header Logo */}
      <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto z-10">
        <Link
          href="/"
          className="text-white font-semibold text-lg tracking-wider uppercase hover:opacity-80 transition-opacity"
        >
          YogaConnect
        </Link>
      </header>

      {/* Hero Content Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 z-10">
        <div className="max-w-3xl w-full text-left space-y-6">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            Maintenance Mode
          </h1>

          {/* Subheading */}
          <p className="text-white/95 text-lg sm:text-xl font-medium tracking-wide">
            Our website is going under maintenance. We will be back very soon!.
          </p>

          {/* Body Text */}
          <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            A wonderful serenity has taken possession of my entire soul, like
            these sweet mornings of spring which I enjoy with my whole heart. I
            am alone, and feel the charm of existence in this spot, which was
            created for the bliss of souls like mine.
          </p>

          {/* Progress Bar Container */}
          <div className="pt-4 max-w-xl">
            <div className="relative h-12 w-full bg-[#6a8d88]/70 overflow-hidden shadow-lg flex items-center">
              {/* Active Progress Fill using CSS Keyframe Animation */}
              <div className="animate-progress-fill h-full bg-white flex items-center justify-between px-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
                  CURRENT PROCESS
                </span>
                <span className="text-xs font-bold text-slate-700">
                  85%
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fillProgress {
          from {
            width: 0%;
          }
          to {
            width: 85%;
          }
        }
        .animate-progress-fill {
          animation: fillProgress 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}