import { useEffect, useState } from "react";
import { DashboardFilters, KPIValue } from "../../types";
import { Card } from "../ui/Card";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getKpis, logAuditTrail } from "../../services/apiClient";

interface Props {
  filters: DashboardFilters;
}

function getColor(kpi: KPIValue) {
  if (kpi.value <= kpi.threshold.green) return "text-emerald-700 bg-emerald-50";
  if (kpi.value <= kpi.threshold.yellow) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
}

export function KpiPanel({ filters }: Props) {
  const [values, setValues] = useState<KPIValue[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getKpis(currentUser.scopes).then((data) => {
      setValues(data);
      logAuditTrail("dashboard:view-kpi", { scope: currentUser.scopes, filters });
      setLoading(false);
    });
  }, [filters, currentUser]);

  return (
    <Card className="p-4 space-y-3" aria-label="KPI">
      <div className="flex items-center justify-between flex-row">
        <div>
          <p className="text-xs text-gray-500">شاخص‌های کلیدی</p>
          <h3 className="text-lg font-semibold">KPI Engine</h3>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {values.map((kpi) => (
            <div
              key={kpi.id}
              className={`p-3 rounded-xl border border-gray-100 ${getColor(kpi)} flex items-center justify-between flex-row`}
            >
              <div>
                <p className="text-sm font-semibold">{kpi.name}</p>
                <p className="text-xs">روند: {kpi.trend}</p>
              </div>
              <div className="text-lg font-bold">{kpi.value} {kpi.unit}</div>
            </div>
          ))}
          {values.length === 0 && (
            <div className="text-sm text-gray-500">داده KPI موجود نیست.</div>
          )}
        </div>
      )}
    </Card>
  );
}
