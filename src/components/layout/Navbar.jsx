"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const ABOUT_DROPDOWN = [
  { href: "/about", label: "About" },
  { href: "/instructors", label: "Our Instructors" },
  { href: "/timetable", label: "Timetable" },
  { href: "/faq", label: "FAQ" },
];

const CLASSES_DROPDOWN = [
  { href: "/classes?mode=offline", label: "Offline Classes" },
  { href: "/classes?mode=online", label: "Online Classes" },
];

const PAGES_DROPDOWN = [
  { href: "/contact", label: "Contact Us" },
  { href: "/pricing", label: "Pricing Table" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/coming-soon", label: "Coming Soon" },
  { href: "/404", label: "404 Page" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Desktop Dropdown State
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Mobile Accordion States
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileClassesOpen, setMobileClassesOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setMobileAboutOpen(false);
    setMobileClassesOpen(false);
    setMobilePagesOpen(false);
  };

  // Swapped Logic: Attached to Logo click
  const handleLogoClick = (e) => {
    e.preventDefault();
    closeMobileMenu();
    if (pathname === "/") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  const handleMobileNavigate = (href) => {
    closeMobileMenu();
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/60 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Uses handleLogoClick now */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 group cursor-pointer">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 transition-transform group-hover:scale-105">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
              <path d="M12 6a6 6 0 0 0-6 6c0 3.3 2.7 6 6 6s6-2.7 6-6a6 6 0 0 0-6-6z"/>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            Yoga<span className="text-emerald-600">Connect</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Desktop Home Link - Uses standard Next.js Link now */}
          <Link
            href="/"
            className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
              pathname === "/"
                ? "text-emerald-700 font-semibold bg-emerald-50/80"
                : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Home
          </Link>

          {/* Desktop About Us */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("about")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                ABOUT_DROPDOWN.some((item) => item.href === pathname)
                  ? "text-emerald-700 font-semibold bg-emerald-50/80"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
              }`}
            >
              <span>About Us</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === "about" && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 transition-all z-50">
                {ABOUT_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Classes */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("classes")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                pathname.startsWith("/classes")
                  ? "text-emerald-700 font-semibold bg-emerald-50/80"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
              }`}
            >
              <span>Classes</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === "classes" && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 transition-all z-50">
                {CLASSES_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Pages */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("pages")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                PAGES_DROPDOWN.some((item) => item.href === pathname)
                  ? "text-emerald-700 font-semibold bg-emerald-50/80"
                  : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
              }`}
            >
              <span>Pages</span>
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === "pages" && (
              <div className="absolute left-0 mt-1 w-48 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 transition-all z-50">
                {PAGES_DROPDOWN.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Blog */}
          <Link
            href="/blog"
            className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
              pathname === "/blog"
                ? "text-emerald-700 font-semibold bg-emerald-50/80"
                : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-200" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full p-1 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold ring-2 ring-emerald-600/20">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <svg className={`h-4 w-4 text-slate-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5 transition-all z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                  </div>

                  {user.role === "user" && (
                    <Link
                      href="/bookings"
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      My Bookings
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    Profile Settings
                  </Link>

                  <button
                    onClick={logout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-all"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => (isOpen ? closeMobileMenu() : setIsOpen(true))}
          type="button"
          aria-label="Toggle Menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && createPortal(
        <div 
          className="fixed inset-x-0 top-16 bottom-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden overflow-y-auto"
          onClick={closeMobileMenu}
        >
          <div 
            className="bg-white px-6 pb-8 pt-4 shadow-xl border-b border-slate-100 max-h-[calc(100vh-4rem)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-1">
              {/* Mobile Home Link */}
              <button
                type="button"
                onClick={() => handleMobileNavigate("/")}
                className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Home
              </button>

              {/* Mobile About Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span>About Us</span>
                  <svg className={`h-4 w-4 transition-transform ${mobileAboutOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileAboutOpen && (
                  <div className="pl-4 space-y-1 my-1">
                    {ABOUT_DROPDOWN.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleMobileNavigate(item.href)}
                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Classes Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileClassesOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span>Classes</span>
                  <svg className={`h-4 w-4 transition-transform ${mobileClassesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileClassesOpen && (
                  <div className="pl-4 space-y-1 my-1">
                    {CLASSES_DROPDOWN.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleMobileNavigate(item.href)}
                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Pages Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobilePagesOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  <span>Pages</span>
                  <svg className={`h-4 w-4 transition-transform ${mobilePagesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobilePagesOpen && (
                  <div className="pl-4 space-y-1 my-1">
                    {PAGES_DROPDOWN.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => handleMobileNavigate(item.href)}
                        className="block w-full text-left rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Blog */}
              <button
                type="button"
                onClick={() => handleMobileNavigate("/blog")}
                className="block w-full text-left rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Blog
              </button>
            </nav>

            <div className="mt-4 pt-4 border-t border-slate-100">
              {loading ? (
                <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                  </div>

                  {user.role === "user" && (
                    <button
                      type="button"
                      onClick={() => handleMobileNavigate("/bookings")}
                      className="block w-full text-left rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      My Bookings
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate("/profile")}
                    className="block w-full text-left rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Profile Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      logout();
                    }}
                    className="w-full text-left rounded-lg px-3 py-2 text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate("/login")}
                    className="w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate("/signup")}
                    className="w-full text-center rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}