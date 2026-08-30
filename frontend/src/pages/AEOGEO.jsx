import { useState } from "react";
import { Search, Loader2, Sparkles, AlertCircle, Copy, CheckSquare, Layers, Tag, ExternalLink, Globe, FileText, Layout, Image as ImageIcon, BarChart3 } from "lucide-react";
import api from "../api/axios";
import { Card, Container, HeroSection, Button, Input, Badge, Alert, Tabs, Progress, CircularProgress } from "../components/ui";
import ReactMarkdown from "react-markdown";

function ScoreBadge({ score, label }) {
  const getVariant = () => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <Card variant="elevated" className="flex flex-col items-center justify-center p-8 bg-surface-primary border-border-light min-w-[180px]">
      <div className="relative mb-4">
        <CircularProgress
          value={score}
          size={120}
          strokeWidth={10}
          variant={getVariant()}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold font-display ${
            score >= 80 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"
          }`}>
            {score}
          </span>
        </div>
      </div>
      <Badge variant={getVariant()} size="lg" className="font-bold">{label}</Badge>
    </Card>
  );
}

function AuditMetric({ label, value, icon: Icon, description }) {
  return (
    <Card variant="outline" className="p-5 bg-surface-primary hover:bg-surface-secondary transition-all group">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-2 bg-slb-blue-500/10 rounded-lg text-slb-blue-500 group-hover:bg-slb-blue-500 group-hover:text-white transition-all">
            <Icon size={20} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            {label}
          </p>
          <p className="text-sm font-bold text-text-primary break-words leading-snug">
            {value || "—"}
          </p>
          {description && (
            <p className="text-[10px] text-text-muted mt-2 leading-relaxed italic">
              {description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function AEOGEO() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [deepResult, setDeepResult] = useState(null);
  const [standaloneResult, setStandaloneResult] = useState(null);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const triggerCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const runDeepAudit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setDeepResult(null);
    setStandaloneResult(null);

    try {
      const response = await api.post(`/audit/deep`, { url: url.trim(), ai_recommendations: true });
      setDeepResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to execute deep audit.");
    } finally {
      setLoading(false);
    }
  };

  const runStandaloneAEOGEO = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setDeepResult(null);
    setStandaloneResult(null);

    try {
      const response = await api.get(`/seo/audit?url=${encodeURIComponent(url.trim())}`);
      const auditData = response.data;
      const geoResponse = await api.post("/aeo-geo/geo", {
        url: url.trim(),
        html: auditData.html || "",
        visible_text: auditData.visible_text || "",
        schema_org: auditData.schema_org || "",
      });
      setStandaloneResult(geoResponse.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to execute AEO/GEO analysis.");
    } finally {
      setLoading(false);
    }
  };

  const renderComponentDetails = (components) => {
    if (!components) return null;
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(components).map(([name, comp]) => (
          <Card key={name} variant="outline" className="p-5 bg-surface-primary">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                {name.replace(/_/g, " ")}
              </p>
              <Badge variant={comp.score >= 80 ? "success" : comp.score >= 50 ? "warning" : "error"}>
                {comp.score}/100
              </Badge>
            </div>
            {comp.issues?.length > 0 && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">Issues</p>
                <ul className="space-y-1">
                  {comp.issues.map((issue, idx) => (
                    <li key={idx} className="text-xs text-text-secondary leading-relaxed">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {comp.recommendations?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-400 mb-1">Recommendations</p>
                <ul className="space-y-1">
                  {comp.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs text-text-secondary leading-relaxed">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <HeroSection
        title="AEO & GEO Analysis"
        subtitle="Optimize for Answer Engine Optimization and Generative Engine Optimization. Improve how AI and search assistants cite, quote, and surface your content."
      />

      <Container size="xl" className="py-8 relative z-10">
        <Card variant="elevated" className="p-8 bg-surface-primary w-full border-t-4 border-t-slb-blue-500 mb-8">
          <form onSubmit={runDeepAudit} className="space-y-6">
            <Input
              label="Target Website URL"
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              startIcon={Globe}
              helperText="Provide the full URL including protocol (http/https)."
            />
            
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                loading={loading}
                disabled={!url.trim()}
                startIcon={BarChart3}
                className="shadow-lg shadow-slb-blue-500/20"
              >
                {loading ? "Running Deep Audit..." : "Run Deep Audit with AEO/GEO"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                loading={loading}
                disabled={!url.trim()}
                onClick={runStandaloneAEOGEO}
                className="shadow-lg shadow-slb-blue-500/20"
              >
                AEO/GEO Only
              </Button>
            </div>
          </form>
        </Card>

        {error && (
          <Alert variant="error" title="Analysis Failed" className="w-full mb-8" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {deepResult && deepResult.aeo_geo && (
          <div className="space-y-8 animate-fadeInUp">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="shrink-0 flex items-center justify-center">
                <ScoreBadge score={deepResult.aeo_geo.geo_score} label="GEO Score" />
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <ScoreBadge score={deepResult.aeo_geo.aeo_score} label="AEO Score" />
              </div>
              <div className="flex-1 grid gap-4 sm:grid-cols-2">
                <AuditMetric label="Analyzed URL" value={deepResult.url} icon={Globe} />
                <AuditMetric label="Final URL" value={deepResult.final_url} icon={ExternalLink} />
                <AuditMetric label="Status Code" value={deepResult.status_code} icon={FileText} />
                <AuditMetric label="Response Time" value={`${deepResult.response_time_ms}ms`} icon={BarChart3} />
              </div>
            </div>

            <Card variant="elevated" className="p-6 bg-surface-primary">
              <h3 className="text-lg font-bold font-display mb-4">AEO/GEO Component Breakdown</h3>
              {renderComponentDetails(deepResult.aeo_geo.components)}
            </Card>

            {deepResult.aeo_geo.recommendations?.length > 0 && (
              <Card variant="elevated" className="p-6 bg-surface-primary">
                <h3 className="text-lg font-bold font-display mb-4">Top Recommendations</h3>
                <ul className="space-y-2">
                  {deepResult.aeo_geo.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                      <span className="text-slb-blue-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {deepResult.ai_recommendations && (
              <Card variant="elevated" className="p-6 bg-surface-primary">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold font-display flex items-center gap-2">
                    <Sparkles size={20} className="text-slb-blue-500" />
                    AI Recommendations
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => triggerCopy(deepResult.ai_recommendations, "ai-rec")}
                  >
                    {copiedKey === "ai-rec" ? <CheckSquare size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  <ReactMarkdown>{deepResult.ai_recommendations}</ReactMarkdown>
                </div>
              </Card>
            )}
          </div>
        )}

        {standaloneResult && (
          <div className="space-y-8 animate-fadeInUp">
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              <div className="shrink-0 flex items-center justify-center">
                <ScoreBadge score={standaloneResult.geo_score} label="GEO Score" />
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <ScoreBadge score={standaloneResult.aeo_score} label="AEO Score" />
              </div>
            </div>

            <Card variant="elevated" className="p-6 bg-surface-primary">
              <h3 className="text-lg font-bold font-display mb-4">AEO/GEO Component Breakdown</h3>
              {renderComponentDetails(standaloneResult.components)}
            </Card>

            {standaloneResult.recommendations?.length > 0 && (
              <Card variant="elevated" className="p-6 bg-surface-primary">
                <h3 className="text-lg font-bold font-display mb-4">Top Recommendations</h3>
                <ul className="space-y-2">
                  {standaloneResult.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-text-secondary leading-relaxed flex gap-2">
                      <span className="text-slb-blue-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
