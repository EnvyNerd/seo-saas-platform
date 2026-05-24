import React, { useState, useEffect, useRef } from "react";
import { Radio, Users, MousePointerClick, Clock } from "lucide-react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function MiniSparkline({ values, strokeClass }) {
  if (!values.length) return null;
  const w = 120;
  const h = 36;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1 || 1)) * (w - pad * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad + (1 - t) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} className="mt-2 opacity-90" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
        points={pts.join(" ")}
      />
    </svg>
  );
}

function flashDirection(key, prev, next) {
  if (key === "bounce_rate") {
    if (next < prev - 0.04) return "up";
    if (next > prev + 0.04) return "down";
    return null;
  }
  if (next > prev) return "up";
  if (next < prev) return "down";
  return null;
}

export default function RealtimeAnalytics() {
  const [stats, setStats] = useState({
    active_users: 3245,
    page_views: 12456,
    sessions: 4821,
    bounce_rate: 32.5,
  });

  const historyRef = useRef({
    active_users: [3180, 3200, 3220, 3245],
    page_views: [11800, 12000, 12200, 12456],
    sessions: [4650, 4700, 4780, 4821],
    bounce_rate: [33.5, 33.2, 32.8, 32.5],
  });

  const [flash, setFlash] = useState({});
  const prevStatsRef = useRef(null);
  const skipFlashRef = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        active_users: clamp(prev.active_users + Math.floor(Math.random() * 50 - 25), 2800, 4200),
        page_views: clamp(prev.page_views + Math.floor(Math.random() * 200 - 100), 10000, 16000),
        sessions: clamp(prev.sessions + Math.floor(Math.random() * 100 - 50), 4000, 6200),
        bounce_rate: clamp(prev.bounce_rate + (Math.random() - 0.5) * 2, 20, 50),
      }));
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const keys = ["active_users", "page_views", "sessions", "bounce_rate"];
    keys.forEach((k) => {
      historyRef.current[k].push(stats[k]);
      historyRef.current[k] = historyRef.current[k].slice(-14);
    });

    if (skipFlashRef.current) {
      skipFlashRef.current = false;
      prevStatsRef.current = { ...stats };
      return;
    }

    const prev = prevStatsRef.current;
    if (!prev) {
      prevStatsRef.current = { ...stats };
      return;
    }

    const f = {};
    keys.forEach((k) => {
      const dir = flashDirection(k, prev[k], stats[k]);
      if (dir) f[k] = dir;
    });
    prevStatsRef.current = { ...stats };

    if (Object.keys(f).length) {
      setFlash(f);
      const t = setTimeout(() => setFlash({}), 650);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [stats]);

  const analyticsCards = [
    {
      key: "active_users",
      label: "Active users",
      value: stats.active_users.toLocaleString(),
      change: "+5.2%",
      icon: Users,
      color: "from-cyan-500 to-blue-500",
      sparkStroke: "stroke-cyan-400/70",
    },
    {
      key: "page_views",
      label: "Page views",
      value: stats.page_views.toLocaleString(),
      change: "+8.1%",
      icon: MousePointerClick,
      color: "from-purple-500 to-pink-500",
      sparkStroke: "stroke-fuchsia-400/70",
    },
    {
      key: "sessions",
      label: "Sessions",
      value: stats.sessions.toLocaleString(),
      change: "+3.4%",
      icon: Radio,
      color: "from-emerald-500 to-green-500",
      sparkStroke: "stroke-emerald-400/70",
    },
    {
      key: "bounce_rate",
      label: "Bounce rate",
      value: `${stats.bounce_rate.toFixed(1)}%`,
      change: "-2.1%",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      sparkStroke: "stroke-orange-400/70",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/45 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.1)]">
      <div className="pointer-events-none absolute left-0 top-0 h-40 w-40 -translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/35 bg-emerald-500/10">
                <Radio className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </span>
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Real-time analytics</h2>
              <p className="text-[11px] text-slate-500">Streaming panel · 2.8s refresh cadence</p>
            </div>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live ingest
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {analyticsCards.map((card, idx) => {
            const IconComponent = card.icon;
            const dir = flash[card.key];
            const flashClass = dir === "up" ? "flash-up" : dir === "down" ? "flash-down" : "";

            return (
              <div
                key={card.key}
                className="group relative overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 transition-all duration-300 animate-fadeInUp hover:border-slate-600 hover:shadow-lg"
                style={{ animationDelay: `${idx * 70}ms` }}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]`}
                />
                <div className="relative z-10">
                  <div className="mb-1 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {card.label}
                    </span>
                    <IconComponent className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-slate-400" />
                  </div>
                  <p className={`font-display text-xl font-bold tabular-nums text-white transition-colors ${flashClass}`}>
                    {card.value}
                  </p>
                  <p
                    className={`text-[10px] font-bold tabular-nums bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
                  >
                    {card.change} benchmark
                  </p>
                  <MiniSparkline values={historyRef.current[card.key]} strokeClass={card.sparkStroke} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-6">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Signal feed</h3>
          <div className="space-y-2">
            {[
              "New visitor cohort from United States east",
              "URL /blog/seo-tips claimed position 1 for head term",
              "Three fresh backlinks matched to DR 45+ domains",
              "Mobile share of traffic up 12% vs prior hour",
            ].map((activity, idx) => (
              <div
                key={activity}
                className="flex items-center gap-3 rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs text-slate-300 transition-colors animate-slideInLeft hover:border-slate-700"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="leading-snug">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
