import { useState } from "react";
import { Sparkles, Loader2, Target, Globe, FileText, CheckCircle2, ChevronRight, AlertCircle, Zap, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Section, Card, Button, Input, Badge, Alert, HeroSection } from "../components/ui";
import { useNavigate } from "react-router-dom";

export default function Strategy() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runStrategy = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = { topic, project_id: 1 };
      if (url) payload.target_url = url;
      
      const response = await api.post("/ai/strategy", payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate strategy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />
      
      <HeroSection
        title="SEO Strategy Orchestrator"
        subtitle="Deploy an autonomous swarm of AI agents to perform deep market research, competitive auditing, and multi-channel content roadmapping."
      />

      <Container className="py-8 relative z-10">
        <Card variant="elevated" className="p-8 bg-surface-primary max-w-4xl mx-auto border-t-4 border-t-slb-blue-500 mb-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slb-blue-500/10 rounded-xl text-slb-blue-500">
              <Zap size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-text-primary">Launch Swarm Intelligence</h2>
              <p className="text-sm text-text-muted mt-1">Specify your target niche and optional domain to begin the deep-dive analysis.</p>
            </div>
          </div>

          <form onSubmit={runStrategy} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Primary Focus Keyword"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. enterprise cloud security"
                required
                startIcon={Target}
                helperText="The main topic your strategy will revolve around."
              />
              <Input
                label="Target Domain (Optional)"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                startIcon={Globe}
                helperText="If provided, we will audit your site against competitors."
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!topic}
              startIcon={Sparkles}
              className="shadow-lg shadow-slb-blue-500/20"
            >
              {loading ? "Orchestrating Multi-Agent Swarm..." : "Execute Global SEO Strategy"}
            </Button>
          </form>
        </Card>

        {error && (
          <Alert variant="error" title="Strategy Execution Failed" className="max-w-4xl mx-auto mb-10" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {result && (
          <div className="space-y-10 animate-fadeInUp">
            {/* Research Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-slb-blue-500 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-slb-blue-500/10 rounded-lg text-slb-blue-500">
                    <Search size={18} />
                  </div>
                  <h3 className="font-bold text-sm">Keyword Analysis</h3>
                </div>
                <div className="text-xs text-text-secondary line-clamp-4 leading-relaxed italic">
                  <ReactMarkdown>{result.research.keywords.keywords_report}</ReactMarkdown>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/keywords")}
                  className="mt-4 p-0 h-auto text-slb-blue-500 hover:bg-transparent hover:underline font-bold uppercase tracking-widest text-[10px]"
                >
                  Explore Keywords →
                </Button>
              </Card>

              <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-purple-500 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    <Target size={18} />
                  </div>
                  <h3 className="font-bold text-sm">Competitor Gaps</h3>
                </div>
                <div className="text-xs text-text-secondary line-clamp-4 leading-relaxed italic">
                  <ReactMarkdown>{result.research.competitors.insights}</ReactMarkdown>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/competitors")}
                  className="mt-4 p-0 h-auto text-purple-500 hover:bg-transparent hover:underline font-bold uppercase tracking-widest text-[10px]"
                >
                  Analyze Rivals →
                </Button>
              </Card>

              <Card variant="outline" className="p-6 bg-surface-primary border-l-4 border-l-green-500 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                    <CheckCircle2 size={18} />
                  </div>
                  <h3 className="font-bold text-sm">Site Audit</h3>
                </div>
                {result.research.site_audit ? (
                  <div>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-3xl font-bold font-display text-text-primary">{result.research.site_audit.seo_score}</span>
                      <span className="text-xs text-text-muted mb-1.5">/ 100</span>
                    </div>
                    <Badge variant="success" size="sm">Verification Complete</Badge>
                  </div>
                ) : (
                  <p className="text-xs text-text-muted italic leading-relaxed">No URL provided for automated crawl analysis.</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/app/audit-details")}
                  className="mt-4 p-0 h-auto text-green-500 hover:bg-transparent hover:underline font-bold uppercase tracking-widest text-[10px]"
                >
                  View Full Audit →
                </Button>
              </Card>
            </div>

            {/* Main Content Output */}
            <Card variant="elevated" className="overflow-hidden bg-surface-primary p-0 border-t-4 border-t-slb-blue-500 shadow-2xl">
              <div className="bg-surface-secondary/50 px-10 py-6 border-b border-border-light flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slb-blue-500/10 rounded-xl text-slb-blue-500">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span className="font-bold uppercase tracking-widest text-[10px] text-text-muted">Master Intelligence Report</span>
                    <h3 className="font-bold text-lg">Omnichannel Content Strategy</h3>
                  </div>
                </div>
                <Badge variant="success" size="lg" className="font-bold px-4">READY</Badge>
              </div>
              <div className="p-10 md:p-14 prose prose-slate dark:prose-invert max-w-none bg-surface-primary">
                <div className="markdown-content font-sans leading-relaxed">
                  <ReactMarkdown>{result.output.content}</ReactMarkdown>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
