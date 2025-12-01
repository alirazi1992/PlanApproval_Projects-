import { useEffect } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { ProjectListPanel } from "../components/dashboard/ProjectListPanel";
import { DocumentReviewPanel } from "../components/dashboard/DocumentReviewPanel";
import { FinanceSummaryPanel } from "../components/dashboard/FinanceSummaryPanel";
import { KpiPanel } from "../components/dashboard/KpiPanel";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { canViewWidget } from "../lib/rbac";
import { useAuditTrail } from "../hooks/useAuditTrail";

export function ExecutiveDashboard() {
  const { filters, updateFilters } = useDashboardFilters();
  const currentUser = useCurrentUser();
  const { logFilters } = useAuditTrail();

  useEffect(() => {
    logFilters(filters);
  }, [filters, logFilters]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-4" dir="rtl">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">داشبورد مدیریتی</p>
          <h1 className="text-2xl font-bold">مرور سازمانی</h1>
          <p className="text-sm text-gray-600">نمای واحد، دپارتمان و تجمیع سازمانی برای نقش‌های مدیر</p>
        </div>
        <DashboardFilterBar filters={filters} onChange={updateFilters} />

        <div className="grid gap-4 lg:grid-cols-2">
          {currentUser && canViewWidget(currentUser.role, "projects") && <ProjectListPanel filters={filters} />}
          {currentUser && canViewWidget(currentUser.role, "documents") && <DocumentReviewPanel filters={filters} />}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {currentUser && canViewWidget(currentUser.role, "finance") && (
            <div className="lg:col-span-2">
              <FinanceSummaryPanel filters={filters} />
            </div>
          )}
          {currentUser && canViewWidget(currentUser.role, "kpi") && <KpiPanel filters={filters} />}
        </div>

        {currentUser && canViewWidget(currentUser.role, "alerts") && <AlertsPanel filters={filters} />}
      </div>
    </AppShell>
  );
}
