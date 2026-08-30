import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowUpRight, AlertTriangle, Sparkles } from "lucide-react";
import api from "../api/axios";

const DEFAULT_REPORT = {
  url: "https://example.com",
  grade: "D",
  seo_score: 61,
  aeo_score: 48,
  geo_score: 47,
  technical_score: 79,
  content_score: 62,
  performance_score: 95,
  report_id: "demo",
  updated_at: null,
  issues: [
    { id: "i1", title: "Missing canonical URL", severity: "high", category: "Technical", description: "No canonical link tag was found, risking duplicate-content issues." },
    { id: "i2", title: "Missing XML sitemap", severity: "high", category: "Technical", description: "No sitemap.xml was found at /sitemap.xml." },
    { id: "i3", title: "Missing meta description", severity: "high", category: "SEO", description: "No meta description was found." },
    { id: "i4", title: "Missing structured data (JSON-LD)", severity: "high", category: "SEO", description: "No JSON-LD structured data was detected." },
    { id: "i5", title: "Thin content", severity: "high", category: "Content", description: "Page has only ~21 words of visible text." },
  ],
  recommendations: [
    { id: 1, title: "Generate XML Sitemap", pillars: ["SEO", "Technical"], severity: "high", description: "Create and submit an XML sitemap to help search engines discover and index all site URLs efficiently.", effort: "low" },
    { id: 2, title: "Add Meta Description", pillars: ["SEO", "AEO"], severity: "high", description: "Include a meta description to improve click-through rates and provide search engines with a concise summary of the page content.", effort: "low" },
    { id: 3, title: "Implement Structured Data (JSON-LD)", pillars: ["AEO", "GEO", "Technical"], severity: "high", description: "Add Organization and FAQPage schema to help AI and search engines understand entity information and provide direct answers.", effort: "medium" },
    { id: 4, title: "Expand Content Depth", pillars: ["Content", "SEO", "AEO"], severity: "high", description: "Increase page content to at least 600-900 words to provide authority and satisfy user search intent, which is critical for ranking.", effort: "high" },
  ],
};

const AUDIT_HISTORY_KEY = "seo-audit-history";

function loadLatestAudit() {
  try {
    const history = JSON.parse(localStorage.getItem(AUDIT_HISTORY_KEY) || "[]");
    return history[0] || null;
  } catch {
    return null;
  }
}

function normalizeAudit(audit) {
  if (!audit) return null;
  const score = audit.seo_score ?? audit.overall_score;
  return {
    ...audit,
    overall_score: score,
    overall_grade: audit.overall_grade || (score >= 80 ? "A" : score >= 70 ? "B" : score >= 60 ? "C" : "D"),
    updated_at: audit.updated_at || audit.timestamp || audit.created_at,
    report_id: audit.report_id || "latest",
    issues: audit.issues || [
      ...(audit.missing_alt_images > 0 ? [{ id: "missing-alt", title: `${audit.missing_alt_images} images missing alt text`, severity: "high", category: "SEO", description: "Images are missing descriptive alternative text." }] : []),
      ...(audit.meta_description === "Missing" ? [{ id: "meta-description", title: "Missing meta description", severity: "high", category: "SEO", description: "No meta description was found." }] : []),
    ],
    recommendations: audit.recommendations || [],
  };
}

const SCORE_COLORS = {
  high: "text-emerald-400",
  medium: "text-amber-400",
  low: "text-rose-400",
};

const gradeColor = (grade) => {
  if (!grade) return "text-slate-300";
  const g = grade.toUpperCase();
  if (["A", "A+", "A-"].includes(g)) return "text-emerald-400";
  if (["B", "B+", "B-"].includes(g)) return "text-amber-400";
  return "text-rose-400";
};

const severityColor = (severity) => {
  if (severity === "high") return "text-amber-300";
  if (severity === "medium") return "text-sky-300";
  return "text-slate-300";
};

const effortColor = (effort) => {
  if (effort === "low") return "text-emerald-300";
  if (effort === "medium") return "text-amber-300";
  return "text-rose-300";
};

function ScoreRing({ score, size = 120, stroke = 8 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeScore = Number.isFinite(score) ? score : 0;
  const percent = Math.min(Math.max(safeScore, 0), 100) / 100;
  const offset = circumference - percent * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="fill-none stroke-slate-800" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          className="fill-none stroke-cyan-400 transition-all duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{safeScore}</span>
      </div>
    </div>
  );
}

function CriticalIssueRow({ issue }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${severityColor(issue.severity)}`} />
            <p className="text-sm font-semibold text-white">{issue.title}</p>
          </div>
          <p className="text-xs text-slate-400">{issue.description}</p>
        </div>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${severityColor(issue.severity)}`}>{issue.severity}</span>
          <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300">{issue.category}</span>
        </div>
      </div>
    </div>
  );
}

function RecommendationRow({ item }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className={`h-4 w-4 ${severityColor(item.severity)}`} />
            <p className="text-sm font-semibold text-white">{item.title}</p>
          </div>
          <p className="text-xs text-slate-400">{item.description}</p>
        </div>
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${effortColor(item.effort)}`}>Effort: {item.effort}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.pillars?.map((pillar) => (
          <span key={pillar} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-300">{pillar}</span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [report, setReport] = useState(DEFAULT_REPORT);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const latestAudit = normalizeAudit(loadLatestAudit());
      if (latestAudit && !cancelled) {
        setReport((prev) => ({ ...prev, ...latestAudit }));
        return;
      }
      try {
        const res = await api.get("/reports/demo");
        const data = res.data;
        if (!cancelled) {
          setReport((prev) => ({ ...prev, ...data }));
        }
      } catch {
        if (!cancelled) setReport(DEFAULT_REPORT);
      }
    }
    load();
    const refresh = () => {
      const latestAudit = normalizeAudit(loadLatestAudit());
      if (latestAudit) setReport((prev) => ({ ...prev, ...latestAudit }));
    };
    window.addEventListener("seo-audit-history-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("seo-audit-history-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const scoreMap = useMemo(
    () => [
      { label: "SEO Score", score: report.seo_score ?? report.overall_score ?? 0 },
      { label: "AEO Score", score: report.aeo_score ?? 0 },
      { label: "GEO Score", score: report.geo_score ?? 0 },
      { label: "Technical Health", score: report.technical_score ?? 0 },
      { label: "Content Quality", score: report.content_score ?? 0 },
      { label: "Performance", score: report.performance_score ?? 0 },
    ],
    [report],
  );

  const latestAuditUrl = report.report_id && report.report_id !== "demo"
    ? "/app/audit-details"
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400 md:text-base">Your website intelligence at a glance</p>
          </div>
          <Link
            to="/app/seo-audit"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Website
          </Link>
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website Intelligence Score</p>
                <p className="mt-1 text-[11px] text-slate-500">{report.updated_at ? new Date(report.updated_at).toLocaleString() : "Demo data"}</p>
              </div>
              {latestAuditUrl ? (
                <Link to={latestAuditUrl} className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-cyan-300">
                  View latest audit
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
            <div className="mt-6 flex flex-col items-center gap-3">
              <ScoreRing score={report.overall_score ?? report.seo_score ?? 0} size={160} stroke={10} />
              <div className="text-center">
                <p className={`text-3xl font-bold ${gradeColor(report.overall_grade)}`}>Grade {report.overall_grade || "—"}</p>
                <p className="mt-1 text-sm text-slate-400">{report.url || "No website"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
            {scoreMap.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className={`mt-2 text-3xl font-bold ${SCORE_COLORS.high}`}>{item.score}</p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                    style={{ width: `${Math.min(Math.max(item.score, 0), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Critical Issues</h2>
                <p className="text-xs text-slate-400">{report.issues?.length ?? 0} issues found</p>
              </div>
              <Link to="/app/seo-audit" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">View all</Link>
            </div>
            <div className="mt-5 space-y-3">
              {(report.issues ?? []).slice(0, 5).map((issue) => (
                <CriticalIssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">AI Recommendations</h2>
                <p className="text-xs text-slate-400">Priority actions from your latest audit</p>
              </div>
              <Link to="/app/strategy" className="text-xs font-medium text-cyan-400 hover:text-cyan-300">View all</Link>
            </div>
            <div className="mt-5 space-y-3">
              {(report.recommendations ?? []).slice(0, 5).map((item) => (
                <RecommendationRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
