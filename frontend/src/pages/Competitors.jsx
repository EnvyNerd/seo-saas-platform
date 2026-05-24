import { useState } from "react";
import { Target, Loader2, Globe, TrendingUp, Sparkles, AlertCircle, Copy, CheckSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Section, Card } from "../components/ui";

export default function Competitors() {
  const [activeTab, setActiveTab] = useState("compare"); // "insights" or "compare"
  const [keyword, setKeyword] = useState("");
  const [myUrl, setMyUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [insightsResult, setInsightsResult] = useState(null);
  const [gapResult, setGapResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInsightsSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setInsightsResult(null);

    try {
      const response = await api.post("/competitors/analyze", { keyword });
      setInsightsResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Competitor analysis failed. Please check your keys/network.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareSubmit = async (e) => {
    e.preventDefault();
    if (!myUrl.trim() || !competitorUrl.trim()) return;
    setLoading(true);
    setError(null);
    setGapResult(null);

    try {
      const response = await api.post("/competitors/compare", {
        my_url: myUrl,
        competitor_url: competitorUrl,
      });
      setGapResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Content gap analysis failed. Ensure both URLs are accessible.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />
      
      <main className="relative z-10 pb-16">
        <Container className="pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                Competitor Intelligence
              </h1>
              <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mt-1">
                Discover your organic search competitors and run content gap analysis to spot opportunities.
              </p>
            </div>
            {/* Tab Switches */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-light)] shrink-0 self-start md:self-auto">
              <button
                onClick={() => { setActiveTab("compare"); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "compare"
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Content Gap Analysis
              </button>
              <button
                onClick={() => { setActiveTab("insights"); setError(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === "insights"
                    ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                Competitor Insights
              </button>
            </div>
          </div>

          {error && (
            <Card className="p-4 mb-8 border-red-500/30 bg-red-500/10 text-red-400">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </Card>
          )}

          {/* TAB 1: CONTENT GAP ANALYSIS */}
          {activeTab === "compare" && (
            <div className="space-y-8 animate-fadeInUp">
              <Section className="slb-card rounded-xl p-6 md:p-8 bg-[var(--bg-primary)]">
                <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  <Globe className="text-[var(--slb-blue-500)] h-5 w-5" />
                  Compare Site Content Gaps
                </h2>
                <form onSubmit={handleCompareSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Your Page URL
                      </label>
                      <input
                        type="url"
                        value={myUrl}
                        onChange={(e) => setMyUrl(e.target.value)}
                        placeholder="https://mywebsite.com/my-blog-post"
                        required
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)] text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Competitor Page URL
                      </label>
                      <input
                        type="url"
                        value={competitorUrl}
                        onChange={(e) => setCompetitorUrl(e.target.value)}
                        placeholder="https://competitor.com/ranking-blog-post"
                        required
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)] text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !myUrl || !competitorUrl}
                    className="slb-btn slb-btn-primary w-full md:w-auto px-6 py-3 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Comparing Pages (JS Rendering)…
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4" />
                        Run Gap Analysis
                      </>
                    )}
                  </button>
                </form>
              </Section>

              {gapResult && (
                <div className="space-y-8 animate-fadeInUp">
                  {/* Summary Overview */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="slb-card p-6 rounded-xl bg-[var(--bg-primary)]">
                      <h3 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider mb-3">Your Site Metrics</h3>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5 border-b border-[var(--border-light)]">
                          <span>SEO Score</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            gapResult.my_audit.seo_score >= 80 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                          }`}>{gapResult.my_audit.seo_score}/100</span>
                        </p>
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5 border-b border-[var(--border-light)]">
                          <span>Title</span>
                          <span className="truncate max-w-[200px] text-[var(--text-secondary)] font-normal">{gapResult.my_audit.title}</span>
                        </p>
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5">
                          <span>Total Links</span>
                          <span className="text-[var(--text-secondary)] font-normal">{gapResult.my_audit.total_links}</span>
                        </p>
                      </div>
                    </div>

                    <div className="slb-card p-6 rounded-xl bg-[var(--bg-primary)]">
                      <h3 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider mb-3">Competitor Site Metrics</h3>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5 border-b border-[var(--border-light)]">
                          <span>SEO Score</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            gapResult.competitor_audit.seo_score >= 80 ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                          }`}>{gapResult.competitor_audit.seo_score}/100</span>
                        </p>
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5 border-b border-[var(--border-light)]">
                          <span>Title</span>
                          <span className="truncate max-w-[200px] text-[var(--text-secondary)] font-normal">{gapResult.competitor_audit.title}</span>
                        </p>
                        <p className="text-sm font-semibold flex items-center justify-between py-1.5">
                          <span>Total Links</span>
                          <span className="text-[var(--text-secondary)] font-normal">{gapResult.competitor_audit.total_links}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Markdown Report */}
                  <div className="slb-card rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-xl bg-[var(--bg-primary)]">
                    <div className="bg-[var(--bg-tertiary)] px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-[var(--slb-blue-500)] h-5 w-5" />
                        <span className="font-bold uppercase tracking-widest text-xs">Content Gap Report</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(gapResult.gap_report)}
                        className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-light)] px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] font-medium transition-colors"
                      >
                        {copied ? (
                          <>
                            <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy Report
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-6 md:p-10 prose prose-slate dark:prose-invert max-w-none">
                      <ReactMarkdown className="markdown-content">
                        {gapResult.gap_report}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPETITOR INSIGHTS */}
          {activeTab === "insights" && (
            <div className="space-y-8 animate-fadeInUp">
              <Section className="slb-card rounded-xl p-6 md:p-8 bg-[var(--bg-primary)]">
                <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                  <Target className="text-[var(--slb-blue-500)] h-5 w-5" />
                  Analyze Topic Competitors
                </h2>
                <form onSubmit={handleInsightsSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Focus Keyword / Topic
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="e.g. cloud security compliance tools"
                        required
                        className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)] text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loading || !keyword.trim()}
                        className="slb-btn slb-btn-primary px-6 py-3 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all shrink-0"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Scrutinizing SERPs…
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4" />
                            Analyze SERPs
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </Section>

              {insightsResult && (
                <div className="grid lg:grid-cols-3 gap-8 items-start animate-fadeInUp">
                  {/* Left list */}
                  <div className="lg:col-span-1 slb-card p-6 bg-[var(--bg-primary)]">
                    <h3 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border-light)] pb-2">
                      Top Organic Competitors
                    </h3>
                    <div className="space-y-3">
                      {insightsResult.competitors?.map((comp, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] hover:border-[var(--border-focus)] transition-colors">
                          <p className="font-semibold text-sm truncate text-[var(--text-primary)] mb-1">{comp.title || "No Title"}</p>
                          <a
                            href={comp.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--slb-blue-500)] hover:underline break-all"
                          >
                            {comp.link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right insights */}
                  <div className="lg:col-span-2 slb-card p-6 md:p-8 bg-[var(--bg-primary)]">
                    <h3 className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-wider mb-4 border-b border-[var(--border-light)] pb-2 flex items-center gap-2">
                      <Sparkles className="text-yellow-500 h-4 w-4" />
                      AI Competitor Analysis & Action Plan
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                      <ReactMarkdown>{insightsResult.insights}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
