import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Trash2, Sparkles, Loader2, User, CheckSquare, Copy, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../api/axios";
import { Container, Card, Button, Input, Badge } from "../components/ui";

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
    <div className="flex flex-col h-[calc(100vh-65px)] bg-surface-secondary text-text-primary relative overflow-hidden">
      <div className="mesh-grid absolute inset-0 pointer-events-none z-0 opacity-40" />

      {/* Chat Header */}
      <header className="relative z-10 flex items-center justify-between border-b border-border-light bg-surface-primary px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slb-blue-500/10 text-slb-blue-500 shadow-sm border border-slb-blue-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-lg font-bold">SEO Assistant</h1>
              <Badge variant="success" size="sm" className="text-[8px] px-1 py-0 h-4">Online</Badge>
            </div>
            <p className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
              Powered by Gemini 2.0 Flash
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          disabled={loading || messages.length <= 1}
          startIcon={Trash2}
          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
        >
          Clear History
        </Button>
      </header>

      {/* Main chat layout */}
      <div className="flex-1 overflow-y-auto px-6 py-8 relative z-10 custom-scrollbar">
        <Container className="max-w-4xl space-y-8">
          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex gap-5 animate-fadeInUp ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all shadow-sm ${
                    isUser
                      ? "border-slb-blue-500 bg-slb-blue-500 text-white"
                      : "border-border-light bg-surface-primary text-slb-blue-500"
                  }`}
                >
                  {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </div>

                {/* Message Box */}
                <div className={`relative max-w-[85%] group`}>
                  <Card 
                    variant={isUser ? "flat" : "elevated"} 
                    className={`px-5 py-4 text-sm leading-relaxed border transition-all ${
                      isUser
                        ? "bg-slb-blue-500 text-white border-slb-blue-500 rounded-tr-none shadow-slb-blue-500/10"
                        : "bg-surface-primary text-text-primary border-border-light rounded-tl-none"
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <ReactMarkdown className="markdown-content font-sans">{msg.content}</ReactMarkdown>
                      )}
                    </div>
                  </Card>
                  
                  {/* Actions on hover */}
                  {!isUser && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyMessageText(msg.content, index)}
                      className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-primary border border-border-light h-8 w-8 p-0 min-w-0 rounded-full shadow-md"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <CheckSquare className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {loading && (
            <div className="flex gap-5 items-center animate-pulse">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-light bg-surface-primary text-slb-blue-500">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <div className="rounded-xl border border-border-light bg-surface-primary px-5 py-3 text-xs text-text-muted italic shadow-sm">
                Thinking about your strategy...
              </div>
            </div>
          )}

          {/* Starters block */}
          {messages.length === 1 && !loading && (
            <div className="grid sm:grid-cols-2 gap-4 pt-10 max-w-3xl mx-auto">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="p-4 text-left text-xs font-semibold rounded-xl border border-border-light bg-surface-primary text-text-secondary hover:border-slb-blue-500 hover:text-slb-blue-500 hover:shadow-lg hover:shadow-slb-blue-500/5 transition-all shadow-sm flex items-center gap-3 group"
                >
                  <div className="p-1.5 rounded-lg bg-surface-secondary group-hover:bg-slb-blue-500/10 transition-colors">
                    <Sparkles className="h-3.5 w-3.5 text-text-muted group-hover:text-slb-blue-500" />
                  </div>
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </Container>
      </div>

      {/* Input Tray */}
      <footer className="relative z-10 border-t border-border-light bg-surface-primary px-6 py-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <Container className="max-w-4xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-4"
          >
            <div className="flex-1 relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about SEO..."
                disabled={loading}
                className="w-full bg-surface-secondary border border-border-light rounded-xl px-5 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-slb-blue-500/40 transition-all pr-12 shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-[10px] font-bold uppercase tracking-wider opacity-50 group-focus-within:opacity-0 transition-opacity">
                Enter ↵
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              variant="primary"
              className="h-[52px] w-[52px] rounded-xl shadow-lg shadow-slb-blue-500/20"
              loading={loading}
            >
              {!loading && <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-center text-[10px] text-text-muted mt-4 uppercase tracking-[0.1em] font-medium opacity-50">
            AI can make mistakes. Verify critical information.
          </p>
        </Container>
      </footer>
    </div>
  );
}
