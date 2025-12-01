import { useEffect, useState } from "react";
import { DashboardFilters, AlertItem } from "../../types";
import { Card } from "../ui/Card";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getAlerts, logAuditTrail } from "../../services/apiClient";

interface Props {
  filters: DashboardFilters;
}

const severityColor: Record<AlertItem["severity"], string> = {
  Critical: "bg-red-50 text-red-700 border-red-100",
  Major: "bg-amber-50 text-amber-700 border-amber-100",
  Minor: "bg-slate-50 text-slate-700 border-slate-200",
};

export function AlertsPanel({ filters }: Props) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getAlerts(currentUser.scopes).then((data) => {
      setAlerts(data);
      setLoading(false);
      logAuditTrail("dashboard:view-alerts", { scope: currentUser.scopes, filters });
    });
  }, [filters, currentUser]);

  return (
    <Card className="p-4 space-y-3" aria-label="هشدارها">
      <div>
        <p className="text-xs text-gray-500">اطلاعیه‌ها و هشدارها</p>
        <h3 className="text-lg font-semibold">آلارم‌های بحرانی</h3>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border ${severityColor[alert.severity]} flex flex-col gap-1`}
            >
              <div className="flex items-center justify-between flex-row">
                <p className="font-semibold">{alert.title}</p>
                <span className="text-xs">{alert.projectCode}</span>
              </div>
              <div className="text-xs text-gray-700 flex flex-wrap gap-2 flex-row">
                <span>مسئول: {alert.roleOwner}</span>
                <span>وضعیت: {alert.status}</span>
                <span>{new Date(alert.timestamp).toLocaleString("fa-IR")}</span>
              </div>
              <p className="text-sm text-gray-800">اقدام: {alert.suggestedAction}</p>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-sm text-gray-500">هشداری در این محدوده وجود ندارد.</div>
          )}
        </div>
      )}
    </Card>
  );
}
