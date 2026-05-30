import { useState } from "react";
import { Target, Loader2, Globe, TrendingUp, Sparkles, AlertCircle, Copy, CheckSquare, Search, Zap, BarChart3, Layout } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Section, Card, Button, Input, Badge, Alert, HeroSection } from "../components/ui";

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
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />
      
      <HeroSection
        title="Competitor Intelligence"
        subtitle="Discover organic search rivals, reverse-engineer their strategies, and identify critical content gaps to outrank the competition."
      />

      <Container className="py-8 relative z-10">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1.5 bg-surface-tertiary p-1.5 rounded-xl border border-border-light shadow-sm w-fit">
            <button
              onClick={() => { setActiveTab("compare"); setError(null); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "compare"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Layout size={16} />
              Content Gap
            </button>
            <button
              onClick={() => { setActiveTab("insights"); setError(null); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "insights"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Search size={16} />
              SERP Insights
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="error" title="Analysis Error" className="max-w-4xl mx-auto mb-8" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* TAB 1: CONTENT GAP ANALYSIS */}
        {activeTab === "compare" && (
          <div className="space-y-10 animate-fadeInUp">
            <Card variant="elevated" className="p-8 bg-surface-primary max-w-4xl mx-auto border-t-4 border-t-slb-blue-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slb-blue-500/10 rounded-xl text-slb-blue-500">
                  <Globe size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">Deep Content Comparison</h2>
                  <p className="text-sm text-text-muted mt-1">Directly compare your page against a top-ranking competitor.</p>
                </div>
              </div>

              <form onSubmit={handleCompareSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Input
                    label="Your Page URL"
                    type="url"
                    value={myUrl}
                    onChange={(e) => setMyUrl(e.target.value)}
                    placeholder="https://mywebsite.com/my-post"
                    required
                    startIcon={User}
                  />
                  <Input
                    label="Competitor Page URL"
                    type="url"
                    value={competitorUrl}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    placeholder="https://competitor.com/ranking-post"
                    required
                    startIcon={Target}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!myUrl || !competitorUrl}
                  startIcon={Zap}
                  className="shadow-lg shadow-slb-blue-500/20"
                >
                  {loading ? "Analyzing DOM Structures..." : "Run Gap Analysis"}
                </Button>
              </form>
            </Card>

            {gapResult && (
              <div className="space-y-10 animate-fadeInUp">
                {/* Summary Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-slb-blue-500">
                    <h3 className="font-bold text-xs text-text-muted uppercase tracking-widest mb-4">Your Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-secondary">SEO Score</span>
                        <Badge variant={gapResult.my_audit.seo_score >= 80 ? "success" : "warning"} size="lg">
                          {gapResult.my_audit.seo_score}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Meta Title</span>
                        <p className="text-sm font-bold text-text-primary truncate" title={gapResult.my_audit.title}>
                          {gapResult.my_audit.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border-light">
                        <span className="text-xs font-medium text-text-muted">Links Found</span>
                        <span className="text-sm font-bold text-text-primary">{gapResult.my_audit.total_links}</span>
                      </div>
                    </div>
                  </Card>

                  <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-purple-500">
                    <h3 className="font-bold text-xs text-text-muted uppercase tracking-widest mb-4">Competitor Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-secondary">SEO Score</span>
                        <Badge variant={gapResult.competitor_audit.seo_score >= 80 ? "success" : "warning"} size="lg">
                          {gapResult.competitor_audit.seo_score}%
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Meta Title</span>
                        <p className="text-sm font-bold text-text-primary truncate" title={gapResult.competitor_audit.title}>
                          {gapResult.competitor_audit.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border-light">
                        <span className="text-xs font-medium text-text-muted">Links Found</span>
                        <span className="text-sm font-bold text-text-primary">{gapResult.competitor_audit.total_links}</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Markdown Report */}
                <Card variant="elevated" className="overflow-hidden bg-surface-primary p-0 border-t-4 border-t-yellow-500 shadow-xl">
                  <div className="bg-surface-secondary/50 px-8 py-5 border-b border-border-light flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                        <Sparkles size={18} />
                      </div>
                      <div>
                        <span className="font-bold uppercase tracking-widest text-[10px] text-text-muted">AI Strategic Analysis</span>
                        <h3 className="font-bold text-sm">Content Optimization Roadmap</h3>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(gapResult.gap_report)}
                      startIcon={copied ? CheckSquare : Copy}
                    >
                      {copied ? "Copied" : "Copy Report"}
                    </Button>
                  </div>
                  <div className="p-10 prose prose-slate dark:prose-invert max-w-none bg-surface-primary">
                    <ReactMarkdown className="markdown-content font-sans leading-relaxed">
                      {gapResult.gap_report}
                    </ReactMarkdown>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COMPETITOR INSIGHTS */}
        {activeTab === "insights" && (
          <div className="space-y-10 animate-fadeInUp">
            <Card variant="elevated" className="p-8 bg-surface-primary max-w-4xl mx-auto border-t-4 border-t-slb-blue-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slb-blue-500/10 rounded-xl text-slb-blue-500">
                  <Search size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-display">SERP Landscape Analysis</h2>
                  <p className="text-sm text-text-muted mt-1">Audit the top 10 organic results for any focus keyword.</p>
                </div>
              </div>

              <form onSubmit={handleInsightsSubmit} className="space-y-6">
                <Input
                  label="Focus Keyword / Target Query"
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. enterprise cloud security tools"
                  required
                  startIcon={BarChart3}
                  helperText="Our agents will scrutinize the live search results for this term."
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!keyword.trim()}
                  startIcon={TrendingUp}
                  className="shadow-lg shadow-slb-blue-500/20"
                >
                  {loading ? "Scrutinizing live SERP data..." : "Analyze Market Leaders"}
                </Button>
              </form>
            </Card>

            {insightsResult && (
              <div className="grid lg:grid-cols-3 gap-8 items-start animate-fadeInUp">
                {/* Left list */}
                <Card variant="outline" className="lg:col-span-1 p-6 bg-surface-primary border-t-4 border-t-slb-blue-500">
                  <h3 className="font-bold text-xs text-text-muted uppercase tracking-widest mb-6 border-b border-border-light pb-4">
                    Organic Rivals
                  </h3>
                  <div className="space-y-4">
                    {insightsResult.competitors?.map((comp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary hover:border-slb-blue-500/50 transition-all group">
                        <p className="font-bold text-sm truncate text-text-primary group-hover:text-slb-blue-500 transition-colors mb-1">{comp.title || "Untitled Result"}</p>
                        <a
                          href={comp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slb-blue-500 hover:underline break-all font-mono opacity-70 group-hover:opacity-100"
                        >
                          {comp.link}
                        </a>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Right insights */}
                <Card variant="elevated" className="lg:col-span-2 p-8 md:p-10 bg-surface-primary border-t-4 border-t-yellow-500 shadow-xl">
                  <div className="flex items-center gap-3 mb-8 pb-4 border-b border-border-light">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-display text-text-primary">Competitive Action Plan</h3>
                      <p className="text-xs text-text-muted mt-0.5">AI-generated offensive strategy based on SERP patterns.</p>
                    </div>
                  </div>
                  <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-text-secondary">
                    <ReactMarkdown className="markdown-content font-sans">
                      {insightsResult.insights}
                    </ReactMarkdown>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
