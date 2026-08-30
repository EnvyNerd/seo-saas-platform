import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import SEOAudit from "../pages/SEOAudit";
import AuditDetails from "../pages/AuditDetails";
import AEOGEO from "../pages/AEOGEO";
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
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/app/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route index element={
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  } />
                  <Route path="strategy" element={
                    <PageTransition>
                      <Strategy />
                    </PageTransition>
                  } />
                  <Route path="seo-audit" element={
                    <PageTransition>
                      <SEOAudit />
                    </PageTransition>
                  } />
                  <Route path="audit-details" element={
                    <PageTransition>
                      <AuditDetails />
                    </PageTransition>
                  } />
                  <Route path="aeo-geo" element={
                    <PageTransition>
                      <AEOGEO />
                    </PageTransition>
                  } />
                  <Route path="keywords" element={
                    <PageTransition>
                      <KeywordGenerator />
                    </PageTransition>
                  } />
                  <Route path="content" element={
                    <PageTransition>
                      <ContentGenerator />
                    </PageTransition>
                  } />
                  <Route path="competitors" element={
                    <PageTransition>
                      <Competitors />
                    </PageTransition>
                  } />
                  <Route path="chat" element={
                    <PageTransition>
                      <ChatAssistant />
                    </PageTransition>
                  } />
                  <Route path="settings" element={
                    <PageTransition>
                      <Settings />
                    </PageTransition>
                  } />
                  <Route path="analytics" element={
                    <PageTransition>
                      <RealtimeAnalytics />
                    </PageTransition>
                  } />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}

export default AppRouter;
