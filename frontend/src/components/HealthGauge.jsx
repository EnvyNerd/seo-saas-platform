import React, { useEffect, useState, useRef } from "react";
import { Activity } from "lucide-react";

export default function HealthGauge({ score = 78, compact = false }) {
  const targetHealth = score;
  const [health, setHealth] = useState(0);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (health / 100) * circumference;

  useEffect(() => {
    const duration = 1600;
    let start;
    let frame;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      setHealth(Math.round(easeOut(t) * targetHealth));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [targetHealth]);

  const strokeId = useRef(`gaugeGrad-${Math.random().toString(36).slice(2)}`).current;

  const getLabel = () => {
    if (health >= 80) return "Excellent";
    if (health >= 60) return "Good";
    return "Needs work";
  };

  const subcopy =
    health >= 80
      ? "Strong technical base and content signals — keep shipping."
      : health >= 60
        ? "Solid foundation with a few high-impact fixes left on the table."
        : "Prioritize crawlability, speed, and on-page alignment to lift the score.";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/50 p-8 shadow-lg shadow-black/25 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-neon">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-white">
            <Activity className="h-5 w-5 text-cyan-400" />
            SEO health score
          </h2>
          {!compact && (
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Gauge
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="relative mb-6 h-44 w-44">
            <svg className="gauge-glow h-full w-full -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id={strokeId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={`url(#${strokeId})`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-[stroke-dashoffset] duration-700 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-4xl font-bold tabular-nums text-white">{health}</span>
              <span className="text-xs text-slate-500">/ 100</span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-cyan-400/90">
                {getLabel()}
              </span>
            </div>
          </div>

          {!compact && (
            <p className="max-w-xs text-center text-sm text-slate-400">{subcopy}</p>
          )}

          {!compact && (
          <div className="mt-8 grid w-full grid-cols-3 gap-3">
            {[
              { label: "Mobile", value: 92, tone: "text-cyan-400" },
              { label: "Performance", value: 85, tone: "text-blue-400" },
              { label: "Core Web Vitals", value: 78, tone: "text-violet-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-700/60 bg-slate-950/40 px-2 py-3 text-center ring-1 ring-inset ring-white/[0.03]"
              >
                <div className={`text-xl font-bold tabular-nums ${stat.tone}`}>{stat.value}</div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
