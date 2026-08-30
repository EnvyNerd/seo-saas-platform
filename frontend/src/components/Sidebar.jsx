import { Link, useLocation } from "react-router-dom";
import { BarChart3, Bot, FileText, Gauge, LayoutDashboard, Search, Settings, Sparkles, Target } from "lucide-react";

const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/seo-audit", label: "SEO Audit", icon: Search },
  { to: "/app/audit-details", label: "Audit Details", icon: FileText },
  { to: "/app/aeo-geo", label: "AEO / GEO", icon: Sparkles },
  { to: "/app/keywords", label: "Keywords", icon: Target },
  { to: "/app/content", label: "Content", icon: FileText },
  { to: "/app/strategy", label: "Strategy", icon: Gauge },
  { to: "/app/competitors", label: "Competitors", icon: BarChart3 },
  { to: "/app/chat", label: "AI Assistant", icon: Bot },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function Sidebar({ open = false, onNavigate }) {
  const location = useLocation();

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col border-r border-border-light bg-surface-primary transition-transform duration-300 ease-out md:static md:z-auto md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="p-5 border-b border-border-light">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
          VISIORAX PROJECT by RigVisionX Technology™
        </p>
        <p className="text-sm font-bold text-text-primary mt-1">Menu</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              onClick={onNavigate}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-slb-blue-500/10 text-slb-blue-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              <span className="flex items-center gap-3"><Icon size={16} />{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-light text-[11px] text-text-muted">
        Use the pages above to run audits, generate keywords, create content, and review settings.
      </div>
    </aside>
  );
}

export default Sidebar;
