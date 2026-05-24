import { useState } from "react";
import api from "../api/axios";
import { saveAuditResult } from "../utils/auditStorage";

export function useAudit() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiResult, setAiResult] = useState("");

  const analyzeSEO = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        `/seo/audit?url=${encodeURIComponent(url)}`
      );
      setResult(response.data);
      setAiResult("");
      if (!response.data?.error) {
        saveAuditResult(response.data);
      }
    } catch (err) {
      setError("Backend connection failed");
      console.error(err);
    }
    setLoading(false);
  };

  const generateAIRecommendations = async () => {
    if (!result) return;
    setError("");

    try {
      const response = await api.post(
        "/ai/recommendations",
        { data: result }
      );
      setAiResult(response.data.recommendations);
    } catch (err) {
      setError("AI recommendation generation failed");
      console.error(err);
    }
  };

  return {
    url,
    setUrl,
    result,
    setResult,
    loading,
    error,
    setError,
    aiResult,
    setAiResult,
    analyzeSEO,
    generateAIRecommendations,
  };
}
