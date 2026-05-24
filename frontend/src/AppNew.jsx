import { BrowserRouter, Routes, Route } from "react-router-dom";
import SLBHeader from "./components/SLBHeader";
import Dashboard from "./pages/DashboardNew";
import SEOAudit from "./pages/SEOAuditNew";
import KeywordGenerator from "./pages/KeywordGeneratorNew";
import ContentGenerator from "./pages/ContentGeneratorNew";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[var(--bg-secondary)] text-[var(--text-primary)]">
        {/* SLB-Style Top Navigation */}
        <SLBHeader />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/seo-audit" element={<SEOAudit />} />
            <Route path="/keywords" element={<KeywordGenerator />} />
            <Route path="/content" element={<ContentGenerator />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
