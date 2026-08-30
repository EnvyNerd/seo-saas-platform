import { useState } from "react";
import { Globe, Loader2, AlertCircle, Copy, CheckSquare, Sparkles, Layers, ListFilter } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Card, Container, Button, Input, Badge, Alert, HeroSection } from "../components/ui";

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
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="Keyword Intelligence"
        subtitle="Discover high-intent search terms, LSI phrases, and semantic variants powered by advanced AI Agents."
      />

      <Container className="py-8 relative z-10">
        {/* Toggle Mode Controls */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1.5 bg-surface-tertiary p-1.5 rounded-xl border border-border-light shadow-sm w-fit">
            <button
              onClick={() => { setMode("single"); setError(""); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                mode === "single"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Sparkles size={16} />
              Single Topic
            </button>
            <button
              onClick={() => { setMode("batch"); setBatchError(""); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                mode === "batch"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Layers size={16} />
              Batch Topics
            </button>
          </div>
        </div>

        {/* SINGLE TOPIC FORM */}
        {mode === "single" && (
          <div className="space-y-8 animate-fadeInUp max-w-4xl mx-auto">
            <Card variant="elevated" className="p-8 bg-surface-primary border-t-4 border-t-slb-blue-500">
              <form onSubmit={handleSingleSubmit} className="space-y-6">
                <Input
                  label="Target Topic or Niche"
                  id="keyword-topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. sustainable home gardening"
                  required
                  startIcon={ListFilter}
                  helperText="Describe your industry or specific topic to generate semantic keywords."
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={!topic.trim()}
                  startIcon={Sparkles}
                  className="shadow-lg shadow-slb-blue-500/20"
                >
                  Generate Semantic Strategy
                </Button>
              </form>
            </Card>

            {error && (
              <Alert variant="error" title="Generation Failed" onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            {results && (
              <Card variant="elevated" className="p-8 bg-surface-primary border-border-light overflow-hidden shadow-xl animate-fadeInUp">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border-light pb-6 mb-6 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slb-blue-500/10 rounded-lg text-slb-blue-500">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-display">Keyword Results Map</h2>
                      <p className="text-xs text-text-muted mt-1">Semantic clusters and search intent analysis</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => triggerCopy(results, "single")}
                    startIcon={copiedKey === "single" ? CheckSquare : Copy}
                  >
                    {copiedKey === "single" ? "Copied to Clipboard" : "Copy Keyword List"}
                  </Button>
                </div>
                
                <div className="prose prose-slate dark:prose-invert max-w-none text-text-secondary leading-relaxed bg-surface-secondary/30 p-6 rounded-xl border border-border-light shadow-inner">
                  <div className="markdown-content font-sans">
                    <ReactMarkdown>{results}</ReactMarkdown>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* BATCH TOPIC FORM */}
        {mode === "batch" && (
          <div className="space-y-8 animate-fadeInUp max-w-4xl mx-auto">
            <Card variant="elevated" className="p-8 bg-surface-primary border-t-4 border-t-slb-blue-500">
              <form onSubmit={handleBatchSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="batch-topics" className="block text-sm font-bold text-text-primary">
                    Enter Topics List
                  </label>
                  <p className="text-xs text-text-muted mb-3">One topic per line or comma-separated for bulk processing.</p>
                  <textarea
                    id="batch-topics"
                    value={batchInput}
                    onChange={(e) => setBatchInput(e.target.value)}
                    placeholder="sustainable home gardening&#10;organic seed packets&#10;backyard composting"
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
                  Start Batch Generation
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
                <h3 className="text-lg font-bold text-text-primary">Bulk Brainstorming Active</h3>
                <p className="text-sm text-text-muted mt-2 text-center max-w-md">Our AI Agents are parallel-processing your topics to find the best organic opportunities...</p>
              </div>
            )}

            {batchResults.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between bg-surface-primary p-4 rounded-xl border border-border-light shadow-sm">
                  <Badge variant="info" size="lg">Batch Completed: {batchResults.length} Topics</Badge>
                  <p className="text-xs text-text-muted font-medium italic">Showing deep-dive reports for each niche.</p>
                </div>
                
                {batchResults.map((item, idx) => (
                  <Card
                    key={idx}
                    variant="outline"
                    className="p-8 bg-surface-primary border-border-light overflow-hidden hover:shadow-lg transition-all animate-fadeInUp border-l-4 border-l-slb-blue-500"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="flex items-center justify-between border-b border-border-light pb-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slb-blue-500/10 rounded text-slb-blue-500">
                          <Sparkles size={16} />
                        </div>
                        <h3 className="font-bold font-display text-text-primary">
                          Topic: <span className="text-slb-blue-500">{item.topic}</span>
                        </h3>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => triggerCopy(item.keywords, `batch-${idx}`)}
                        startIcon={copiedKey === `batch-${idx}` ? CheckSquare : Copy}
                      >
                        {copiedKey === `batch-${idx}` ? "Copied" : "Copy"}
                      </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-text-secondary leading-relaxed bg-surface-secondary/20 p-5 rounded-xl border border-border-light/50">
                      <div className="markdown-content font-sans">
                        <ReactMarkdown>{item.keywords}</ReactMarkdown>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
