"use client";

import { useState } from "react";

const faqData = [
  {
    category: "General & Classes",
    questions: [
      {
        q: "What types of yoga classes do you offer?",
        a: "We offer both online live-streamed classes and in-person studio sessions. Our styles range from Gentle Hatha, Vinyasa Flow, and Ashtanga to Power Yoga and guided Meditation.",
      },
      {
        q: "Are the classes suitable for complete beginners?",
        a: "Yes! We have dedicated 'Beginner-Friendly' filters on our classes page. Our instructors provide options and modifications for every skill level.",
      },
      {
        q: "What do I need to bring for an in-person class?",
        a: "We recommend bringing your own yoga mat, a water bottle, and a small towel. Blocks and straps are available at our studio centers.",
      },
    ],
  },
  {
    category: "Bookings & Payments",
    questions: [
      {
        q: "How do I book a class?",
        a: "Simply browse our 'Classes' page, select a session that fits your schedule, choose whether you want to attend online or in-person, and click 'Book Now'.",
      },
      {
        q: "Can I cancel or reschedule my booking?",
        a: "Yes, you can cancel or reschedule up to 2 hours before the class starts through your Account Dashboard under 'My Bookings'.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, and YogaConnect class pass credits.",
      },
    ],
  },
  {
    category: "Online Sessions & Account",
    questions: [
      {
        q: "How do I join an online live class?",
        a: "Once booked, a link to the virtual studio will be available in your Dashboard under 'My Bookings' 15 minutes before the class begins.",
      },
      {
        q: "What if I experience technical issues during an online class?",
        a: "If your connection drops or you experience technical issues on our end, please reach out to support@yogaconnect.com for a class credit refund.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">
            Help & Support
          </span>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-base text-slate-600">
            Have questions? We're here to help. Find answers to common questions about YogaConnect below.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search questions (e.g., booking, online, mat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 pl-12 text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm text-sm"
            />
            <svg
              className="absolute left-4 top-4 h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-8">
          {faqData.map((section, sectionIdx) => {
            const filteredQuestions = section.questions.filter(
              (item) =>
                item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredQuestions.length === 0) return null;

            return (
              <div key={sectionIdx} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                  {section.category}
                </h2>

                <div className="space-y-3">
                  {filteredQuestions.map((item, itemIdx) => {
                    const uniqueId = `${sectionIdx}-${itemIdx}`;
                    const isOpen = openIndex === uniqueId;

                    return (
                      <div
                        key={uniqueId}
                        className="bg-white rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleAccordion(uniqueId)}
                          className="w-full flex items-center justify-between p-5 text-left font-medium text-slate-900 hover:text-emerald-600 focus:outline-none"
                        >
                          <span className="text-base font-semibold">{item.q}</span>
                          <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <svg
                              className={`h-4 w-4 transform transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
          <h3 className="text-xl font-bold text-slate-900">Still have questions?</h3>
          <p className="mt-2 text-sm text-slate-600">
            Can't find the answer you're looking for? Please reach out to our team.
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-all"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}