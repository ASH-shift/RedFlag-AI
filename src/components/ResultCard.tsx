"use client";

import { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import type { AnalysisResult } from "@/types";

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const SEVERITY = {
  high: { label: "HIGH", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  medium: { label: "MED", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  low: { label: "LOW", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
};

const VERDICT = {
  Safe: { label: "Safe to Apply", emoji: "✅", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  Caution: { label: "Proceed with Caution", emoji: "⚠️", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  Danger: { label: "Danger Zone", emoji: "🚨", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const verdict = VERDICT[result.verdict];

  const copyReport = () => {
    const report = [
      `RedFlag AI Analysis`,
      `Score: ${result.score}/100 — ${result.verdict}`,
      ``,
      `Summary: ${result.summary}`,
      ``,
      `Red Flags (${result.redFlags.length}):`,
      ...result.redFlags.map((f) => `  [${f.severity.toUpperCase()}] ${f.category}: ${f.text}`),
      ``,
      `Green Flags (${result.greenFlags.length}):`,
      ...result.greenFlags.map((f) => `  ${f.category}: ${f.text}`),
      ``,
      `Negotiation Tips:`,
      ...result.negotiationTips.map((t, i) => `  ${i + 1}. ${t}`),
      ``,
      `Analyzed by redflag.ai`,
    ].join("\n");

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen">
      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center font-bold text-white text-xs">
              RF
            </div>
            <span className="font-semibold text-white text-sm">RedFlag AI</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyReport}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-xs hover:bg-white/5 transition-colors"
            >
              {copied ? "✓ Copied" : "Copy Report"}
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 text-xs hover:bg-white/5 transition-colors"
            >
              ← New Analysis
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-fade-in">
        {/* Score card */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={result.score} verdict={result.verdict} />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${verdict.bg} ${verdict.color}`}
              >
                <span>{verdict.emoji}</span>
                {verdict.label}
              </span>
              <p className="text-slate-300 leading-relaxed text-[15px]">{result.summary}</p>
              <div className="flex gap-6 justify-center md:justify-start">
                <span className="flex items-center gap-1.5 text-sm text-red-400">
                  <span>🚩</span>
                  <span className="font-semibold">{result.redFlags.length}</span>
                  <span className="text-slate-500">red flags</span>
                </span>
                <span className="flex items-center gap-1.5 text-sm text-green-400">
                  <span>✅</span>
                  <span className="font-semibold">{result.greenFlags.length}</span>
                  <span className="text-slate-500">green flags</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Red Flags */}
        {result.redFlags.length > 0 && (
          <section className="space-y-3 animate-slide-up">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>🚩</span> Red Flags
              <span className="ml-1 text-xs font-normal text-slate-500">({result.redFlags.length} detected)</span>
            </h2>
            <div className="space-y-2">
              {result.redFlags.map((flag, i) => {
                const s = SEVERITY[flag.severity];
                return (
                  <div
                    key={i}
                    className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition-colors"
                  >
                    <span
                      className={`self-start mt-0.5 shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border ${s.bg} ${s.color}`}
                    >
                      {s.label}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500 mb-1">{flag.category}</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{flag.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Green Flags */}
        {result.greenFlags.length > 0 && (
          <section className="space-y-3 animate-slide-up">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>✅</span> Green Flags
              <span className="ml-1 text-xs font-normal text-slate-500">({result.greenFlags.length} found)</span>
            </h2>
            <div className="space-y-2">
              {result.greenFlags.map((flag, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-green-500/[0.04] border border-green-500/10 rounded-xl p-4"
                >
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 mb-1">{flag.category}</div>
                    <p className="text-slate-300 text-sm leading-relaxed">{flag.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Negotiation Tips */}
        {result.negotiationTips.length > 0 && (
          <section className="space-y-3 animate-slide-up">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>💰</span> Negotiation Tips
            </h2>
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
              {result.negotiationTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors"
                >
                  <span className="text-slate-600 text-sm font-mono shrink-0 mt-0.5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-center text-slate-700 text-xs pb-6">
          Built by <span className="text-slate-500">Arpit Sharma</span> · RedFlag AI
        </p>
      </div>
    </div>
  );
}
