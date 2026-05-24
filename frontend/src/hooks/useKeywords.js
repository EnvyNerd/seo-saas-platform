import { useState } from "react";
import api from "../api/axios";

export function useKeywords() {
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateKeywords = async () => {
    if (!topic) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/keywords/generate",
        {
          topic: topic,
        }
      );
      setResults(response.data.keywords);
    } catch (err) {
      setError("Keyword generation failed");
      console.error(err);
    }
    setLoading(false);
  };

  return {
    topic,
    setTopic,
    results,
    setResults,
    loading,
    error,
    setError,
    generateKeywords,
  };
}
