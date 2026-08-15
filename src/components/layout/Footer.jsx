import Link from "next/link";

const quickLinks = [
  { href: "/classes", label: "Classes" },
  { href: "/instructors", label: "Instructors" },
  { href: "/blog", label: "Blog" },
  { href: "/signup", label: "Become a Member" },
];

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/profile", label: "My Profile" },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", short: "FB" },
  { href: "https://twitter.com", label: "X (Twitter)", short: "X" },
  { href: "https://instagram.com", label: "Instagram", short: "IG" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1d3833] text-teal-100/70 border-t border-[#2a4d46]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-wide inline-block hover:text-[#40c3a7] transition-colors"
          >
            YogaConnect
          </Link>
          <p className="text-sm leading-relaxed text-teal-100/60 max-w-xs">
            Book certified yoga instructors, join live or in-studio sessions, and build a practice that fits your life.
          </p>
        </div>

        {/* Navigation Links Column */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#2a4d46] pb-2">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-teal-100/70 hover:text-[#40c3a7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#2a4d46] pb-2">
              Account
            </h3>
            <ul className="space-y-3">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-teal-100/70 hover:text-[#40c3a7] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-b border-[#2a4d46] pb-2">
            Get in Touch
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:hello@yogaconnect.com"
                className="text-teal-100/70 hover:text-[#40c3a7] transition-colors flex items-center gap-2"
              >
                <span>hello@yogaconnect.com</span>
              </a>
            </li>
            <li>
              <a
                href="tel:18000000000"
                className="text-teal-100/70 hover:text-[#40c3a7] transition-colors flex items-center gap-2"
              >
                <span>1800-000-0000</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2a4d46]/60 bg-[#172e2a]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-teal-100/50">
            Copyright {year} YogaConnect. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-full bg-[#2a4d46] border border-teal-800/40 flex items-center justify-center text-xs font-semibold text-teal-100/80 hover:bg-[#40c3a7] hover:text-slate-900 transition-all duration-300"
              >
                {social.short}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}