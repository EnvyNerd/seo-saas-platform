import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, Calendar, CheckCircle2, FileText, Globe, Image as ImageIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Card, Container, HeroSection, CircularProgress } from "../components/ui";
import api from "../api/axios";

const HISTORY_KEY = "seo-audit-history";

function loadLatestAudit() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return history[0] || null;
  } catch {
    return null;
  }
}

function scoreTone(score) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

function scoreGrade(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

export default function AuditDetails() {
  const [audit, setAudit] = useState(loadLatestAudit);

  useEffect(() => {
    const refresh = () => setAudit(loadLatestAudit());
    window.addEventListener("seo-audit-history-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("seo-audit-history-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (!audit) {
    return (
      <div className="min-h-screen bg-surface-secondary text-text-primary">
        <HeroSection title="Audit Details" subtitle="Review the complete report from your latest website analysis." />
        <Container className="py-10">
          <Card variant="outline" className="mx-auto max-w-2xl p-10 text-center bg-surface-primary">
            <Search className="mx-auto mb-4 text-slb-blue-500" size={36} />
            <h2 className="text-xl font-bold font-display">No audit available</h2>
            <p className="mt-2 text-sm text-text-muted">Run an SEO audit first to create a detailed report.</p>
            <Link to="/app/seo-audit" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slb-navy px-4 py-2.5 text-sm font-semibold text-white">Run SEO Audit</Link>
          </Card>
        </Container>
      </div>
    );
  }

  const score = audit.seo_score ?? 0;
  const issues = [
    ...(audit.issues || []),
    ...(audit.missing_alt_images > 0 ? [{ title: `${audit.missing_alt_images} images missing alt text`, severity: "high", category: "SEO", description: "Images are missing descriptive alternative text." }] : []),
    ...(audit.meta_description === "Missing" ? [{ title: "Missing meta description", severity: "high", category: "SEO", description: "No meta description was found." }] : []),
  ];
  const pillars = [
    ["SEO", audit.seo_score],
    ["AEO", audit.aeo_score],
    ["GEO", audit.geo_score],
    ["Technical", audit.technical_score],
    ["Content", audit.content_score],
    ["Performance", audit.performance_score],
  ];
  const screenshotUrl = audit.screenshot_path ? `${api.defaults.baseURL.split("/api")[0]}${audit.screenshot_path}` : null;

  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />
      <HeroSection title="Audit Details" subtitle="Complete findings, scores, technical evidence, and recommended actions from your latest audit." />
      <Container size="xl" className="py-8 relative z-10 space-y-8">
        <Card variant="elevated" className="p-6 md:p-8 bg-surface-primary border-border-light">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Latest Website Report</p>
              <h2 className="mt-2 break-words text-2xl font-bold font-display">{audit.title || "Website audit"}</h2>
              <a href={audit.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-full items-center gap-2 truncate text-sm text-slb-blue-500 hover:text-slb-blue-400">{audit.url}<ArrowUpRight size={14} /></a>
              <p className="mt-4 flex items-center gap-2 text-xs text-text-muted"><Calendar size={14} />{audit.timestamp ? new Date(audit.timestamp).toLocaleString() : "Date unavailable"}</p>
            </div>
            <div className="flex items-center gap-4">
              <CircularProgress value={score} size={100} strokeWidth={9} variant={score >= 80 ? "success" : score >= 50 ? "warning" : "error"} />
              <div><p className={`text-4xl font-bold font-display ${scoreTone(score)}`}>{score}</p><p className="text-sm font-bold text-text-primary">Grade {scoreGrade(score)}</p></div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {pillars.map(([label, value]) => <Card key={label} variant="outline" className="p-4 bg-surface-primary border-border-light"><p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p><p className={`mt-2 text-2xl font-bold font-display ${value == null ? "text-text-muted" : scoreTone(value)}`}>{value ?? "—"}</p></Card>)}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card variant="outline" className="p-6 bg-surface-primary border-border-light">
            <h3 className="mb-5 flex items-center gap-3 text-lg font-bold font-display"><Globe size={18} className="text-slb-blue-500" />Website Details</h3>
            <div className="space-y-4 text-sm"><div><span className="text-xs uppercase tracking-wider text-text-muted">Page title</span><p className="mt-1 font-semibold">{audit.title || "Missing"}</p></div><div><span className="text-xs uppercase tracking-wider text-text-muted">Meta description</span><p className="mt-1 text-text-secondary">{audit.meta_description || "Missing"}</p></div><div><span className="text-xs uppercase tracking-wider text-text-muted">Primary headings</span><p className="mt-1 text-text-secondary">{audit.h1_tags?.join(" | ") || "None found"}</p></div></div>
          </Card>
          <Card variant="outline" className="p-6 bg-surface-primary border-border-light">
            <h3 className="mb-5 flex items-center gap-3 text-lg font-bold font-display"><FileText size={18} className="text-slb-blue-500" />Crawl Summary</h3>
            <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-text-muted">Links discovered</p><p className="mt-1 text-2xl font-bold">{audit.total_links ?? 0}</p></div><div><p className="text-xs text-text-muted">Missing image ALT</p><p className={`mt-1 text-2xl font-bold ${scoreTone(audit.missing_alt_images ? 40 : 100)}`}>{audit.missing_alt_images ?? 0}</p></div><div><p className="text-xs text-text-muted">Status code</p><p className="mt-1 text-2xl font-bold">{audit.status_code ?? "—"}</p></div><div><p className="text-xs text-text-muted">Response time</p><p className="mt-1 text-2xl font-bold">{audit.response_time_ms ? `${audit.response_time_ms}ms` : "—"}</p></div></div>
            {screenshotUrl && <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slb-blue-500"><ImageIcon size={16} />View screenshot</a>}
          </Card>
        </div>

        <Card variant="outline" className="p-6 bg-surface-primary border-border-light"><h3 className="mb-5 text-lg font-bold font-display">Issues Found ({issues.length})</h3><div className="space-y-3">{issues.length ? issues.map((issue, index) => <div key={`${issue.title}-${index}`} className="flex items-start gap-3 border-b border-border-light py-3 last:border-0"><AlertCircle size={17} className={issue.severity === "high" ? "mt-0.5 text-red-500" : "mt-0.5 text-yellow-500"} /><div className="min-w-0 flex-1"><p className="font-semibold">{issue.title || issue.message}</p><p className="mt-1 text-sm text-text-secondary">{issue.description || "Review this item and apply the recommended fix."}</p></div><Badge variant={issue.severity === "high" ? "error" : "warning"} size="sm">{issue.category || issue.severity || "SEO"}</Badge></div>) : <div className="flex items-center gap-2 text-sm text-green-500"><CheckCircle2 size={17} />No issues detected.</div>}</div></Card>
      </Container>
    </div>
  );
}
