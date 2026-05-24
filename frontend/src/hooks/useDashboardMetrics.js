import { useEffect, useState } from "react";
import { loadDashboardData } from "../utils/auditStorage";

export function useDashboardMetrics() {
  const [data, setData] = useState(loadDashboardData);

  useEffect(() => {
    const refresh = () => setData(loadDashboardData());
    window.addEventListener("seo-dashboard-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("seo-dashboard-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return data;
}
