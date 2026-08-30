import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Dashboard from "../pages/DashboardNew";
import SEOAudit from "../pages/SEOAudit";
import KeywordGenerator from "../pages/KeywordGenerator";
import ContentGenerator from "../pages/ContentGenerator";
import RealtimeAnalytics from "../components/RealtimeAnalytics";

function AppRouter() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/seo-audit" element={<SEOAudit />} />
          <Route path="/keywords" element={<KeywordGenerator />} />
          <Route path="/content" element={<ContentGenerator />} />
          <Route path="/analytics" element={<RealtimeAnalytics />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default AppRouter;