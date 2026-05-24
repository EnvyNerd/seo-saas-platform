import React, { useEffect, useState, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  LineChart,
  Target,
  Dumbbell,
  Link2,
} from "lucide-react";

function useAnimatedNumber(target, duration = 1400) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);
  const displayRef = useRef(0);

  useEffect(() => {
    fromRef.current = displayRef.current;
    startRef.current = null;
    let frame;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const next = Math.round(fromRef.current + (target - fromRef.current) * eased);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return display;
}

const KPI_CONFIG = [
  {
    title: "Organic traffic",
    valueNum: 24500,
    change: "+12.5%",
    positive: true,
    icon: LineChart,
    accent: "from-cyan-500/80 to-blue-500/80",
  },
  {
    title: "Keyword rankings",
    valueNum: 1847,
    change: "+8.2%",
    positive: true,
    icon: Target,
    accent: "from-violet-500/80 to-fuchsia-500/70",
  },
  {
    title: "Page authority",
    valueNum: 52,
    change: "-2.1%",
    positive: false,
    icon: Dumbbell,
    accent: "from-amber-500/80 to-orange-600/80",
  },
  {
    title: "Backlinks",
    valueNum: 324,
    change: "+15.3%",
    positive: true,
    icon: Link2,
    accent: "from-emerald-500/80 to-teal-500/80",
  },
];

function KPICard({ kpi, idx }) {
  const animated = useAnimatedNumber(kpi.valueNum);
  const Icon = kpi.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/40 shadow-lg shadow-black/20 animate-fadeInUp backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/35 hover:shadow-neon"
      style={{ animationDelay: `${idx * 90}ms` }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px kpi-border-glow opacity-70" />
      <div
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${kpi.accent} opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.14]`}
      />

      <div className="relative z-10 p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-800/80 shadow-inner ring-1 ring-white/5">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
          <div
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
              kpi.positive
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                : "border-rose-500/25 bg-rose-500/10 text-rose-400"
            }`}
          >
            {kpi.positive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {kpi.change}
          </div>
        </div>

        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500">{kpi.title}</p>
        <p className="font-display text-3xl font-bold tracking-tight text-white tabular-nums">
          {animated.toLocaleString()}
        </p>
        <p className="mt-3 text-[11px] text-slate-500">vs last 30 days · modeled from crawl + GSC</p>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.04]" />
    </div>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {KPI_CONFIG.map((kpi, idx) => (
        <KPICard key={kpi.title} kpi={kpi} idx={idx} />
      ))}
    </div>
  );
}
