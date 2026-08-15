import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient decorative circles, matching your brand's soft blob style */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-emerald-100/60" />
      <div className="absolute bottom-16 right-16 w-56 h-56 rounded-full bg-emerald-100/60" />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 rounded-full bg-amber-100/60" />

      <div className="relative max-w-lg text-center">
        {/* Simple original illustration: a figure in seated meditation, breathing */}
        <svg
          viewBox="0 0 200 160"
          className="w-40 h-32 mx-auto mb-8"
          role="img"
          aria-label="Illustration of a figure meditating calmly"
        >
          <ellipse cx="100" cy="145" rx="70" ry="8" fill="#065f46" opacity="0.08" />
          <g
            fill="none"
            stroke="#065f46"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="100" cy="55" r="16" />
            <path d="M 100 71 L 100 105" />
            <path d="M 100 105 C 80 108, 65 120, 60 132" />
            <path d="M 100 105 C 120 108, 135 120, 140 132" />
            <path d="M 100 85 C 85 90, 72 100, 68 112" />
            <path d="M 100 85 C 115 90, 128 100, 132 112" />
          </g>
        </svg>

        <p className="text-emerald-600 font-medium tracking-wide mb-3">
          404 - Off the mat
        </p>
        <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto">
          This page must have wandered off during savasana. Let's get you
          back to something real.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Back to Home
          </Link>
          <Link
            href="/classes"
            className="border border-emerald-600 text-emerald-700 px-6 py-3 rounded-lg font-medium hover:bg-emerald-100 transition"
          >
            Browse Classes
          </Link>
        </div>
      </div>
    </div>
  );
}