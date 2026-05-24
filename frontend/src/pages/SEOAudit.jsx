import { useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle, Copy, CheckSquare, Layers, Tag, ExternalLink } from "lucide-react";
import api from "../api/axios";
import { Card, Container, HeroSection } from "../components/ui";

function ScoreBadge({ score }) {
  const getBadgeColor = () => {
    if (score >= 80) return { bg: "bg-green-500/10", text: "text-green-500", border: "border-green-500/20" };
    if (score >= 50) return { bg: "bg-yellow-500/10", text: "text-yellow-500", border: "border-yellow-500/20" };
    return { bg: "bg-red-500/10", text: "text-red-500", border: "border-red-500/20" };
  };

  const colors = getBadgeColor();
  return (
    <div className={`flex flex-col items-center rounded-2xl border px-8 py-6 bg-[var(--bg-primary)] ${colors.border}`}>
      <span className={`text-5xl font-bold font-display ${colors.text}`}>{score}</span>
      <span className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">SEO Score</span>
    </div>
  );
}

function AuditRow({ label, value }) {
  return (
    <Card className="p-4 bg-[var(--bg-primary)]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
        {label}
      </p>
      <p className="text-sm font-medium text-[var(--text-primary)] break-words">{value || "—"}</p>
    </Card>
  );
}

export default function SEOAudit() {
  const [auditMode, setAuditMode] = useState("single"); // "single" or "batch"

  // Single Audit State
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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
      setResult(response.data);
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
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="SEO Auditor"
        subtitle="Perform deep, Playwright-powered single website audits or bulk scan multiple URLs."
      />

      <Container className="py-8 relative z-10">
        {/* Toggle Mode */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-light)] w-fit mb-8">
          <button
            onClick={() => { setAuditMode("single"); setError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              auditMode === "single"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Single Page Audit
          </button>
          <button
            onClick={() => { setAuditMode("batch"); setBatchError(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              auditMode === "batch"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Batch Bulk Audit
          </button>
        </div>

        {/* SINGLE PAGE AUDIT MODE */}
        {auditMode === "single" && (
          <div className="space-y-8 animate-fadeInUp">
            <Card className="p-6 bg-[var(--bg-primary)] max-w-2xl mx-auto">
              <form onSubmit={handleSingleAudit} className="space-y-4">
                <label htmlFor="url-input" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Enter Website URL
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="url-input"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="slb-btn slb-btn-primary px-6 py-3 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Auditing (Rendering)…
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4" />
                        Run Audit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>

            {error && (
              <Card className="p-4 max-w-2xl mx-auto border-red-500/30 bg-red-500/10 text-red-400">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              </Card>
            )}

            {result && (
              <div className="space-y-8 animate-fadeInUp">
                {/* Metrics Badges */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  <div className="shrink-0 mx-auto lg:mx-0">
                    <ScoreBadge score={result.seo_score} />
                  </div>
                  <div className="flex-1 w-full grid gap-4 sm:grid-cols-2">
                    <AuditRow label="Analyzed URL" value={result.url} />
                    <AuditRow label="Meta Title" value={result.title} />
                    <AuditRow label="Meta Description" value={result.meta_description} />
                    <AuditRow label="H1 Headers" value={result.h1_tags?.join(" | ") || "None"} />
                  </div>
                </div>

                {/* Performance stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="p-4 bg-[var(--bg-primary)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Total Loaded Links</p>
                    <p className="text-2xl font-bold font-display text-[var(--slb-blue-500)]">{result.total_links}</p>
                  </Card>
                  <Card className="p-4 bg-[var(--bg-primary)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Images Missing Alt Attribute</p>
                    <p className={`text-2xl font-bold font-display ${result.missing_alt_images > 0 ? "text-red-500" : "text-green-500"}`}>
                      {result.missing_alt_images}
                    </p>
                  </Card>
                  <Card className="p-4 bg-[var(--bg-primary)]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Crawl Screen Dump</p>
                    <a
                      href={`file:///${result.screenshot_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--slb-blue-500)] hover:underline font-medium inline-flex items-center gap-1 mt-2.5"
                    >
                      Open Screenshot
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Card>
                </div>

                {/* Schema & Recommendation Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* AI Recommendations */}
                  <div className="slb-card p-6 bg-[var(--bg-primary)] rounded-xl flex flex-col">
                    <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Sparkles className="text-[var(--slb-blue-500)] h-4 w-4" />
                        AI Audit Report Gaps
                      </h3>
                      {!aiResult && (
                        <button
                          onClick={generateAIRecommendations}
                          disabled={aiLoading}
                          className="slb-btn slb-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                        >
                          {aiLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                          Generate
                        </button>
                      )}
                    </div>
                    {aiLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--slb-blue-500)] mb-3" />
                        <p className="text-xs text-[var(--text-muted)] font-semibold">Generating advice based on crawl data...</p>
                      </div>
                    ) : aiResult ? (
                      <pre className="flex-1 whitespace-pre-wrap text-xs leading-relaxed text-[var(--text-secondary)] bg-[var(--bg-secondary)] p-4 rounded-lg overflow-y-auto max-h-[300px] font-sans">
                        {aiResult}
                      </pre>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] py-6 text-center italic">Click Generate to analyze crawl metrics with Gemini AI.</p>
                    )}
                  </div>

                  {/* Schema Generator */}
                  <div className="slb-card p-6 bg-[var(--bg-primary)] rounded-xl flex flex-col">
                    <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 mb-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Tag className="text-yellow-500 h-4 w-4" />
                        JSON-LD Schema Generator
                      </h3>
                      {schemaResult ? (
                        <button
                          onClick={() => triggerCopy(schemaResult, "schema")}
                          className="text-xs flex items-center gap-1 border border-[var(--border-light)] px-2 py-1 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
                        >
                          {copiedKey === "schema" ? <CheckSquare className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </button>
                      ) : (
                        <button
                          onClick={generateJSONLDSchema}
                          disabled={schemaLoading}
                          className="slb-btn slb-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1"
                        >
                          {schemaLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Tag className="h-3 w-3" />}
                          Generate Schema
                        </button>
                      )}
                    </div>
                    {schemaLoading ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--slb-blue-500)] mb-3" />
                        <p className="text-xs text-[var(--text-muted)] font-semibold">Creating structured schema markup...</p>
                      </div>
                    ) : schemaResult ? (
                      <pre className="flex-1 whitespace-pre-wrap text-xs leading-relaxed text-yellow-500 bg-slate-950 p-4 rounded-lg overflow-y-auto max-h-[300px] font-mono border border-slate-800">
                        {schemaResult}
                      </pre>
                    ) : (
                      <p className="text-xs text-[var(--text-muted)] py-6 text-center italic">Click Generate Schema to get structural JSON-LD scripting.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BATCH AUDIT BULK MODE */}
        {auditMode === "batch" && (
          <div className="space-y-8 animate-fadeInUp">
            <Card className="p-6 bg-[var(--bg-primary)]">
              <form onSubmit={handleBatchAudit} className="space-y-4">
                <label htmlFor="batch-urls" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Enter URLs (comma or newline separated)
                </label>
                <textarea
                  id="batch-urls"
                  value={batchInput}
                  onChange={(e) => setBatchInput(e.target.value)}
                  placeholder="https://google.com&#10;https://github.com&#10;https://wikipedia.org"
                  rows={4}
                  required
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)] font-mono"
                />
                <button
                  type="submit"
                  disabled={batchLoading || !batchInput.trim()}
                  className="slb-btn slb-btn-primary w-full sm:w-auto px-6 py-2.5 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  {batchLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Auditing Batch in Parallel…
                    </>
                  ) : (
                    <>
                      <Layers className="h-4 w-4" />
                      Start Batch Audit
                    </>
                  )}
                </button>
              </form>
            </Card>

            {batchError && (
              <Card className="p-4 border-red-500/30 bg-red-500/10 text-red-400">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-semibold">{batchError}</p>
                </div>
              </Card>
            )}

            {batchLoading && batchResults.length === 0 && (
              <Card className="p-12 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--slb-blue-500)] mb-4" />
                <p className="text-sm text-[var(--text-muted)] font-semibold">Running bulk site diagnostics in Playwright sandboxes...</p>
              </Card>
            )}

            {batchResults.length > 0 && (
              <Card className="p-6 bg-[var(--bg-primary)] overflow-x-auto animate-fadeInUp">
                <h3 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider mb-4 pb-2 border-b border-[var(--border-light)]">
                  Batch Scan Outcome Overview
                </h3>

                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border-medium)]">
                      <th className="py-3 px-4 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Target Domain</th>
                      <th className="py-3 px-4 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">SEO Score</th>
                      <th className="py-3 px-4 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Meta Title</th>
                      <th className="py-3 px-4 font-semibold text-[var(--text-muted)] text-xs uppercase tracking-wider">Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((item, idx) => {
                      const isErr = "error" in item;
                      const score = isErr ? null : item.seo_score;
                      return (
                        <tr key={idx} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-secondary)] transition-colors">
                          <td className="py-3.5 px-4 font-semibold font-mono text-xs text-[var(--slb-blue-500)] break-all max-w-[200px]" title={item.url}>
                            {item.url || "Unknown URL"}
                          </td>
                          <td className="py-3.5 px-4">
                            {isErr ? (
                              <span className="text-red-400 font-bold">N/A</span>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                score >= 80 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                              }`}>{score}/100</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 max-w-[200px] truncate text-[var(--text-secondary)]">
                            {isErr ? "Failed to scan" : item.title}
                          </td>
                          <td className="py-3.5 px-4 text-xs font-semibold">
                            {isErr ? (
                              <span className="text-red-400 flex items-center gap-1">❌ {item.error}</span>
                            ) : (
                              <span className="text-green-500 flex items-center gap-1">✅ Success</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
