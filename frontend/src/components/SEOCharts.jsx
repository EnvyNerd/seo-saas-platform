import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Legend,
} from "recharts";
import { TrendingUp, Layers } from "lucide-react";

const trafficData = [
  { month: "Jan", organic: 4000, paid: 2400 },
  { month: "Feb", organic: 5200, paid: 2800 },
  { month: "Mar", organic: 6100, paid: 3200 },
  { month: "Apr", organic: 7200, paid: 3800 },
  { month: "May", organic: 8500, paid: 4200 },
  { month: "Jun", organic: 9800, paid: 4800 },
];

const keywordData = [
  { position: "1-3", count: 45 },
  { position: "4-10", count: 128 },
  { position: "11-20", count: 235 },
  { position: "21-50", count: 412 },
  { position: "51+", count: 627 },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-600/80 bg-slate-900/95 px-3 py-2 shadow-xl shadow-black/40 backdrop-blur-md">
      {label != null && <p className="mb-1 text-xs font-medium text-slate-400">{label}</p>}
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold tabular-nums text-white">
          <span className="text-slate-500">{p.name}: </span>
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

function ChartShell({ title, icon: Icon, children }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/45 p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/35 hover:shadow-neon">
      <div className="pointer-events-none absolute -right-20 top-0 h-48 w-48 rounded-full bg-cyan-500/[0.06] blur-3xl" />
      <div className="relative z-10 mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-cyan-400" />
          <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        </div>
        <span className="rounded-md border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
          6 mo
        </span>
      </div>
      {children}
    </div>
  );
}

export default function SEOCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChartShell title="Traffic runway" icon={TrendingUp}>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trafficData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillOrganic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 4" }} />
            <Legend
              wrapperStyle={{ paddingTop: 16 }}
              formatter={(value) => <span className="text-slate-400 text-xs">{value}</span>}
            />
            <Area type="monotone" dataKey="organic" name="Organic" stroke="#06b6d4" strokeWidth={2} fill="url(#fillOrganic)" />
            <Area type="monotone" dataKey="paid" name="Paid" stroke="#3b82f6" strokeWidth={2} fill="url(#fillPaid)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title="SERP position spread" icon={Layers}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={keywordData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="18%">
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.6} vertical={false} />
            <XAxis dataKey="position" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(51, 65, 85, 0.25)" }} />
            <Bar dataKey="count" name="Keywords" fill="url(#barGrad)" radius={[10, 10, 0, 0]} maxBarSize={56} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>
    </div>
  );
}
