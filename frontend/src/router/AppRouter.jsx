import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/DashboardNew";
import SEOAudit from "../pages/SEOAudit";
import KeywordGenerator from "../pages/KeywordGenerator";
import ContentGenerator from "../pages/ContentGenerator";
import Strategy from "../pages/Strategy";
import Competitors from "../pages/Competitors";
import ChatAssistant from "../pages/ChatAssistant";
import Settings from "../pages/Settings";
import RealtimeAnalytics from "../components/RealtimeAnalytics";
import Login from "../pages/Login";
import Register from "../pages/Register";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return null;
  if (!token) return <Navigate to="/login" />;
  
  return children;
};

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <div className="flex h-screen bg-slate-950">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/strategy" element={<Strategy />} />
                    <Route path="/seo-audit" element={<SEOAudit />} />
                    <Route path="/keywords" element={<KeywordGenerator />} />
                    <Route path="/content" element={<ContentGenerator />} />
                    <Route path="/competitors" element={<Competitors />} />
                    <Route path="/chat" element={<ChatAssistant />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/analytics" element={<RealtimeAnalytics />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default AppRouter;
