"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading job description...",
  "Detecting culture signals...",
  "Identifying red flags...",
  "Generating negotiation tips...",
  "Finalizing report...",
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-red-500/10" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin" />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-red-400/50 animate-spin"
          style={{ animationDuration: "0.8s", animationDirection: "reverse" }}
        />
      </div>
      <div className="text-center space-y-2">
        <p className="text-slate-300 text-sm font-medium animate-pulse">{STEPS[step]}</p>
        <div className="flex gap-1.5 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i <= step ? 20 : 6,
                background: i <= step ? "#ef4444" : "#ffffff15",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
