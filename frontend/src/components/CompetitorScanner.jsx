import React from "react";
import { Target, TrendingUp, TrendingDown, Award, Radar } from "lucide-react";

export default function CompetitorScanner() {
  const competitors = [
    {
      id: 1,
      name: "Competitor A",
      domain: "competitor-a.com",
      keywords: 1243,
      traffic: "245K",
      authority: 62,
      gap: 12,
      advantage: "You rank higher on 145 tracked keywords.",
      trending: "up",
    },
    {
      id: 2,
      name: "Competitor B",
      domain: "competitor-b.com",
      keywords: 2145,
      traffic: "512K",
      authority: 72,
      gap: -8,
      advantage: "They lead on 324 keywords in your cluster.",
      trending: "down",
    },
    {
      id: 3,
      name: "Competitor C",
      domain: "competitor-c.com",
      keywords: 856,
      traffic: "156K",
      authority: 55,
      gap: 22,
      advantage: "You win share of voice on long-tail informational.",
      trending: "up",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/45 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-violet-500/35 hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-violet-400/80 to-transparent scan-line" />
      </div>
      <div className="pointer-events-none absolute right-0 top-1/4 h-52 w-52 translate-x-1/3 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/35 bg-violet-500/10">
              <Target className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Competitor scanner</h2>
              <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Radar className="h-3 w-3 text-violet-400/90" />
                Last full scan · <span className="tabular-nums text-slate-400">12 min ago</span>
              </p>
            </div>
          </div>
          <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-200">
            SERP overlap
          </span>
        </div>

        <div className="space-y-3">
          {competitors.map((comp, idx) => (
            <div
              key={comp.id}
              className="group rounded-xl border border-slate-700/70 bg-slate-950/40 p-4 transition-all duration-300 animate-slideInRight hover:border-violet-500/25 hover:bg-slate-800/40"
              style={{ animationDelay: `${idx * 45}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white">{comp.name}</h3>
                  <p className="truncate text-xs text-slate-500">{comp.domain}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-200">
                  <Award className="h-3 w-3" />
                  DA {comp.authority}
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Keywords</p>
                  <p className="text-lg font-bold tabular-nums text-cyan-400">{comp.keywords.toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Est. traffic</p>
                  <p className="text-lg font-bold tabular-nums text-emerald-400">{comp.traffic}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/50 px-2 py-1.5 text-xs text-slate-300">
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                      comp.gap >= 0
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-rose-500/15 text-rose-300"
                    }`}
                  >
                    {comp.gap >= 0 ? `+${comp.gap}` : comp.gap}
                  </span>
                  <span className="truncate">{comp.advantage}</span>
                </div>
                {comp.trending === "up" ? (
                  <TrendingUp className="h-4 w-4 shrink-0 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 shrink-0 text-rose-400" />
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 w-full rounded-xl border border-violet-500/30 py-2.5 text-sm font-semibold text-violet-200 transition-all hover:border-violet-400/50 hover:bg-violet-500/5"
        >
          Export competitor matrix
        </button>
      </div>
    </div>
  );
}
