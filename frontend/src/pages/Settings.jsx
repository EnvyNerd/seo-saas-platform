import { useState, useEffect } from "react";
import { Activity, ShieldCheck, Database, Key, Wifi, AlertTriangle, Play, CheckCircle, Info, RefreshCw, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";
import { Container, Section, Card, Button, Input, Select, Badge, Alert } from "../components/ui";

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
    <div className="min-h-screen bg-surface-secondary text-text-primary relative pb-16">
      <div className="mesh-grid fixed inset-0 pointer-events-none z-0 opacity-50" />

      <Container className="pt-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              System Diagnostics
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl mt-2">
              Monitor system health, check database integrity, verify external API connectivity, and manage API keys.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={fetchDiagnostics}
            loading={diagLoading}
            startIcon={RefreshCw}
          >
            Re-run Doctor Check
          </Button>
        </div>

        {error && (
          <Alert variant="error" title="Diagnostic Error" className="mb-8" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left side: diagnostic checklists */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated" className="p-6 md:p-8 bg-surface-primary">
              <h2 className="text-xl font-bold font-display mb-8 flex items-center gap-3">
                <div className="p-2 bg-slb-blue-500/10 rounded-lg">
                  <Activity className="text-slb-blue-500 h-5 w-5" />
                </div>
                Health Check Checklist
              </h2>

              {diagLoading && !diagData ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-12 w-12 animate-spin text-slb-blue-500 mb-4" />
                  <p className="text-sm text-text-muted font-medium animate-pulse">Running diagnostic checks...</p>
                </div>
              ) : diagData ? (
                <div className="space-y-6">
                  {/* Item 1: Env File */}
                  <div className="flex items-start gap-5 p-5 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors duration-200">
                    <div className={`p-2 rounded-full ${diagData.env_exists ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      <ShieldCheck className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-text-primary">
                          Environment Configuration
                        </h3>
                        <Badge variant={diagData.env_exists ? "success" : "error"}>
                          {diagData.env_exists ? "Active" : "Missing"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {diagData.env_exists
                          ? "Your backend environment file (.env) is present and ready to initialize configuration tokens."
                          : "Your .env configuration file is missing from the backend folder. API requests will fail."}
                      </p>
                    </div>
                  </div>

                  {/* Item 2: DB Connection */}
                  <div className="flex items-start gap-5 p-5 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors duration-200">
                    <div className={`p-2 rounded-full ${diagData.db_connected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      <Database className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-text-primary">
                          Database Connectivity
                        </h3>
                        <Badge variant={diagData.db_connected ? "success" : "error"}>
                          {diagData.db_connected ? "Connected" : "Offline"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {diagData.db_connected
                          ? "SQLite database connected successfully. Models can write audit outcomes and retrieve historical project snapshots."
                          : `Database connection failed. Detail: ${diagData.db_error}`}
                      </p>
                    </div>
                  </div>

                  {/* Item 3: API Keys */}
                  <div className="flex items-start gap-5 p-5 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors duration-200">
                    <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                      <Key className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-text-primary mb-2">API Key Configurations</h3>
                      <p className="text-sm text-text-secondary mb-4">
                        Diagnostics check on configured tokens to power the AI Agents.
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(diagData.keys || {}).map(([key, active]) => (
                          <div key={key} className="flex items-center gap-3 p-3 bg-surface-primary rounded-lg border border-border-light shadow-sm transition-all hover:shadow-md">
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                            <span className="text-xs font-mono font-medium truncate text-text-primary" title={key}>{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Item 4: Network Connectivity */}
                  <div className="flex items-start gap-5 p-5 rounded-xl border border-border-light bg-surface-secondary/50 hover:bg-surface-secondary transition-colors duration-200">
                    <div className={`p-2 rounded-full ${diagData.internet_connected ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      <Wifi className="h-6 w-6 shrink-0" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-bold text-text-primary">
                          Network Connectivity
                        </h3>
                        <Badge variant={diagData.internet_connected ? "success" : "error"}>
                          {diagData.internet_connected ? "Active" : "None"}
                        </Badge>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {diagData.internet_connected
                          ? "Internet network is online. The orchestrator can crawl remote URLs and hit external AI backends."
                          : "Internet check failed. Please check host routing rules and server DNS parameters."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-surface-secondary/30 rounded-xl border border-dashed border-border-medium">
                  <p className="text-sm text-text-muted">No diagnostic data gathered. Run check above.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right side: config editing form */}
          <div className="lg:col-span-1 space-y-6">
            <Card variant="elevated" className="p-6 md:p-8 bg-surface-primary h-full">
              <h2 className="text-xl font-bold font-display mb-8 flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Key className="text-yellow-500 h-5 w-5" />
                </div>
                Configure Keys
              </h2>

              <form onSubmit={handleConfigSubmit} className="space-y-6">
                <Select
                  label="Select Provider"
                  value={apiKeyName}
                  onChange={(e) => setApiKeyName(e.target.value)}
                  options={[
                    { value: "GEMINI_API_KEY", label: "Gemini AI" },
                    { value: "OPENROUTER_API_KEY", label: "OpenRouter" },
                    { value: "SERPAPI_API_KEY", label: "SerpAPI" },
                  ]}
                  helperText="Choose the API key you want to update."
                />

                <div className="space-y-2">
                  <Input
                    label="New API Key Value"
                    type={showKey ? "text" : "password"}
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    placeholder="Enter new key value"
                    required
                    endIcon={showKey ? EyeOff : Eye}
                    onEndIconClick={() => setShowKey(!showKey)}
                    helperText="Updating keys will modify the .env file."
                  />
                </div>

                {configSuccess && (
                  <Alert variant="success" className="py-2 px-3">
                    {configSuccess}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={configLoading}
                  disabled={!apiKeyValue.trim()}
                >
                  Update Configuration
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border-light flex gap-3">
                <Info className="h-5 w-5 text-text-muted shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Updating key configuration modifies the backend <code className="bg-surface-secondary px-1 py-0.5 rounded text-[10px] font-mono">.env</code> file directly. New settings apply on subsequent agent orchestrations immediately.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
