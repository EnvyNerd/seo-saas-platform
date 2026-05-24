import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Globe, FileText, BarChart3, Sparkles, Target, MessageSquare, Activity } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/strategy", icon: Sparkles, label: "SEO Strategy" },
  { to: "/seo-audit", icon: Search, label: "SEO Audit" },
  { to: "/keywords", icon: Globe, label: "Keyword Generator" },
  { to: "/content", icon: FileText, label: "Content Generator" },
  { to: "/competitors", icon: Target, label: "Competitors & Gap" },
  { to: "/chat", icon: MessageSquare, label: "AI Chat Assistant" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Activity, label: "System Diagnostics" },
];


function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-light)] px-4 py-6 transition-colors duration-300">
      {/* Brand Header */}
      <div className="mb-8 px-2 pb-4 border-b border-[var(--border-light)]">
        <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-widest">
          SEO Platform
        </p>
        <h2 className="mt-1 font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">
          SEO - SAAS - INSIGHTS
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 flex-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-[var(--slb-blue-500)]/10 text-[var(--slb-blue-500)] ring-1 ring-[var(--slb-blue-500)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              <Icon
                size={20}
                className={`transition-colors duration-200 ${
                  isActive ? "text-[var(--slb-blue-500)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
                }`}
              />
              <span>{label}</span>
              {isActive && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--slb-blue-500)] animate-pulse-dot" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Version */}
      <div className="mt-auto pt-4 px-2 text-xs text-[var(--text-muted)] border-t border-[var(--border-light)] pt-4">
        v2.0.4 • Enterprise
      </div>
    </aside>
  );
}

export default Sidebar;
