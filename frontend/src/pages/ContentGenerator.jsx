import { useState } from "react";
import { FileText, Loader2, AlertCircle, Sparkles, Wand2, Copy, CheckSquare, RefreshCw, LayoutGrid } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Card, Container, HeroSection } from "../components/ui";

const CONTENT_TYPES = [
  "Blog Post",
  "Landing Page",
  "Product Description",
  "FAQ",
  "Meta Description",
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
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="AI Content Suite"
        subtitle="Create premium SEO articles, compare models in Arena mode, or humanize AI outputs."
      />

      <Container className="py-8 relative z-10">
        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-[var(--bg-tertiary)] p-1 rounded-xl border border-[var(--border-light)] w-fit mb-8">
          <button
            onClick={() => setActiveTab("generate")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "generate"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Generate Content
          </button>
          <button
            onClick={() => setActiveTab("standalone-humanizer")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "standalone-humanizer"
                ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm ring-1 ring-[var(--border-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            AI Text Humanizer
          </button>
        </div>

        {/* TAB 1: GENERATOR & ARENA */}
        {activeTab === "generate" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Controls Column */}
              <Card className="lg:col-span-1 p-6 bg-[var(--bg-primary)] h-fit">
                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="gen-topic" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Topic or Head Keyword
                    </label>
                    <input
                      id="gen-topic"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. cloud security audit checklist"
                      required
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gen-type" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Content Type
                    </label>
                    <select
                      id="gen-type"
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all"
                    >
                      {CONTENT_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="gen-context" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Additional Context (Keywords, instructions)
                    </label>
                    <textarea
                      id="gen-context"
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Target keyword: security controls, compliance. Keep tone technical."
                      rows={3}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all placeholder:text-[var(--text-muted)] font-sans"
                    />
                  </div>

                  {/* AI Arena Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                        <LayoutGrid className="h-3.5 w-3.5 text-purple-500" />
                        AI Arena Mode
                      </h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Gemini vs DeepSeek side-by-side</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={arena}
                        onChange={(e) => {
                          setArena(e.target.checked);
                          if (e.target.checked) setHumanize(false); // mutually exclusive or unnecessary
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[var(--border-medium)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--slb-blue-500)]"></div>
                    </label>
                  </div>

                  {/* Humanizer Toggle */}
                  <div className={`flex items-center justify-between p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] ${arena ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                        <Wand2 className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                        Humanize Draft
                      </h4>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Rewrite output to bypass detection</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={humanize}
                        onChange={(e) => setHumanize(e.target.checked)}
                        disabled={arena}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-[var(--border-medium)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--slb-blue-500)]"></div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !topic.trim()}
                    className="w-full bg-[var(--slb-navy)] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[var(--slb-navy-800)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating Draft…
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </button>
                </form>
              </Card>

              {/* View Column */}
              <div className="lg:col-span-2 space-y-6">
                {error && (
                  <Card className="p-4 border-red-500/30 bg-red-500/10 text-red-400">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-sm font-semibold">{error}</p>
                    </div>
                  </Card>
                )}

                {loading ? (
                  <Card className="p-12 flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--slb-blue-500)] mb-4" />
                    <p className="text-sm text-[var(--text-muted)] italic font-semibold">Orchestrating AI content generation agent...</p>
                  </Card>
                ) : resultData ? (
                  /* Output Rendering */
                  resultData.mode === "arena" ? (
                    <div className="space-y-6 animate-fadeInUp">
                      <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] p-3 border border-[var(--border-light)] rounded-xl">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h3 className="font-bold text-sm">AI Content Arena Outcomes</h3>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Column 1: Gemini */}
                        <div className="slb-card p-6 bg-[var(--bg-primary)] flex flex-col h-[600px]">
                          <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3 mb-4">
                            <span className="font-bold text-sm text-[var(--slb-blue-500)]">Gemini 2.0 Flash</span>
                            <button
                              onClick={() => triggerCopy(resultData.results["Gemini 2.0 Flash"], "gemini")}
                              className="text-xs flex items-center gap-1 text-[var(--text-secondary)] border border-[var(--border-light)] px-2 py-1 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
                            >
                              {copiedKey === "gemini" ? <CheckSquare className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                              Copy
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto pr-1 prose prose-sm dark:prose-invert max-w-none text-xs">
                            <ReactMarkdown className="markdown-content">
                              {resultData.results["Gemini 2.0 Flash"]}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {/* Column 2: DeepSeek */}
                        <div className="slb-card p-6 bg-[var(--bg-primary)] flex flex-col h-[600px]">
                          <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3 mb-4">
                            <span className="font-bold text-sm text-purple-500">OpenRouter (DeepSeek/GPT)</span>
                            <button
                              onClick={() => triggerCopy(resultData.results["OpenRouter (DeepSeek/GPT)"], "deepseek")}
                              className="text-xs flex items-center gap-1 text-[var(--text-secondary)] border border-[var(--border-light)] px-2 py-1 rounded bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
                            >
                              {copiedKey === "deepseek" ? <CheckSquare className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                              Copy
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto pr-1 prose prose-sm dark:prose-invert max-w-none text-xs">
                            <ReactMarkdown className="markdown-content">
                              {resultData.results["OpenRouter (DeepSeek/GPT)"]}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Single Output rendering */
                    <div className="slb-card rounded-2xl overflow-hidden border border-[var(--border-light)] shadow-xl bg-[var(--bg-primary)] animate-fadeInUp">
                      <div className="bg-[var(--bg-tertiary)] px-6 py-4 border-b border-[var(--border-light)] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="text-[var(--slb-blue-500)] h-5 w-5" />
                          <span className="font-bold uppercase tracking-widest text-xs">Generated Output</span>
                          {resultData.humanized && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-bold border border-green-500/20">HUMANIZED</span>
                          )}
                        </div>
                        <button
                          onClick={() => triggerCopy(resultData.content, "single")}
                          className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] border border-[var(--border-light)] px-3 py-1.5 rounded-lg bg-[var(--bg-primary)] font-medium transition-colors"
                        >
                          {copiedKey === "single" ? (
                            <>
                              <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy Draft
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                        <ReactMarkdown className="markdown-content">
                          {resultData.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
                ) : (
                  <Card className="p-12 text-center bg-[var(--bg-primary)]">
                    <p className="text-sm text-[var(--text-muted)]">Run the content generation form on the left to review outputs.</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STANDALONE HUMANIZER */}
        {activeTab === "standalone-humanizer" && (
          <div className="space-y-8 animate-fadeInUp">
            <Card className="p-6 bg-[var(--bg-primary)]">
              <h2 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Wand2 className="text-yellow-500 h-5 w-5" />
                AI Content Standalone Humanizer
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mb-6">
                Paste any AI-generated article or copy text blocks below to increase perplexity/burstiness and remove robotic AI patterns.
              </p>

              <form onSubmit={handleHumanizeStandalone} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column: Input */}
                  <div className="space-y-2 flex flex-col">
                    <label htmlFor="hum-input" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      AI Generated Text Input
                    </label>
                    <textarea
                      id="hum-input"
                      value={humanizeInput}
                      onChange={(e) => setHumanizeInput(e.target.value)}
                      placeholder="Paste your ChatGPT or Claude text here..."
                      rows={14}
                      required
                      className="w-full flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all font-mono"
                    />
                  </div>

                  {/* Right Column: Output */}
                  <div className="space-y-2 flex flex-col">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Humanized Output Preview
                      </label>
                      {humanizedOutput && (
                        <button
                          type="button"
                          onClick={() => triggerCopy(humanizedOutput, "humanized-standalone")}
                          className="text-[10px] text-[var(--slb-blue-500)] hover:underline flex items-center gap-1"
                        >
                          {copiedKey === "humanized-standalone" ? <CheckSquare className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                          Copy Output
                        </button>
                      )}
                    </div>
                    {humanizerLoading ? (
                      <div className="w-full flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--slb-blue-500)] mb-3" />
                        <p className="text-xs text-[var(--text-muted)] font-semibold">Humanizing style factors...</p>
                      </div>
                    ) : humanizedOutput ? (
                      <div className="w-full flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-4 text-sm text-[var(--text-primary)] overflow-y-auto max-h-[320px] md:max-h-none min-h-[300px] prose prose-sm dark:prose-invert">
                        <ReactMarkdown>{humanizedOutput}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="w-full flex-1 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg p-6 flex items-center justify-center text-xs text-[var(--text-muted)] italic min-h-[300px]">
                        Submit form to review humanized drafts.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between pt-4 border-t border-[var(--border-light)]">
                  {/* Intensity Choice */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Intensity:</span>
                    <div className="flex bg-[var(--bg-tertiary)] p-1 rounded-lg border border-[var(--border-light)]">
                      {["low", "medium", "high"].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setHumanizeIntensity(level)}
                          className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                            humanizeIntensity === level
                              ? "bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm"
                              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {humanizerError && (
                    <span className="text-xs text-red-400 font-semibold">{humanizerError}</span>
                  )}

                  <button
                    type="submit"
                    disabled={humanizerLoading || !humanizeInput.trim()}
                    className="slb-btn slb-btn-primary w-full sm:w-auto px-6 py-2.5 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    {humanizerLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Humanizing Style...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Apply Humanizer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </Container>
    </div>
  );
}
