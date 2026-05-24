const STORAGE_KEY = "seo-dashboard-data";

const DEFAULT = {
  metrics: {
    seo_score: 78,
    total_links: 142,
    missing_alt_images: 3,
    h1_count: 2,
    url: null,
  },
  trend: [
    { day: "mon", score: 62 },
    { day: "tue", score: 68 },
    { day: "wed", score: 71 },
    { day: "thu", score: 75 },
    { day: "fri", score: 78 },
    { day: "sat", score: 82 },
    { day: "sun", score: 85 },
  ],
};

export function loadDashboardData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        metrics: { ...DEFAULT.metrics, ...parsed.metrics },
        trend: parsed.trend ?? DEFAULT.trend,
      };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

export function saveAuditResult(result) {
  if (!result || result.error) return;

  const existing = loadDashboardData();
  const h1_count = result.h1_tags?.length ?? 0;
  const days = DEFAULT.trend.map((p) => p.day);
  const scores = [
    ...existing.trend.map((p) => p.score).slice(1),
    result.seo_score,
  ];
  const trend = days.map((day, i) => ({ day, score: scores[i] }));

  const data = {
    metrics: {
      seo_score: result.seo_score,
      total_links: result.total_links,
      missing_alt_images: result.missing_alt_images,
      h1_count,
      url: result.url,
    },
    trend,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("seo-dashboard-updated"));
  return data;
}
