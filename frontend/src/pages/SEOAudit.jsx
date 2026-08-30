import { useEffect, useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle, Copy, CheckSquare, Layers, Tag, ExternalLink, Globe, FileText, Layout, Image as ImageIcon, Calendar, ArrowUpRight } from "lucide-react";
import api from "../api/axios";
import { Card, Container, HeroSection, Button, Input, Badge, Alert, Tabs, Progress, CircularProgress } from "../components/ui";

function ScoreBadge({ score }) {
  const getVariant = () => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <Card variant="elevated" className="flex flex-col items-center justify-center p-8 bg-surface-primary border-border-light min-w-[180px]">
      <div className="relative mb-4">
        <CircularProgress 
          value={score} 
          size={120} 
          strokeWidth={10} 
          variant={getVariant()}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold font-display ${
            score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
          }`}>
            {score}
          </span>
        </div>
      </div>
      <Badge variant={getVariant()} size="lg" className="font-bold">SEO Score</Badge>
    </Card>
  );
}

function AuditMetric({ label, value, icon: Icon, description }) {
  return (
    <Card variant="outline" className="p-5 bg-surface-primary hover:bg-surface-secondary transition-all group">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-2 bg-slb-blue-500/10 rounded-lg text-slb-blue-500 group-hover:bg-slb-blue-500 group-hover:text-white transition-all">
            <Icon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            {label}
          </p>
          <p className="text-sm font-bold text-text-primary break-words leading-snug">
            {value || "—"}
          </p>
          {description && (
            <p className="text-[10px] text-text-muted mt-2 leading-relaxed italic">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function scoreLabel(score) {
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}

function scoreTone(score) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

const HISTORY_KEY = "seo-audit-history";

export default function SEOAudit() {
  const [auditMode, setAuditMode] = useState("single"); // "single" or "batch"

  // Single Audit State
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [auditHistory, setAuditHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");

  // AI recommendations & Schema state
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [schemaResult, setSchemaResult] = useState("");
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Batch Audit State
  const [batchInput, setBatchInput] = useState("");
  const [batchResults, setBatchResults] = useState([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState("");

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(auditHistory));
  }, [auditHistory]);

  const triggerCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };


  const handleSingleAudit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setAiResult("");
    setSchemaResult("");

    try {
      const response = await api.get(`/seo/audit?url=${encodeURIComponent(url.trim())}`);
      const audit = response.data;
      setResult(audit);
      if (!audit.error) {
        setAuditHistory((previous) => [audit, ...previous].slice(0, 10));
        window.dispatchEvent(new Event("seo-audit-history-updated"));
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to execute SEO audit.");
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendations = async () => {
    if (!result) return;
    setAiLoading(true);
    try {
      const response = await api.post("/ai/recommendations", { data: result });
      setAiResult(response.data.recommendations);
    } catch (err) {
      setAiResult("❌ Error: Failed to generate AI recommendations.");
    } finally {
      setAiLoading(false);
    }
  };

  const generateJSONLDSchema = async () => {
    if (!result) return;
    setSchemaLoading(true);
    try {
      const response = await api.post("/seo/schema", result);
      setSchemaResult(response.data.schema);
    } catch (err) {
      setSchemaResult("❌ Error: Failed to generate schema markup.");
    } finally {
      setSchemaLoading(false);
    }
  };

  const handleBatchAudit = async (e) => {
    e.preventDefault();
    if (!batchInput.trim()) return;
    setBatchLoading(true);
    setBatchError("");
    setBatchResults([]);

    // Split urls by commas or newlines
    const urls = batchInput
      .split(/[\n,]/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urls.length === 0) {
      setBatchError("Please enter at least one valid URL.");
      setBatchLoading(false);
      return;
    }

    try {
      const response = await api.post("/seo/audit/batch", { urls });
      setBatchResults(response.data.results);
    } catch (err) {
      setBatchError("Failed to run batch audit. Ensure the server is online.");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="SEO Audit Engine"
        subtitle="Deep Playwright-powered analysis for on-page optimization, accessibility, and structural integrity."
      />

      <Container size="xl" className="py-8 relative z-10">
          <div className="grid gap-8 lg:grid-cols-3">
            <main className="lg:col-span-2 space-y-10">
        {/* Toggle Mode Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1.5 bg-surface-tertiary p-1.5 rounded-xl border border-border-light shadow-sm w-fit">
            <button
              onClick={() => { setAuditMode("single"); setError(""); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                auditMode === "single"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Search size={16} />
              Single Page
            </button>
            <button
              onClick={() => { setAuditMode("batch"); setBatchError(""); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                auditMode === "batch"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Layers size={16} />
              Batch Bulk
            </button>
          </div>
        </div>

        {/* SINGLE PAGE AUDIT MODE */}
        {auditMode === "single" && (
          <div className="space-y-10 animate-fadeInUp">
            <Card variant="elevated" className="p-8 bg-surface-primary w-full border-t-4 border-t-slb-blue-500">
              <form onSubmit={handleSingleAudit} className="space-y-6">
                <Input
                  label="Target Website URL"
                  id="url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                  startIcon={Globe}
                  helperText="Provide the full URL including protocol (http/https)."
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!url.trim()}
                  startIcon={Search}
                  className="shadow-lg shadow-slb-blue-500/20"
                >
                  {loading ? "Initializing Headless Engine..." : "Run Comprehensive Audit"}
                </Button>
              </form>
            </Card>

            {error && (
              <Alert variant="error" title="Audit Failed" className="w-full" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {result && (
              <div className="space-y-10 animate-fadeInUp">
                <Card variant="elevated" className="p-6 md:p-8 bg-surface-primary border-border-light">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Latest Audit</p>
                      <h2 className="mt-2 break-words text-2xl font-bold font-display text-text-primary">{result.title || "Website audit"}</h2>
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-full items-center gap-2 truncate text-sm text-slb-blue-500 hover:text-slb-blue-400">
                        {result.url}<ArrowUpRight size={14} />
                      </a>
                    </div>
                    <div className="flex items-center gap-5">
                      <CircularProgress value={result.seo_score ?? 0} size={96} strokeWidth={9} variant={result.seo_score >= 80 ? "success" : result.seo_score >= 50 ? "warning" : "error"} />
                      <div>
                        <p className="text-4xl font-bold font-display text-text-primary">{result.seo_score ?? "—"}</p>
                        <p className={`text-sm font-bold ${scoreTone(result.seo_score ?? 0)}`}>Grade {scoreLabel(result.seo_score ?? 0)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button type="button" variant="secondary" size="sm" startIcon={Search} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>New Audit</Button>
                    {result.screenshot_path && <a href={`${api.defaults.baseURL.split("/api")[0]}${result.screenshot_path}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border-light px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"><ImageIcon size={15} /> View proof</a>}
                  </div>
                </Card>

                <Card variant="outline" className="p-6 bg-surface-primary border-border-light">
                  <div className="flex items-center gap-3 mb-5"><Globe size={18} className="text-slb-blue-500" /><h3 className="text-lg font-bold font-display">Website Details</h3></div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <AuditMetric label="Industry" value={result.industry || "Not set"} />
                    <AuditMetric label="Target Country" value={result.target_country || "Not set"} />
                    <AuditMetric label="Target Language" value={result.target_language || "Not set"} />
                    <AuditMetric label="Target Audience" value={result.target_audience || "Not set"} />
                  </div>
                  <p className="mt-5 border-t border-border-light pt-4 text-sm leading-relaxed text-text-secondary">{result.meta_description && result.meta_description !== "Missing" ? result.meta_description : "No meta description was found for this page."}</p>
                </Card>

                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {[ ["SEO", result.seo_score], ["AEO", result.aeo_score], ["GEO", result.geo_score], ["Tech", result.technical_score], ["Content", result.content_score], ["Perf", result.performance_score] ].map(([label, value]) => (
                    <Card key={label} variant="outline" className="p-4 bg-surface-primary border-border-light">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{label}</p>
                      <p className={`mt-2 text-2xl font-bold font-display ${value == null ? "text-text-muted" : scoreTone(value)}`}>{value ?? "—"}</p>
                    </Card>
                  ))}
                </div>

                <Card variant="outline" className="p-0 overflow-hidden bg-surface-primary border-border-light">
                  <div className="flex items-center justify-between border-b border-border-light p-5"><h3 className="text-lg font-bold font-display">Audit History</h3><Calendar size={18} className="text-text-muted" /></div>
                  <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-surface-secondary/50 text-[10px] uppercase tracking-wider text-text-muted"><tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Overall</th><th className="px-5 py-3">SEO</th><th className="px-5 py-3">Issues</th></tr></thead><tbody className="divide-y divide-border-light">{auditHistory.map((item, index) => <tr key={`${item.timestamp}-${index}`}><td className="px-5 py-3 text-text-secondary">{item.timestamp ? new Date(item.timestamp).toLocaleString() : "—"}</td><td className={`px-5 py-3 font-bold ${scoreTone(item.seo_score)}`}>{item.seo_score ?? "—"}</td><td className="px-5 py-3 text-text-secondary">{item.seo_score ?? "—"}</td><td className="px-5 py-3 text-text-secondary">{(item.issues || []).length || item.missing_alt_images || 0}</td></tr>)}</tbody></table></div>
                </Card>

                <Card variant="outline" className="p-6 bg-surface-primary border-border-light"><h3 className="text-lg font-bold font-display mb-5">Recent Issues</h3><div className="space-y-3">{[
                  ...(result.issues || []),
                  ...(result.missing_alt_images > 0 ? [{ severity: "high", title: `${result.missing_alt_images} images missing alt text`, category: "SEO" }] : []),
                  ...(result.meta_description === "Missing" ? [{ severity: "high", title: "Missing meta description", category: "SEO" }] : []),
                ].slice(0, 8).map((issue, index) => <div key={`${issue.title}-${index}`} className="flex items-center justify-between gap-4 border-b border-border-light py-3 last:border-0"><div className="flex min-w-0 items-center gap-3"><AlertCircle size={16} className={issue.severity === "high" ? "text-red-500" : "text-yellow-500"} /><span className="truncate text-sm font-medium text-text-primary">{issue.title || issue.message}</span></div><span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-text-muted">{issue.category || "SEO"}</span></div>)}{!result.issues?.length && !result.missing_alt_images && result.meta_description !== "Missing" && <p className="text-sm text-text-muted">No issues detected from the available audit checks.</p>}</div></Card>

                {/* Technical Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-3">
                  <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-slb-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Links Discovered</p>
                      <Layers size={16} className="text-slb-blue-500 opacity-50" />
                    </div>
                    <p className="text-3xl font-bold font-display text-text-primary">{result.total_links}</p>
                    <p className="text-[10px] text-text-muted mt-2">Total anchor tags found on page</p>
                  </Card>
                  
                  <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-red-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">A11y Issues</p>
                      <ImageIcon size={16} className="text-red-500 opacity-50" />
                    </div>
                    <p className={`text-3xl font-bold font-display ${result.missing_alt_images > 0 ? "text-red-500" : "text-green-500"}`}>
                      {result.missing_alt_images}
                    </p>
                    <p className="text-[10px] text-text-muted mt-2">Images missing ALT descriptive text</p>
                  </Card>

                  <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-yellow-500">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Visual Proof</p>
                      <ImageIcon size={16} className="text-yellow-500 opacity-50" />
                    </div>
                    {(() => {
                      const backendBaseUrl = api.defaults.baseURL.split("/api")[0];
                      const fullScreenshotUrl = `${backendBaseUrl}${result.screenshot_path}`;
                      return (
                        <a
                          href={fullScreenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-slb-blue-500 hover:text-slb-blue-400 font-bold text-sm mt-1 transition-colors"
                        >
                          View Screenshot
                          <ExternalLink size={14} />
                        </a>
                      );
                    })()}
                    <p className="text-[10px] text-text-muted mt-2">Crawl-time rendering capture</p>
                  </Card>
                </div>

                {/* AI recommendations & Schema Tabs */}
                <Card variant="elevated" className="bg-surface-primary p-1 overflow-hidden">
                  <Tabs tabs={[
                    {
                      label: "AI Optimization Advice",
                      icon: Sparkles,
                      content: (
                        <div className="p-6 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                <Sparkles className="text-slb-blue-500 h-5 w-5" />
                                Smart Gaps Analysis
                              </h3>
                              <p className="text-xs text-text-muted mt-1">Generated by Gemini Pro based on crawl metrics</p>
                            </div>
                            {!aiResult && (
                              <Button
                                onClick={generateAIRecommendations}
                                loading={aiLoading}
                                variant="secondary"
                                size="sm"
                                startIcon={Sparkles}
                              >
                                Analyze with AI
                              </Button>
                            )}
                          </div>
                          
                          {aiLoading ? (
                            <div className="py-16 flex flex-col items-center justify-center bg-surface-secondary/30 rounded-xl border border-dashed border-border-light">
                              <Loader2 className="h-10 w-10 animate-spin text-slb-blue-500 mb-4" />
                              <p className="text-sm font-medium animate-pulse text-text-muted">Synthesizing recommendations...</p>
                            </div>
                          ) : aiResult ? (
                            <div className="relative group">
                              <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary bg-surface-secondary p-6 rounded-xl border border-border-light overflow-y-auto max-h-[400px] font-sans">
                                {aiResult}
                              </pre>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => triggerCopy(aiResult, "ai")}
                                startIcon={copiedKey === "ai" ? CheckSquare : Copy}
                              >
                                {copiedKey === "ai" ? "Copied" : "Copy"}
                              </Button>
                            </div>
                          ) : (
                            <div className="py-12 text-center bg-surface-secondary/20 rounded-xl border border-dashed border-border-medium">
                              <p className="text-sm text-text-muted italic">Click the button above to unlock AI-powered SEO optimization tips.</p>
                            </div>
                          )}
                        </div>
                      )
                    },
                    {
                      label: "Schema Markup (JSON-LD)",
                      icon: Tag,
                      content: (
                        <div className="p-6 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold flex items-center gap-2">
                                <Tag className="text-yellow-500 h-5 w-5" />
                                Structured Data Generator
                              </h3>
                              <p className="text-xs text-text-muted mt-1">Ready-to-use JSON-LD for rich search results</p>
                            </div>
                            {schemaResult ? (
                              <Button
                                variant="secondary"
                                size="sm"
                                startIcon={copiedKey === "schema" ? CheckSquare : Copy}
                                onClick={() => triggerCopy(schemaResult, "schema")}
                              >
                                {copiedKey === "schema" ? "Copied" : "Copy Code"}
                              </Button>
                            ) : (
                              <Button
                                onClick={generateJSONLDSchema}
                                loading={schemaLoading}
                                variant="secondary"
                                size="sm"
                                startIcon={Tag}
                              >
                                Generate Schema
                              </Button>
                            )}
                          </div>

                          {schemaLoading ? (
                            <div className="py-16 flex flex-col items-center justify-center bg-surface-secondary/30 rounded-xl border border-dashed border-border-light">
                              <Loader2 className="h-10 w-10 animate-spin text-slb-blue-500 mb-4" />
                              <p className="text-sm font-medium animate-pulse text-text-muted">Building structural graph...</p>
                            </div>
                          ) : schemaResult ? (
                            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed text-yellow-400 bg-slate-950 p-6 rounded-xl border border-slate-800 overflow-y-auto max-h-[400px] shadow-inner">
                              {schemaResult}
                            </pre>
                          ) : (
                            <div className="py-12 text-center bg-surface-secondary/20 rounded-xl border border-dashed border-border-medium">
                              <p className="text-sm text-text-muted italic">Generate schema markup to help search engines understand your content better.</p>
                            </div>
                          )}
                        </div>
                      )
                    }
                  ]} />
                </Card>
              </div>
            )}
          </div>
        )}

        {/* BATCH AUDIT BULK MODE */}
        {auditMode === "batch" && (
          <div className="space-y-8 animate-fadeInUp">
            <Card variant="elevated" className="p-8 bg-surface-primary border-t-4 border-t-slb-blue-500">
              <form onSubmit={handleBatchAudit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="batch-urls" className="block text-sm font-bold text-text-primary">
                    Enter Target URLs
                  </label>
                  <p className="text-xs text-text-muted mb-3">Paste multiple URLs separated by commas or new lines for parallel analysis.</p>
                  <textarea
                    id="batch-urls"
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="https://google.com&#10;https://github.com&#10;https://wikipedia.org"
                    rows={5}
                    required
                    className="w-full bg-surface-secondary border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-slb-blue-500/50 transition-all placeholder:text-text-muted font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={batchLoading}
                  disabled={!batchInput.trim()}
                  startIcon={Layers}
                >
                  {batchLoading ? "Parallel Crawlers Active..." : "Start Batch Analysis"}
                </Button>
              </form>
            </Card>

            {batchError && (
              <Alert variant="error" title="Batch Error" onClose={() => setBatchError("")}>
                {batchError}
              </Alert>
            )}

            {batchLoading && batchResults.length === 0 && (
              <div className="p-20 flex flex-col items-center justify-center bg-surface-primary rounded-2xl border border-border-light shadow-sm">
                <Loader2 className="h-12 w-12 animate-spin text-slb-blue-500 mb-6" />
                <h3 className="text-lg font-bold text-text-primary">Bulk Diagnostics in Progress</h3>
                <p className="text-sm text-text-muted mt-2 max-w-md text-center">Spawning Playwright sandboxes to perform simultaneous site analysis. This may take a moment depending on the number of URLs.</p>
                <div className="w-64 mt-8">
                  <Progress value={45} max={100} variant="primary" showLabel={false} />
                </div>
              </div>
            )}

            {batchResults.length > 0 && (
              <Card variant="outline" className="p-0 bg-surface-primary overflow-hidden animate-fadeInUp shadow-xl">
                <div className="p-6 border-b border-border-light flex items-center justify-between bg-surface-secondary/50">
                  <h3 className="font-bold text-sm text-text-muted uppercase tracking-widest">
                    Bulk Scan Report Overview
                  </h3>
                  <Badge variant="info">{batchResults.length} URLs Analyzed</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-surface-secondary/30">
                        <th className="py-4 px-6 font-bold text-text-muted text-[10px] uppercase tracking-wider">Target Domain</th>
                        <th className="py-4 px-6 font-bold text-text-muted text-[10px] uppercase tracking-wider">SEO Health</th>
                        <th className="py-4 px-6 font-bold text-text-muted text-[10px] uppercase tracking-wider">Page Identification</th>
                        <th className="py-4 px-6 font-bold text-text-muted text-[10px] uppercase tracking-wider">Audit Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light">
                      {batchResults.map((item, idx) => {
                        const isErr = "error" in item;
                        const score = isErr ? null : item.seo_score;
                        return (
                          <tr key={idx} className="hover:bg-surface-secondary/50 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-surface-tertiary rounded text-text-muted group-hover:text-slb-blue-500 transition-colors">
                                  <Globe size={14} />
                                </div>
                                <span className="font-mono text-xs font-bold text-text-primary truncate max-w-[200px]" title={item.url}>
                                  {item.url || "N/A"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              {isErr ? (
                                <Badge variant="error">FAILED</Badge>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-12">
                                    <Progress value={score} max={100} variant={score >= 80 ? "success" : "warning"} size="sm" />
                                  </div>
                                  <span className={`text-xs font-bold ${
                                    score >= 80 ? "text-green-500" : "text-yellow-500"
                                  }`}>{score}%</span>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-xs text-text-secondary truncate max-w-[250px]" title={item.title}>
                                {isErr ? "—" : item.title}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              {isErr ? (
                                <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold">
                                  <AlertCircle size={12} />
                                  SCAN ERROR
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold">
                                  <CheckSquare size={12} />
                                  VERIFIED
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}
          </main>
        </div>
      </Container>
    </div>
  );
}
