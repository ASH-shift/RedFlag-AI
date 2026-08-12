"use client";

import { useState } from "react";

interface JobFormProps {
  onAnalyze: (text: string) => void;
  loading: boolean;
  error: string | null;
}

const EXAMPLE_JD = `Software Engineer - Series A Startup

We're looking for a rockstar full-stack engineer to join our family! We move fast and break things — if you're not comfortable wearing many hats and thriving in chaos, this isn't for you.

About You:
• You're passionate about what you do (we all are!)
• You have thick skin and love getting feedback
• You're a self-starter who doesn't need hand-holding
• Startup mentality is a MUST

Requirements:
• 5+ years React, 5+ years Node.js, 5+ years Python, 3+ years Go (for a "mid-level" role)
• Must also know: Kubernetes, Docker, AWS, GCP, Kafka, Redis, PostgreSQL
• Experience with machine learning is a plus
• Available on Slack at all times during work hours (and sometimes after)

What We Offer:
• Competitive salary (we don't share numbers until offer stage)
• Equity (amount TBD)
• Unlimited PTO (though our culture means people rarely take it)
• Work hard, play hard environment

We're disrupting a $10B market and need people who are hungry to change the world. If you're looking for a 9-5, please look elsewhere.`;

export default function JobForm({ onAnalyze, loading, error }: JobFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim().length >= 50) onAnalyze(text.trim());
  };

  const isReady = text.trim().length >= 50;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center font-bold text-white text-xs tracking-tight">
            RF
          </div>
          <span className="font-semibold text-white text-sm">RedFlag AI</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14">
        <div className="w-full max-w-3xl space-y-10">
          {/* Headline */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Know before you{" "}
              <span className="text-red-400">join</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
              Paste any job description. AI scans for toxic culture signals,
              red flags, and gives you negotiation ammunition — in seconds.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: "🚩", title: "Red Flags", desc: "Toxic signals detected" },
              { icon: "✅", title: "Green Flags", desc: "Positive signs found" },
              { icon: "💰", title: "Negotiate", desc: "Leverage every gap" },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="text-2xl mb-1.5">{item.icon}</div>
                <div className="text-xs font-semibold text-slate-300">{item.title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/10 resize-none transition-all text-sm leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                {text.length > 0 && (
                  <span className="text-xs text-slate-600 tabular-nums">{text.length} chars</span>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setText(EXAMPLE_JD)}
                className="px-5 py-3.5 rounded-xl border border-white/10 text-slate-400 text-sm hover:bg-white/5 hover:text-slate-300 transition-all shrink-0"
              >
                Try example
              </button>
              <button
                type="submit"
                disabled={loading || !isReady}
                className="flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all bg-red-500 hover:bg-red-600 disabled:bg-white/5 disabled:text-slate-600 disabled:cursor-not-allowed text-white"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Job Description →"
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-700">
            Your data is never stored · Built by <span className="text-slate-500">Arpit Sharma</span>
          </p>
        </div>
      </div>
    </div>
  );
}
