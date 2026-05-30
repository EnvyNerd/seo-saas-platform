import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";
import PageTransition from "../components/PageTransition";
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
              <MainLayout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Dashboard />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/strategy"
                    element={
                      <PageTransition>
                        <Strategy />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/seo-audit"
                    element={
                      <PageTransition>
                        <SEOAudit />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/keywords"
                    element={
                      <PageTransition>
                        <KeywordGenerator />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/content"
                    element={
                      <PageTransition>
                        <ContentGenerator />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/competitors"
                    element={
                      <PageTransition>
                        <Competitors />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <PageTransition>
                        <ChatAssistant />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PageTransition>
                        <Settings />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={
                      <PageTransition>
                        <RealtimeAnalytics />
                      </PageTransition>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
