"use client";

import Link from "next/link";

const plans = [
  {
    title: "STARTER PLAN",
    subtitle: "Suitable for starter",
    price: "9.90",
    isFeatured: false,
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    features: [
      "2 Yoga Classes / Week",
      "Access to Recorded Sessions",
      "Standard Support",
      "Free Consultation",
    ],
  },
  {
    title: "ADVANCED PLAN",
    subtitle: "Suitable for profession",
    price: "20",
    isFeatured: true,
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    features: [
      "Unlimited Yoga Classes",
      "Access to All Live & Recorded",
      "Personalized Routine Plan",
      "24/7 Dedicated Support",
    ],
  },
  {
    title: "ENTERPRISE PLAN",
    subtitle: "Suitable for corporate",
    price: "50",
    isFeatured: false,
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    features: [
      "Full Corporate Access",
      "Custom Instructor Sessions",
      "1-on-1 Private Coaching",
      "VIP Priority Support",
    ],
  },
];

export default function PriceTablePage() {
  return (
    <div className="bg-white text-slate-800 font-sans">
      {/* 1. Page Header Hero Section */}
      <section className="relative bg-[#eaf2f0] py-20 px-6 text-center overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#3b6861]/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#3b6861]/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-3">
          <h1 className="text-5xl sm:text-6xl font-light text-[#2b5752]">
            Price Table
          </h1>
          <p className="text-slate-500 font-medium tracking-wide text-sm sm:text-base">
            Theme’s Elements
          </p>
        </div>
      </section>

      {/* 2. Section: Price Table With Featured */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 block mb-2">
            Example of price table
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Price Table With Featured
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-4xl">
            A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch shadow-sm">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between transition-transform duration-300 ${
                plan.isFeatured
                  ? "bg-white shadow-2xl z-10 md:-translate-y-2 border-t-4 border-[#3b6861]"
                  : "bg-[#f8fbfb] border border-slate-200/80"
              }`}
            >
              {/* Header Banner */}
              <div
                className={`p-8 text-center flex flex-col items-center justify-center space-y-3 ${
                  plan.isFeatured ? "bg-[#3b6861] text-white" : "bg-[#4a4a4a] text-white"
                }`}
              >
                <div className="mb-1">{plan.icon}</div>
                <h3 className="text-base font-bold tracking-widest uppercase">
                  {plan.title}
                </h3>
                <p className="text-xs text-white/70 font-normal">
                  {plan.subtitle}
                </p>
              </div>

              {/* Price Box */}
              <div className="py-8 px-6 text-center bg-[#f4f7f6] border-b border-slate-200/60">
                <div className="inline-flex items-baseline text-slate-800">
                  <span className="text-2xl font-bold align-top mr-0.5">$</span>
                  <span className="text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 ml-1 uppercase">
                    / MO
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="p-8 flex-1 bg-white">
                <ul className="space-y-4">
                  {plan.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-center justify-center text-sm text-slate-600 font-medium"
                    >
                      <svg
                        className="w-4 h-4 text-slate-700 mr-2.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pb-10 px-8 text-center bg-white">
                <Link
                  href="/pricing"
                  className={`inline-block px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    plan.isFeatured
                      ? "bg-[#3b6861] hover:bg-[#2b5752] text-white shadow-md"
                      : "bg-[#4a4a4a] hover:bg-[#333333] text-white"
                  }`}
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}