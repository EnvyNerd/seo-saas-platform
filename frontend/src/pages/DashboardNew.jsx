import { Link } from "react-router-dom";
import { Search, TrendingUp, BarChart3, AlertCircle, Sparkles } from "lucide-react";
import { HeroSection, Container, Section, MetricCard, SolutionGrid } from "../components/ui";

export default function Dashboard() {
  const metrics = { seo_score: 61, keywords_count: 142, backlinks_count: 48, page_speed: 79 };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <main className="relative z-10 pb-16">
        <Container className="pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                SEO Dashboard
              </h1>
              <p className="mt-2 text-[var(--text-secondary)] text-base md:text-lg max-w-2xl">
                Dashboard updated to the new layout from the main Dashboard page.
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-light)]">
              Deprecated Preview
            </span>
          </div>
        </Container>

        <Container size="xl" className="space-y-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <main className="lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold tracking-tight">Key Metrics</h2>
                  <button className="slb-btn slb-btn-ghost text-sm">Export Report ↓</button>
                </div>
                <SolutionGrid columns={4}>
                  <MetricCard label="SEO Score" value={metrics.seo_score || "—"} change="+5%" trend="up" icon={TrendingUp} />
                  <MetricCard label="Keywords Ranking" value={metrics.keywords_count || "—"} change="+12" trend="up" icon={BarChart3} />
                  <MetricCard label="Backlinks" value={metrics.backlinks_count || "—"} change="+8" trend="up" icon={AlertCircle} />
                  <MetricCard label="Page Speed" value={metrics.page_speed || "—"} change="-2s" trend="down" icon={Search} />
                </SolutionGrid>
              </section>

              <section className="slb-card rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold tracking-tight">Website Health</h2>
                    <p className="text-[var(--text-secondary)] mt-1">Overall SEO performance & technical status</p>
                  </div>
                  <button className="slb-btn slb-btn-secondary text-sm">View Full Report</button>
                </div>
                <div className="flex justify-center items-center">
                  <div className="kpi-border-glow rounded-2xl p-6 bg-[var(--bg-primary)] w-full max-w-md text-center">
                    <p className="text-sm text-[var(--text-muted)]">Use the main Dashboard instead of this legacy preview.</p>
                  </div>
                </div>
              </section>

              <section className="slb-card rounded-xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="font-display text-xl font-semibold text-white">Use the new dashboard layout</h3>
                    <p className="mt-1 text-sm text-slate-400">It lives on the main Dashboard page now.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Link to="/app" className="slb-btn slb-btn-secondary w-full sm:w-auto">Open Main Dashboard</Link>
                    <Link to="/app/seo-audit" className="slb-btn slb-btn-primary w-full sm:w-auto">Run SEO Audit</Link>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </Container>
      </main>
    </div>
  );
}
