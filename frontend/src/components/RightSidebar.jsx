import React from 'react';
import HealthGauge from "./HealthGauge";
import DashboardMetrics from "./DashboardMetrics";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";

export default function RightSidebar() {
  const { metrics } = useDashboardMetrics();

  return (
    <aside className="hidden lg:block lg:col-span-1">
      <div className="sticky top-[78px]">
        <div className="dashboard-right-panel">
          <div className="panel-title">SEO Audit Engine</div>
          <div className="panel-subtitle">Deep Playwright-powered analysis for on-page optimization, accessibility, and structural integrity.</div>

          <div style={{height: 18}} />

          <div className="panel-actions">
            <div className="panel-chip">Single Page</div>
            <div className="panel-chip">Batch Bulk</div>
          </div>

          <div style={{height: 20}} />

          <div className="text-xs text-white/80">Quick Insights</div>
          <div className="mt-3">
            <DashboardMetrics metrics={metrics} />
          </div>
        </div>
      </div>
    </aside>
  );
}
