import { useState, useEffect } from "react";
import { Activity, ShieldCheck, Database, Key, Wifi, AlertTriangle, Play, CheckCircle, Info, RefreshCw, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";
import { Container, Section, Card } from "../components/ui";

export default function Settings() {
  const [diagData, setDiagData] = useState(null);
  const [diagLoading, setDiagLoading] = useState(false);
  const [error, setError] = useState(null);

  // Key configurations form state
  const [apiKeyName, setApiKeyName] = useState("GEMINI_API_KEY");
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [configSuccess, setConfigSuccess] = useState("");
  const [configLoading, setConfigLoading] = useState(false);

  const fetchDiagnostics = async () => {
    setDiagLoading(true);
    setError(null);
    try {
      const response = await api.get("/analytics/doctor");
      setDiagData(response.data);
    } catch (err) {
      setError("Failed to run doctor diagnostics. Ensure the backend is reachable.");
    } finally {
      setDiagLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleConfigSubmit = async (e) => {
    e.preventDefault();
    if (!apiKeyValue.trim()) return;
    setConfigLoading(true);
    setConfigSuccess("");
    setError(null);

    try {
      const response = await api.post("/analytics/config/set", {
        key: apiKeyName,
        value: apiKeyValue,
      });
      setConfigSuccess(response.data.message);
      setApiKeyValue("");
      // Rerun diagnostics to show key config update
      fetchDiagnostics();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update configuration key.");
    } finally {
      setConfigLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)] relative">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <main className="relative z-10 pb-16">
        <Container className="pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                System Diagnostics & Settings
              </h1>
              <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mt-1">
                Monitor system health, check database integrity, verify external API connectivity, and manage API keys.
              </p>
            </div>
            <button
              onClick={fetchDiagnostics}
              disabled={diagLoading}
              className="slb-btn slb-btn-secondary px-4 py-2 text-sm flex items-center gap-2 self-start md:self-auto shadow-sm"
            >
              {diagLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Re-run Doctor Check
            </button>
          </div>

          {error && (
            <Card className="p-4 mb-8 border-red-500/30 bg-red-500/10 text-red-400">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left side: diagnostic checklists */}
            <div className="lg:col-span-2 space-y-6">
              <Section className="slb-card rounded-xl p-6 bg-[var(--bg-primary)]">
                <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                  <Activity className="text-[var(--slb-blue-500)] h-5 w-5" />
                  Health Check Checklist
                </h2>

                {diagLoading && !diagData ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin text-[var(--slb-blue-500)] mb-4" />
                    <p className="text-sm text-[var(--text-muted)] italic">Running diagnostic checks...</p>
                  </div>
                ) : diagData ? (
                  <div className="space-y-6">
                    {/* Item 1: Env File */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                      <ShieldCheck className={`h-6 w-6 mt-0.5 shrink-0 ${diagData.env_exists ? "text-green-500" : "text-yellow-500"}`} />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                          Environment Configuration File
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${diagData.env_exists ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {diagData.env_exists ? "FOUND" : "MISSING"}
                          </span>
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {diagData.env_exists
                            ? "Your backend environment file (.env) is present and ready to initialize configuration tokens."
                            : "Your .env configuration file is missing from the backend folder. API requests will fail."}
                        </p>
                      </div>
                    </div>

                    {/* Item 2: DB Connection */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                      <Database className={`h-6 w-6 mt-0.5 shrink-0 ${diagData.db_connected ? "text-green-500" : "text-red-500"}`} />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                          Database Connectivity
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${diagData.db_connected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {diagData.db_connected ? "CONNECTED" : "OFFLINE"}
                          </span>
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {diagData.db_connected
                            ? "SQLite database connected successfully. Models can write audit outcomes and retrieve historical project snapshots."
                            : `Database connection failed. Detail: ${diagData.db_error}`}
                        </p>
                      </div>
                    </div>

                    {/* Item 3: API Keys */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                      <Key className="h-6 w-6 text-yellow-500 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">API Key Configurations</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
                          Diagnostics check on configured tokens to power the AI Agents.
                        </p>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {Object.entries(diagData.keys || {}).map(([key, active]) => (
                            <div key={key} className="flex items-center gap-2 p-2 bg-[var(--bg-primary)] rounded border border-[var(--border-light)]">
                              <span className={`h-2 w-2 rounded-full ${active ? "bg-green-500" : "bg-red-500"}`} />
                              <span className="text-[10px] font-mono truncate" title={key}>{key}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Item 4: Network Connectivity */}
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                      <Wifi className={`h-6 w-6 mt-0.5 shrink-0 ${diagData.internet_connected ? "text-green-500" : "text-red-500"}`} />
                      <div className="flex-1">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                          Internet & External API Connectivity
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${diagData.internet_connected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                            {diagData.internet_connected ? "ACTIVE" : "DISCONNECTED"}
                          </span>
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {diagData.internet_connected
                            ? "Internet network is online. The orchestrator can crawl remote URLs and hit external AI backends."
                            : "Internet check failed. Please check host routing rules and server DNS parameters."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">No diagnostic data gathered. Run check above.</p>
                )}
              </Section>
            </div>

            {/* Right side: config editing form */}
            <div className="lg:col-span-1 space-y-6">
              <Section className="slb-card rounded-xl p-6 bg-[var(--bg-primary)]">
                <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
                  <Key className="text-[var(--slb-blue-500)] h-5 w-5" />
                  Configure Keys
                </h2>

                <form onSubmit={handleConfigSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="key-select" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Key Name
                    </label>
                    <select
                      id="key-select"
                      value={apiKeyName}
                      onChange={(e) => setApiKeyName(e.target.value)}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all font-mono"
                    >
                      <option value="GEMINI_API_KEY">GEMINI_API_KEY</option>
                      <option value="OPENROUTER_API_KEY">OPENROUTER_API_KEY</option>
                      <option value="SERPAPI_API_KEY">SERPAPI_API_KEY</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="key-value" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex justify-between">
                      <span>Key Value</span>
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="text-[var(--slb-blue-500)] hover:underline flex items-center gap-1 normal-case font-normal"
                      >
                        {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {showKey ? "Hide" : "Show"}
                      </button>
                    </label>
                    <input
                      id="key-value"
                      type={showKey ? "text" : "password"}
                      value={apiKeyValue}
                      onChange={(e) => setApiKeyValue(e.target.value)}
                      placeholder="Enter new key value"
                      required
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg px-4 py-2.5 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--slb-blue-500)]/50 transition-all font-mono"
                    />
                  </div>

                  {configSuccess && (
                    <div className="p-3 text-xs bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                      <span>{configSuccess}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={configLoading || !apiKeyValue.trim()}
                    className="slb-btn slb-btn-primary w-full px-4 py-2.5 font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    {configLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving Key…
                      </>
                    ) : (
                      "Update Key Config"
                    )}
                  </button>
                </form>

                <div className="mt-6 border-t border-[var(--border-light)] pt-4 flex gap-2">
                  <Info className="h-4 w-4 text-[var(--text-muted)] shrink-0 mt-0.5" />
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                    Updating key configuration modifies the backend `.env` file directly. New settings apply on subsequent agent orchestrations immediately.
                  </p>
                </div>
              </Section>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
