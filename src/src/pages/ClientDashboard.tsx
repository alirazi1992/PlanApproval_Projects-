import { useEffect } from "react";
import { AppShell } from "../components/layout/AppShell";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { ProjectListPanel } from "../components/dashboard/ProjectListPanel";
import { DocumentReviewPanel } from "../components/dashboard/DocumentReviewPanel";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import { FinanceSummaryPanel } from "../components/dashboard/FinanceSummaryPanel";
import { KpiPanel } from "../components/dashboard/KpiPanel";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAuditTrail } from "../hooks/useAuditTrail";

export function ClientDashboard() {
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
          <p className="text-xs text-gray-500">داشبورد مشتری</p>
          <h1 className="text-2xl font-bold">پروژه‌های شما</h1>
          <p className="text-sm text-gray-600">فقط اطلاعات پروژه‌های متعلق به همین مشتری نمایش داده می‌شود.</p>
        </div>
        <DashboardFilterBar filters={filters} onChange={updateFilters} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ProjectListPanel filters={filters} />
          <DocumentReviewPanel filters={filters} />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <AlertsPanel filters={filters} />
          <div className="lg:col-span-2 grid gap-4">
            <FinanceSummaryPanel filters={filters} />
            <KpiPanel filters={filters} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
