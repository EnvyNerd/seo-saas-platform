import { useState } from "react";
import { Sparkles, Loader2, Target, Globe, FileText, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Section } from "../components/ui";

export default function Strategy() {
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
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />
      
      <main className="relative z-10 pb-16">
        <Container className="pt-8">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              AI SEO Strategy Orchestrator
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl">
              Launch multiple AI agents to research keywords, analyze competitors, and generate a complete content roadmap.
            </p>
          </div>

          <Section className="slb-card rounded-xl p-6 md:p-8 mb-8 animate-fadeInUp">
            <form onSubmit={runStrategy} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Main Topic / Keyword
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., SEO for AI SaaS Startups"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Target URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://yourwebsite.com/page"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-light)] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !topic}
                className="slb-btn slb-btn-primary w-full md:w-auto px-8 py-3 flex items-center justify-center gap-2 font-bold shadow-xl shadow-blue-500/10"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Orchestrating Agents...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate Full Strategy
                  </>
                )}
              </button>
            </form>
          </Section>

          {error && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 mb-8 animate-shake">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-fadeInUp">
              {/* Research Summary Cards */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="slb-card p-6 rounded-xl border-l-4 border-blue-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="text-blue-500" />
                    <h3 className="font-bold">Keyword Research</h3>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] line-clamp-3 overflow-hidden">
                    <ReactMarkdown>{result.research.keywords.keywords_report}</ReactMarkdown>
                  </div>
                  <button className="mt-4 text-xs font-bold text-blue-500 uppercase tracking-widest hover:underline">View Details →</button>
                </div>

                <div className="slb-card p-6 rounded-xl border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="text-purple-500" />
                    <h3 className="font-bold">Competitor Gaps</h3>
                  </div>
                  <div className="text-sm text-[var(--text-secondary)] line-clamp-3 overflow-hidden">
                    <ReactMarkdown>{result.research.competitors.insights}</ReactMarkdown>
                  </div>
                  <button className="mt-4 text-xs font-bold text-purple-500 uppercase tracking-widest hover:underline">View Details →</button>
                </div>

                <div className="slb-card p-6 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="text-green-500" />
                    <h3 className="font-bold">Site Audit</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {result.research.site_audit ? `Score: ${result.research.site_audit.seo_score}/100` : "No URL provided for audit."}
                  </p>
                  <button className="mt-4 text-xs font-bold text-green-500 uppercase tracking-widest hover:underline">View Details →</button>
                </div>
              </div>

              {/* Main Content Output */}
              <div className="slb-card rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-2xl bg-[var(--bg-primary)]">
                <div className="bg-[var(--bg-tertiary)] px-8 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="text-[var(--slb-blue-500)]" />
                    <span className="font-bold uppercase tracking-widest text-sm">Generated Content Strategy</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-500 font-bold">READY</span>
                </div>
                <div className="p-8 md:p-12 prose prose-invert max-w-none">
                  <ReactMarkdown className="markdown-content">
                    {result.output.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
}
