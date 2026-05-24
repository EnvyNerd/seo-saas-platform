import { Link } from "react-router-dom";
import { Search, TrendingUp, BarChart3, AlertCircle, Sparkles } from "lucide-react";
import HealthGauge from "../components/HealthGauge";
import DashboardMetrics from "../components/DashboardMetrics";
import SEOPerformanceTrend from "../components/SEOPerformanceTrend";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { HeroSection, Container, Section, MetricCard, SolutionGrid } from "../components/ui";

export default function Dashboard() {
  const { metrics, trend } = useDashboardMetrics();

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      {/* Subtle Tech Grid Background */}
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <main className="relative z-10 pb-16">
        {/* Page Header (Replaces sidebar context) */}
        <Container className="pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
                SEO Dashboard
              </h1>
              <p className="mt-2 text-[var(--text-secondary)] text-base md:text-lg max-w-2xl">
                Monitor your website's performance and get actionable insights
              </p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-3 py-1.5 rounded-full border border-[var(--border-light)]">
              Live Data
            </span>
          </div>
        </Container>

        <Container className="space-y-10">
          {/* Quick Stats */}
          <section className="animate-fadeInUp">
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

          {/* Health Gauge */}
          <Section className="slb-card rounded-xl p-6 md:p-8 animate-fadeInUp" style={{ animationDelay: "0.1s" }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">Website Health</h2>
                <p className="text-[var(--text-secondary)] mt-1">Overall SEO performance & technical status</p>
              </div>
              <button className="slb-btn slb-btn-secondary text-sm">View Full Report</button>
            </div>
            <div className="flex justify-center items-center">
              <div className="kpi-border-glow rounded-2xl p-6 bg-[var(--bg-primary)] w-full max-w-md">
                <HealthGauge score={metrics.seo_score} compact />
              </div>
            </div>
          </Section>

          {/* CTA Section */}
          {!metrics.url && (
            <section className="relative overflow-hidden rounded-xl animate-fadeInUp" style={{ animationDelay: "0.2s" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--slb-navy)] to-[var(--slb-navy-800)]" />
              <div className="relative z-10 p-8 md:p-10 text-center">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
                  Get Started with Your First Audit
                </h3>
                <p className="text-white/80 mb-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                  Run a comprehensive SEO audit to discover opportunities, fix technical issues, and improve your rankings.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/seo-audit"
                    className="slb-btn slb-btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Search className="h-5 w-5" />
                    Run SEO Audit
                  </Link>
                  <Link
                    to="/strategy"
                    className="slb-btn slb-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all border border-white/20"
                  >
                    <Sparkles className="h-5 w-5" />
                    Launch AI Strategy
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Trends & Activity Grid */}
          <div className="grid gap-8 lg:grid-cols-2 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
            <div className="slb-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold tracking-tight">Performance Trend</h2>
                <span className="slb-badge slb-badge-info">Last 30 Days</span>
              </div>
              <SEOPerformanceTrend trend={trend} />
            </div>
            <div className="slb-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold tracking-tight">Recent Activity</h2>
                <Link to="/analytics" className="text-sm font-medium text-[var(--slb-blue-500)] hover:text-[var(--slb-blue-400)]">
                  View All →
                </Link>
              </div>
              <DashboardMetrics metrics={metrics} />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
