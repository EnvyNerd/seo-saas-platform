import { useState } from "react";
import api from "../api/axios";

export function useContent() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("Blog Post");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateContent = async () => {
    if (!topic) return;
    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/content/generate",
        {
          topic: topic,
          content_type: contentType,
        }
      );
      setGenerated(response.data.content);
    } catch (err) {
      setError("Content generation failed");
      console.error(err);
    }
    setLoading(false);
  };

  return {
    topic,
    setTopic,
    contentType,
    setContentType,
    generated,
    setGenerated,
    loading,
    error,
    setError,
    generateContent,
  };
}
