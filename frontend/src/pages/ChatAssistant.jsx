import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Trash2, Sparkles, Loader2, User, CheckSquare, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Card } from "../components/ui";

const SUGGESTED_PROMPTS = [
  "How do I optimize my page for featured snippets?",
  "Write an H1-H3 heading outline for a 'Deep Learning guide'",
  "What is EEAT and how do AI search engines check for it?",
  "Provide a checklist for technical site audits",
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI SEO Assistant. Ask me anything about search engine optimization, keywords, technical audits, content creation, or general questions! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (msgText) => {
    const textToSend = msgText || input;
    if (!textToSend.trim()) return;

    if (!msgText) setInput(""); // Clear input

    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: textToSend,
        clear_history: false,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error: Failed to retrieve a response. Please check your API keys and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your chat history?")) return;
    setLoading(true);
    try {
      await api.post("/ai/chat", {
        message: "hello",
        clear_history: true,
      });
      setMessages([
        {
          role: "assistant",
          content: "Chat history cleared. I am ready for a fresh conversation! What's on your mind?",
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyMessageText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative overflow-hidden">
      <div className="mesh-grid absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Chat Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-[var(--border-light)] bg-[var(--bg-primary)] px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--slb-blue-500)] to-[var(--slb-cyan-400)] text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">AI SEO Assistant</h1>
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              General purpose & SEO specialist chat
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          disabled={loading || messages.length <= 1}
          className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Chat
        </button>
      </header>

      {/* Main chat layout */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 space-y-6">
        <Container className="max-w-4xl space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-4 animate-fadeInUp ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-white ${
                    isUser
                      ? "border-blue-500 bg-blue-600 shadow-sm"
                      : "border-[var(--border-light)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-[var(--slb-blue-500)]" />}
                </div>

                {/* Message Box */}
                <div className={`relative max-w-[80%] group`}>
                  <div
                    className={`rounded-xl px-4 py-3 text-sm shadow-sm leading-relaxed border ${
                      isUser
                        ? "bg-[var(--slb-blue-500)] text-white border-[var(--slb-blue-500)]"
                        : "bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-light)]"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <ReactMarkdown className="markdown-content">{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                  {/* Actions on hover */}
                  {!isUser && (
                    <button
                      onClick={() => copyMessageText(msg.content, index)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-secondary)] border border-[var(--border-light)] p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] shadow-sm"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <CheckSquare className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-4 items-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--bg-tertiary)] text-[var(--text-primary)]">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--slb-blue-500)]" />
              </div>
              <div className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] px-4 py-3 text-xs text-[var(--text-muted)] italic shadow-sm">
                Thinking…
              </div>
            </div>
          )}

          {/* Starters block */}
          {messages.length === 1 && !loading && (
            <div className="grid sm:grid-cols-2 gap-3 pt-6 max-w-2xl mx-auto">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-3 text-left text-xs rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-focus)] hover:text-[var(--text-primary)] transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </Container>
      </div>

      {/* Input Tray */}
      <footer className="relative z-10 border-t border-[var(--border-light)] bg-[var(--bg-primary)] px-6 py-4">
        <Container className="max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-[var(--slb-blue-500)]/40 transition-all"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about SEO..."
              disabled={loading}
              className="flex-1 bg-transparent border-0 outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-0 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--slb-blue-500)] text-white hover:bg-[var(--slb-blue-400)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </Container>
      </footer>
    </div>
  );
}
