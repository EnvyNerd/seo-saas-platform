import { Gauge, Link2, ImageOff, Heading1 } from "lucide-react";

function MetricCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-5 shadow-lg shadow-black/20 backdrop-blur-sm transition-all hover:border-cyan-500/30">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={`rounded-lg border p-2 ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-display text-3xl font-bold tabular-nums text-white">{value}</p>
    </div>
  );
}

export default function DashboardMetrics({ metrics }) {
  const cards = [
    {
      label: "SEO score",
      value: metrics.seo_score,
      icon: Gauge,
      accent: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Total links",
      value: metrics.total_links,
      icon: Link2,
      accent: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    },
    {
      label: "Missing ALT",
      value: metrics.missing_alt_images,
      icon: ImageOff,
      accent: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    },
    {
      label: "H1 tags",
      value: metrics.h1_count,
      icon: Heading1,
      accent: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}
