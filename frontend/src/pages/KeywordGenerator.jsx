import { useState } from "react";
import { Globe, Loader2, AlertCircle, Copy, CheckSquare, Sparkles, Layers } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Card, Container } from "../components/ui";
import ToolPageShell from "../components/ToolPageShell";

export default function KeywordGenerator() {
  const [mode, setMode] = useState("single"); // "single" or "batch"

  // Single Topic State
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState("");
  const [error, setError] = useState("");

  // Batch Topics State
  const [batchInput, setBatchInput] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResults, setBatchResults] = useState([]);
  const [batchError, setBatchError] = useState("");

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState("");

  const triggerCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResults("");

    try {
      const response = await api.post("/keywords/generate", { topic: topic.trim() });
      setResults(response.data.keywords);
    } catch (err) {
      setError(err.response?.data?.detail || "Keyword generation failed. Please check your API keys.");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (!batchInput.trim()) return;
    setBatchLoading(true);
    setBatchError("");
    setBatchResults([]);

    const topics = batchInput
      .split(/[\n,]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (topics.length === 0) {
      setBatchError("Please enter at least one topic.");
      setBatchLoading(false);
      return;
    }

    try {
      const response = await api.post("/keywords/batch", { topics });
      setBatchResults(response.data.results);
    } catch (err) {
      setBatchError("Batch keyword generation failed.");
    } finally {
      setBatchLoading(false);
    }
  };

  return (
    <ToolPageShell
      title="AI Keyword Generator"
      subtitle="Examine organic search queries, LSI phrases, and semantic variants for target search domains."
      icon={Globe}
    >
      {/* Switch Mode Controls */}
      <div className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-light)] w-fit mb-8 relative z-10">
        <button
          onClick={() => { setMode("single"); setError(""); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            mode === "single"
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Single Topic
        </button>
        <button
          onClick={() => { setMode("batch"); setBatchError(""); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            mode === "batch"
              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Batch Keywords
        </button>
      </div>

      {/* SINGLE TOPIC FORM */}
      {mode === "single" && (
        <div className="space-y-6 relative z-10">
          <form
            onSubmit={handleSingleSubmit}
            className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] p-6 shadow-sm"
          >
            <label htmlFor="keyword-topic" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Topic or niche
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="keyword-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. sustainable home gardening"
                required
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="slb-btn slb-btn-primary px-6 py-3 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Keywords
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {results && (
            <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] p-6 shadow-sm animate-fadeInUp">
              <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 mb-4">
                <h2 className="text-lg font-bold font-display">Keyword Results Map</h2>
                <button
                  onClick={() => triggerCopy(results, "single")}
                  className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] border border-[var(--border-light)] px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] font-medium transition-colors"
                >
                  {copiedKey === "single" ? (
                    <>
                      <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy List
                    </>
                  )}
                </button>
              </div>
              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown className="markdown-content">
                  {results}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BATCH TOPIC FORM */}
      {mode === "batch" && (
        <div className="space-y-6 relative z-10">
          <form
            onSubmit={handleBatchSubmit}
            className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] p-6 shadow-sm"
          >
            <label htmlFor="batch-topics" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Topics (comma or newline separated)
            </label>
            <textarea
              id="batch-topics"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="sustainable home gardening&#10;organic seed packets&#10;backyard composting"
              rows={4}
              required
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all font-mono"
            />
            <button
              type="submit"
              disabled={batchLoading || !batchInput.trim()}
              className="slb-btn slb-btn-primary px-6 py-2.5 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all mt-4 text-sm"
            >
              {batchLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Batch…
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  Generate Batch Keywords
                </>
              )}
            </button>
          </form>

          {batchError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {batchError}
            </div>
          )}

          {batchLoading && batchResults.length === 0 && (
            <Card className="p-12 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--slb-blue-500)] mb-4" />
              <p className="text-sm text-[var(--text-muted)] font-semibold">Generating keywords for multiple topics with Gemini Agent...</p>
            </Card>
          )}

          {batchResults.length > 0 && (
            <div className="space-y-6">
              {batchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] p-6 shadow-sm animate-fadeInUp"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 mb-4">
                    <h3 className="font-bold font-display text-sm text-[var(--slb-blue-500)] flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Topic: {item.topic}
                    </h3>
                    <button
                      onClick={() => triggerCopy(item.keywords, `batch-${idx}`)}
                      className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] border border-[var(--border-light)] px-2.5 py-1.5 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] font-medium transition-colors"
                    >
                      {copiedKey === `batch-${idx}` ? (
                        <>
                          <CheckSquare className="h-3 w-3 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed">
                    <ReactMarkdown className="markdown-content">
                      {item.keywords}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </ToolPageShell>
  );
}
