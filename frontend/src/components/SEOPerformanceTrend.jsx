import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-600/80 bg-slate-900/95 px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 capitalize">{label}</p>
      <p className="text-sm font-semibold text-cyan-300">{payload[0].value} / 100</p>
    </div>
  );
}

export default function SEOPerformanceTrend({ trend }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-cyan-400" />
        <h2 className="font-display text-lg font-semibold text-white">
          SEO performance Trend
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#22d3ee"
            strokeWidth={2.5}
            dot={{ fill: "#22d3ee", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#3b82f6" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
