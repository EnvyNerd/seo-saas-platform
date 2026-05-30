import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Search, Globe, FileText, 
  BarChart3, Sparkles, Target, MessageSquare, 
  Activity, ChevronLeft, ChevronRight 
} from "lucide-react";
import { useState } from "react";
import { Badge, Tooltip } from "./ui";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`
        flex shrink-0 flex-col bg-surface-secondary border-r border-border-light 
        transition-all duration-300 ease-in-out relative
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-surface-primary border border-border-light rounded-full p-1 text-text-muted hover:text-text-primary shadow-sm z-50 transition-colors"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand Header */}
      <div className={`
        mb-8 px-4 py-6 border-b border-border-light transition-all duration-300 overflow-hidden
        ${isCollapsed ? 'items-center text-center' : ''}
      `}>
        {!isCollapsed ? (
          <div className="animate-fadeIn">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
              Enterprise SEO
            </p>
            <h2 className="font-display text-lg font-bold text-text-primary tracking-tight leading-tight">
              INSIGHTS <span className="text-slb-blue-500">SaaS</span>
            </h2>
          </div>
        ) : (
          <div className="flex justify-center animate-fadeIn">
            <span className="font-display font-bold text-xl text-slb-blue-500">S</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          
          const linkContent = (
            <Link
              key={to}
              to={to}
              aria-current={isActive ? "page" : undefined}
              className={`
                group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus
                ${isActive
                  ? "bg-slb-blue-500/10 text-slb-blue-500 shadow-sm"
                  : "text-text-secondary hover:bg-surface-tertiary hover:text-text-primary active:scale-[0.98]"
                }
                ${isCollapsed ? 'justify-center px-0 mx-auto w-10' : ''}
              `}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-colors ${
                  isActive ? "text-slb-blue-500" : "text-text-muted group-hover:text-text-primary"
                }`}
              />
              {!isCollapsed && <span className="truncate animate-fadeIn">{label}</span>}
              {!isCollapsed && isActive && (
                <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-slb-blue-500 animate-pulse-dot" />
              )}
            </Link>
          );

          return isCollapsed ? (
            <Tooltip key={to} content={label} position="right">
              {linkContent}
            </Tooltip>
          ) : linkContent;
        })}
      </nav>

      {/* Footer / Version */}
      <div className={`
        mt-auto p-4 border-t border-border-light transition-all duration-300
        ${isCollapsed ? 'flex justify-center' : 'flex items-center justify-between'}
      `}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between w-full animate-fadeIn">
            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">v2.0.4</span>
            <Badge variant="info" size="sm">Stable</Badge>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-text-muted animate-fadeIn">v2</span>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
