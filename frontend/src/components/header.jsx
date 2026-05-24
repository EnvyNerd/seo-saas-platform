import { Link, useLocation } from "react-router-dom";
import { Search, User, Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const PRIMARY_NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/seo-audit", label: "SEO Audit" },
  { to: "/keywords", label: "Keywords" },
  { to: "/content", label: "Content" },
  { to: "/analytics", label: "Analytics" },
];

const SECONDARY_NAV = [
  { to: "/solutions", label: "Solutions" },
  { to: "/products", label: "Products & Services" },
  { to: "/sustainability", label: "Sustainability" },
  { to: "/news", label: "News & Insights" },
  { to: "/about", label: "About Us" },
];

export default function SLBHeader() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* TOP ROW: Logo + Primary Navigation */}
      <div className="flex items-center">
        {/* Logo Area (White) */}
        <div className="bg-white px-4 lg:px-8 h-16 flex items-center border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            {/* Replace with your actual SVG logo */}
            <div className="flex items-center gap-1.5">
              <svg width="32" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slb-navy">
                <path d="M4 12C4 7.58172 7.58172 4 12 4H16V20H12C7.58172 20 4 16.4183 4 12Z" fill="currentColor"/>
                <path d="M20 4H36V8H20V4Z" fill="currentColor"/>
                <path d="M20 16H36V20H20V16Z" fill="currentColor"/>
              </svg>
              <span className="text-2xl font-bold tracking-tighter text-slb-navy font-display">slb</span>
            </div>
            <span className="hidden sm:block text-xl font-light text-slb-blue-500 tracking-tight">100</span>
          </Link>
        </div>

        {/* Primary Nav (Blue Bar) */}
        <div className="flex-1 bg-slb-navy h-16 flex items-center px-4 lg:px-8 gap-6 lg:gap-8 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-6 lg:gap-8" aria-label="Primary navigation">
            {PRIMARY_NAV.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-white border-b-2 border-white pb-0.5"
                      : "text-white/80 hover:text-white hover:bg-white/10 px-2 py-1 rounded"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Utility Actions */}
          <div className="ml-auto flex items-center gap-4 lg:gap-6 text-white/90">
            <Link to="/contact" className="hidden lg:block text-sm font-medium hover:text-white">Contact</Link>
            <button className="flex items-center gap-2 text-sm font-medium hover:text-white">
              <User size={18} /> <span className="hidden sm:inline">Log In</span>
            </button>
            <button className="flex items-center gap-2 text-sm hover:text-white">
              <Globe size={18} /> <span className="hidden sm:inline">En</span>
            </button>
            <button className="p-1 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            <button
              className="lg:hidden p-2 hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY ROW: White Background */}
      <div className="hidden lg:flex items-center gap-8 px-8 h-12 bg-white border-b border-slate-200">
        {SECONDARY_NAV.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-sm font-medium text-slb-navy hover:text-slb-blue-500 border-b-2 border-transparent hover:border-slb-blue-500 transition-all py-3"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 animate-fadeInUp">
          <div className="flex flex-col p-4 gap-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Main</p>
            {PRIMARY_NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === to
                    ? "bg-slb-navy text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <hr className="my-3 border-slate-200" />
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Explore</p>
            {SECONDARY_NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-md transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
