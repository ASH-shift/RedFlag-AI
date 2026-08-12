"use client";

import { useState } from "react";
import JobForm from "@/components/JobForm";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";
import type { AnalysisResult } from "@/types";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Analysis failed. Please try again.");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  if (loading) return <LoadingState />;

  if (result) return <ResultCard result={result} onReset={reset} />;

  return <JobForm onAnalyze={analyze} loading={loading} error={error} />;
}
