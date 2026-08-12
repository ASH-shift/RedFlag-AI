"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  verdict: "Safe" | "Caution" | "Danger";
}

export default function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = animated ? circumference - (score / 100) * circumference : circumference;

  const color =
    verdict === "Safe" ? "#22c55e" : verdict === "Caution" ? "#eab308" : "#ef4444";

  const label =
    verdict === "Safe"
      ? "Healthy Workplace"
      : verdict === "Caution"
      ? "Proceed Carefully"
      : "High Risk";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 176, height: 176 }}>
        <svg width="176" height="176" className="-rotate-90">
          <circle cx="88" cy="88" r={radius} fill="none" stroke="#ffffff08" strokeWidth="10" />
          <circle
            cx="88"
            cy="88"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold tabular-nums" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-slate-500 mt-0.5">/ 100</span>
        </div>
      </div>
      <span className="text-sm font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
