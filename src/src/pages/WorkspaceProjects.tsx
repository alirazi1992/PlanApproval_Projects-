import { AppShell } from "../components/layout/AppShell";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { ProjectListPanel } from "../components/dashboard/ProjectListPanel";
import { useDashboardFilters } from "../hooks/useDashboardFilters";

export function WorkspaceProjects() {
  const { filters, updateFilters } = useDashboardFilters();

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-4" dir="rtl">
        <div className="space-y-1">
          <p className="text-xs text-gray-500">میز مرور پروژه‌ها</p>
          <h1 className="text-2xl font-bold">میز پروژه‌های فعال</h1>
          <p className="text-sm text-gray-600">این مسیر همیشه مقصد دکمه “بازگشت به مرور پروژه‌ها” است.</p>
        </div>
        <DashboardFilterBar filters={filters} onChange={updateFilters} />
        <ProjectListPanel filters={filters} />
      </div>
    </AppShell>
  );
}

export default WorkspaceProjects;
