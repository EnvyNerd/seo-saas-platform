import { useState } from "react";
import { FileText, Loader2, AlertCircle, Sparkles, Wand2, Copy, CheckSquare, RefreshCw, LayoutGrid, FileEdit } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Card, Container, HeroSection, Button, Input, Select, Badge, Alert, Tabs } from "../components/ui";

const CONTENT_TYPES = [
  { value: "Blog Post", label: "Blog Post" },
  { value: "Landing Page", label: "Landing Page" },
  { value: "Product Description", label: "Product Description" },
  { value: "FAQ", label: "FAQ" },
  { value: "Meta Description", label: "Meta Description" },
];

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState("generate"); // "generate" or "standalone-humanizer"

  // Generation State
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Blog Post");
  const [context, setContext] = useState("");
  const [humanize, setHumanize] = useState(false);
  const [arena, setArena] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null); // stores full agent response

  // Standalone Humanizer State
  const [humanizeInput, setHumanizeInput] = useState("");
  const [humanizeIntensity, setHumanizeIntensity] = useState("medium");
  const [humanizedOutput, setHumanizedOutput] = useState("");
  const [humanizerLoading, setHumanizerLoading] = useState(false);
  const [humanizerError, setHumanizerError] = useState("");

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResultData(null);

    try {
      const response = await api.post("/content/generate", {
        topic,
        content_type: contentType,
        context,
        humanize,
        arena,
      });
      setResultData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Content generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleHumanizeStandalone = async (e) => {
    e.preventDefault();
    if (!humanizeInput.trim()) return;
    setHumanizerLoading(true);
    setHumanizerError("");
    setHumanizedOutput("");

    try {
      const response = await api.post("/content/humanize", {
        text: humanizeInput,
        intensity: humanizeIntensity,
      });
      setHumanizedOutput(response.data.humanized);
    } catch (err) {
      setHumanizerError(err.response?.data?.detail || "Failed to humanize text.");
    } finally {
      setHumanizerLoading(false);
    }
  };

  const triggerCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="AI Content Suite"
        subtitle="Craft premium, SEO-optimized articles, perform side-by-side AI model comparisons, or humanize machine output for organic authenticity."
      />

      <Container className="py-8 relative z-10">
        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-1.5 bg-surface-tertiary p-1.5 rounded-xl border border-border-light shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("generate")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "generate"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <FileEdit size={16} />
              Draft Engine
            </button>
            <button
              onClick={() => setActiveTab("standalone-humanizer")}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                activeTab === "standalone-humanizer"
                  ? "bg-surface-primary text-text-primary shadow-md ring-1 ring-border-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-primary/50"
              }`}
            >
              <Wand2 size={16} />
              Humanizer
            </button>
          </div>
        </div>

        {/* TAB 1: GENERATOR & ARENA */}
        {activeTab === "generate" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Controls Column */}
              <Card variant="elevated" className="lg:col-span-1 p-8 bg-surface-primary border-t-4 border-t-slb-blue-500">
                <form onSubmit={handleGenerate} className="space-y-6">
                  <Input
                    label="Primary Topic"
                    id="gen-topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. cloud security audit checklist"
                    required
                    startIcon={Sparkles}
                    helperText="What is the core theme of your content?"
                  />

                  <Select
                    label="Content Format"
                    id="gen-type"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    options={CONTENT_TYPES}
                  />

                  <div className="space-y-2">
                    <label htmlFor="gen-context" className="text-xs font-bold uppercase tracking-wider text-text-muted">
                      Advanced Context & Keywords
                    </label>
                    <textarea
                      id="gen-context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Target keyword: security controls, compliance. Keep tone technical."
                      rows={3}
                      className="w-full bg-surface-secondary border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-slb-blue-500/50 transition-all placeholder:text-text-muted font-sans"
                    />
                  </div>

                  {/* Feature Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <LayoutGrid className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Arena Mode</h4>
                          <p className="text-[10px] text-text-muted">Compare Gemini vs DeepSeek</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={arena}
                          onChange={(e) => {
                            setArena(e.target.checked);
                            if (e.target.checked) setHumanize(false);
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slb-blue-500"></div>
                      </label>
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors ${arena ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                          <Wand2 className="h-4 w-4 text-yellow-500 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary">Humanize</h4>
                          <p className="text-[10px] text-text-muted">Bypass AI pattern detection</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={humanize}
                          onChange={(e) => setHumanize(e.target.checked)}
                          disabled={arena}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-border-medium peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slb-blue-500"></div>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    loading={loading}
                    disabled={!topic.trim()}
                    startIcon={FileText}
                    className="shadow-lg shadow-slb-blue-500/20"
                  >
                    Draft Article
                  </Button>
                </form>
              </Card>

              {/* View Column */}
              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <Alert variant="error" title="Generation Error" onClose={() => setError("")}>
                    {error}
                  </Alert>
                )}

                {loading ? (
                  <Card className="p-20 flex flex-col items-center justify-center bg-surface-primary rounded-2xl border border-border-light shadow-sm">
                    <Loader2 className="h-12 w-12 animate-spin text-slb-blue-500 mb-6" />
                    <h3 className="text-lg font-bold text-text-primary">Agent Orchestration Active</h3>
                    <p className="text-sm text-text-muted mt-2 text-center max-w-md">Our specialized Content Agents are research-drafting and optimizing your copy. This involves deep search and semantic alignment.</p>
                  </Card>
                ) : resultData ? (
                  /* Output Rendering */
                  resultData.mode === "arena" ? (
                    <div className="space-y-6 animate-fadeInUp">
                      <div className="flex items-center gap-3 bg-surface-tertiary p-4 border border-border-light rounded-xl shadow-inner">
                        <LayoutGrid className="h-5 w-5 text-purple-500" />
                        <div>
                          <h3 className="font-bold text-sm">Model Comparison Arena</h3>
                          <p className="text-[10px] text-text-muted">Review side-by-side outputs to pick the best narrative.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Column 1: Gemini */}
                        <Card variant="outline" className="p-0 bg-surface-primary flex flex-col h-[650px] overflow-hidden border-t-4 border-t-slb-blue-500">
                          <div className="flex items-center justify-between bg-surface-secondary/50 px-6 py-4 border-b border-border-light">
                            <Badge variant="primary">Gemini 2.0 Flash</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => triggerCopy(resultData.results["Gemini 2.0 Flash"], "gemini")}
                              startIcon={copiedKey === "gemini" ? CheckSquare : Copy}
                            >
                              {copiedKey === "gemini" ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown className="markdown-content">
                              {resultData.results["Gemini 2.0 Flash"]}
                            </ReactMarkdown>
                          </div>
                        </Card>

                        {/* Column 2: DeepSeek */}
                        <Card variant="outline" className="p-0 bg-surface-primary flex flex-col h-[650px] overflow-hidden border-t-4 border-t-purple-500">
                          <div className="flex items-center justify-between bg-surface-secondary/50 px-6 py-4 border-b border-border-light">
                            <Badge variant="neutral" className="bg-purple-500/10 text-purple-500">DeepSeek-V3</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => triggerCopy(resultData.results["OpenRouter (DeepSeek/GPT)"], "deepseek")}
                              startIcon={copiedKey === "deepseek" ? CheckSquare : Copy}
                            >
                              {copiedKey === "deepseek" ? "Copied" : "Copy"}
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown className="markdown-content">
                              {resultData.results["OpenRouter (DeepSeek/GPT)"]}
                            </ReactMarkdown>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    /* Single Output rendering */
                    <Card variant="elevated" className="overflow-hidden border-border-light shadow-xl bg-surface-primary animate-fadeInUp p-0 border-t-4 border-t-slb-blue-500">
                      <div className="bg-surface-secondary/50 px-8 py-5 border-b border-border-light flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slb-blue-500/10 rounded-lg text-slb-blue-500">
                            <Sparkles size={18} />
                          </div>
                          <div>
                            <span className="font-bold uppercase tracking-widest text-[10px] text-text-muted">Draft Outcome</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <h3 className="font-bold text-sm">Generated Content</h3>
                              {resultData.humanized && (
                                <Badge variant="success" size="sm" className="text-[8px]">HUMANIZED</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => triggerCopy(resultData.content, "single")}
                          startIcon={copiedKey === "single" ? CheckSquare : Copy}
                        >
                          {copiedKey === "single" ? "Copied" : "Copy Article"}
                        </Button>
                      </div>
                      <div className="p-10 prose prose-slate dark:prose-invert max-w-none bg-surface-primary">
                        <ReactMarkdown className="markdown-content font-sans leading-relaxed">
                          {resultData.content}
                        </ReactMarkdown>
                      </div>
                    </Card>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-20 bg-surface-primary rounded-2xl border border-dashed border-border-medium opacity-60">
                    <div className="p-4 bg-surface-secondary rounded-full mb-4">
                      <FileText size={48} className="text-text-muted" />
                    </div>
                    <h3 className="text-lg font-bold text-text-muted">No Content Generated</h3>
                    <p className="text-sm text-text-muted mt-2 text-center max-w-xs">Fill out the parameters on the left and click "Draft Article" to begin.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STANDALONE HUMANIZER */}
        {activeTab === "standalone-humanizer" && (
          <div className="space-y-8 animate-fadeInUp max-w-5xl mx-auto">
            <Card variant="elevated" className="p-10 bg-surface-primary border-t-4 border-t-yellow-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
                  <Wand2 size={32} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-display">AI Text Humanizer</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Increase perplexity, vary sentence structures, and remove machine-like patterns.
                  </p>
                </div>
              </div>

              <form onSubmit={handleHumanizeStandalone} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Input */}
                  <div className="space-y-3 flex flex-col">
                    <label htmlFor="hum-input" className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                      <FileText size={14} />
                      AI Generated Input
                    </label>
                    <textarea
                      id="hum-input"
                      value={humanizeInput}
                      onChange={(e) => setHumanizeInput(e.target.value)}
                      placeholder="Paste robotic text here..."
                      rows={14}
                      required
                      className="w-full flex-1 bg-surface-secondary border border-border-light rounded-xl px-4 py-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-slb-blue-500/50 transition-all font-sans leading-relaxed"
                    />
                  </div>

                  {/* Right Column: Output */}
                  <div className="space-y-3 flex flex-col">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                        <Sparkles size={14} className="text-yellow-500" />
                        Humanized Outcome
                      </label>
                      {humanizedOutput && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => triggerCopy(humanizedOutput, "humanized-standalone")}
                          startIcon={copiedKey === "humanized-standalone" ? CheckSquare : Copy}
                          className="text-[10px]"
                        >
                          {copiedKey === "humanized-standalone" ? "Copied" : "Copy Output"}
                        </Button>
                      )}
                    </div>
                    {humanizerLoading ? (
                      <div className="w-full flex-1 bg-surface-secondary/50 border border-border-light rounded-xl p-10 flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="h-12 w-12 animate-spin text-slb-blue-500 mb-6" />
                        <h4 className="text-sm font-bold text-text-primary animate-pulse">Analyzing Style Factor...</h4>
                        <p className="text-xs text-text-muted mt-2 text-center max-w-[200px]">Adjusting burstiness and semantic variance for organic feel.</p>
                      </div>
                    ) : humanizedOutput ? (
                      <div className="w-full flex-1 bg-surface-primary border border-border-light rounded-xl p-6 text-sm text-text-secondary overflow-y-auto min-h-[400px] shadow-inner prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{humanizedOutput}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="w-full flex-1 bg-surface-secondary/20 border border-dashed border-border-medium rounded-xl p-10 flex flex-col items-center justify-center text-text-muted min-h-[400px]">
                        <Wand2 size={40} className="mb-4 opacity-20" />
                        <p className="text-sm italic text-center">Submit content to generate humanized variants.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-8 border-t border-border-light">
                  {/* Intensity Choice */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Intensity Scale:</span>
                    <div className="flex bg-surface-tertiary p-1 rounded-xl border border-border-light shadow-sm">
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setHumanizeIntensity(level)}
                          className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            humanizeIntensity === level
                              ? "bg-surface-primary text-slb-blue-500 shadow-md ring-1 ring-border-light"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {humanizerError && (
                    <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
                      <AlertCircle size={14} />
                      {humanizerError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={humanizerLoading}
                    disabled={!humanizeInput.trim()}
                    startIcon={Wand2}
                    className="w-full sm:w-auto px-10 shadow-lg shadow-yellow-500/10"
                  >
                    Bypass AI Detection
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
