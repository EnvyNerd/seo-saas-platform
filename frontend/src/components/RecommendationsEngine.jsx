import React from "react";
import {
  Lightbulb,
  ChevronRight,
  Zap,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Cpu,
} from "lucide-react";

export default function RecommendationsEngine() {
  const recommendations = [
    {
      id: 1,
      title: "Add internal links",
      description: "Fifteen commercial URLs lack crawl depth — bridge them to money pages.",
      priority: "high",
      impact: "+8% modeled traffic",
      confidence: 94,
      icon: Zap,
    },
    {
      id: 2,
      title: "Optimize meta descriptions",
      description: "Two hundred thirty-five URLs repeat or omit SERP snippets.",
      priority: "medium",
      impact: "+5% CTR ceiling",
      confidence: 81,
      icon: AlertCircle,
    },
    {
      id: 3,
      title: "Mobile speed budget",
      description: "P75 LCP sits at 3.2s — compress hero media and defer third parties.",
      priority: "high",
      impact: "+12% mobile sessions",
      confidence: 88,
      icon: Zap,
    },
    {
      id: 4,
      title: "Schema coverage",
      description: "Article + FAQ schema missing on templates that already qualify.",
      priority: "low",
      impact: "+3% SERP real estate",
      confidence: 72,
      icon: CheckCircle,
    },
  ];

  const priorityStyle = (priority) => {
    if (priority === "high")
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    if (priority === "medium")
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    return "border-slate-500/40 bg-slate-500/10 text-slate-300";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/45 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/35 hover:shadow-neon">
      <div className="pointer-events-none absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10">
              <Lightbulb className="h-5 w-5 text-cyan-400" />
              <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-cyan-200/90 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">AI recommendations</h2>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Cpu className="h-3 w-3 text-cyan-500/80" />
                Ensemble scoring on your crawl snapshot
              </p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
            {recommendations.length} prioritized
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.id}
              className="group rounded-xl border border-slate-700/70 bg-slate-950/40 p-4 transition-all duration-300 animate-slideInLeft hover:border-cyan-500/25 hover:bg-slate-800/40 hover:shadow-lg hover:shadow-cyan-500/5"
              style={{ animationDelay: `${idx * 45}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 ring-1 ring-inset ring-white/[0.04]">
                  <rec.icon className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{rec.title}</h3>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyle(
                        rec.priority
                      )}`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{rec.description}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="font-medium text-emerald-400/90">{rec.impact}</span>
                      <span className="rounded border border-slate-700/80 bg-slate-900/80 px-1.5 py-0.5 tabular-nums text-slate-400">
                        {rec.confidence}% confidence
                      </span>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs font-semibold text-cyan-400 transition-all duration-200 hover:text-cyan-300 group-hover:translate-x-0.5"
                    >
                      View briefing
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl border border-cyan-500/25 py-2.5 text-sm font-semibold text-cyan-300 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/5"
        >
          Open recommendation queue
        </button>
      </div>
    </div>
  );
}
