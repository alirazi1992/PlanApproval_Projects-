import { useEffect, useState } from "react";
import { DashboardFilters, FinanceSummary } from "../../types";
import { Card } from "../ui/Card";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { getFinanceSummary, logAuditTrail } from "../../services/apiClient";

interface Props {
  filters: DashboardFilters;
}

export function FinanceSummaryPanel({ filters }: Props) {
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getFinanceSummary(currentUser.scopes).then((data) => {
      setFinance(data);
      logAuditTrail("dashboard:view-finance", { scope: currentUser.scopes, filters });
      setLoading(false);
    });
  }, [filters, currentUser]);

  return (
    <Card className="p-4 space-y-3" aria-label="مالی">
      <div className="flex items-center justify-between flex-row">
        <div>
          <p className="text-xs text-gray-500">دید مالی</p>
          <h3 className="text-lg font-semibold">وضعیت فاکتورها</h3>
        </div>
        <span className="text-xs text-gray-600">بودجه در برابر عملکرد</span>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      ) : finance ? (
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-800">
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
            <p className="text-xs text-emerald-700">فاکتور صادر شده</p>
            <p className="text-lg font-bold">{finance.invoicesIssued.toLocaleString()} ریال</p>
          </div>
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
            <p className="text-xs text-indigo-700">پرداخت شده</p>
            <p className="text-lg font-bold">{finance.invoicesPaid.toLocaleString()} ریال</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
            <p className="text-xs text-amber-700">سررسید گذشته</p>
            <p className="text-lg font-bold">{finance.invoicesOverdue.toLocaleString()} ریال</p>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs text-slate-700">بودجه/هزینه</p>
            <p className="text-lg font-bold">
              {finance.actual.toLocaleString()} / {finance.budget.toLocaleString()} ریال
            </p>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">اطلاعات مالی در این محدوده در دسترس نیست.</div>
      )}
    </Card>
  );
}
