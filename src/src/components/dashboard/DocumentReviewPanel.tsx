import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocumentsForScope, reviewDocument, logAuditTrail } from "../../services/apiClient";
import { DashboardFilters, Document } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface Props {
  filters: DashboardFilters;
}

export function DocumentReviewPanel({ filters }: Props) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getDocumentsForScope(currentUser.scopes, filters).then((data) => {
      setDocuments(data);
      setLoading(false);
      logAuditTrail("dashboard:view-documents", { scope: currentUser.scopes, filters });
    });
  }, [filters, currentUser]);

  const overdue = useMemo(
    () => documents.filter((doc) => new Date(doc.deadline) < new Date()),
    [documents]
  );

  const markReviewed = async (doc: Document, decision: string) => {
    await reviewDocument(doc.id, decision);
    logAuditTrail("documents:review", { id: doc.id, decision });
  };

  return (
    <Card className="p-4 space-y-3" aria-label="مدارک">
      <div className="flex items-center justify-between flex-row">
        <div>
          <p className="text-xs text-gray-500">مدارک در جریان</p>
          <h3 className="text-lg font-semibold">مرور مدارک</h3>
        </div>
        <div className="text-xs text-red-600">تاخیر: {overdue.length}</div>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl border border-gray-100 bg-white">
              <div className="flex items-center justify-between flex-row">
                <div className="text-sm text-gray-700">
                  {doc.type} · {doc.code} · نسخه {doc.version}
                </div>
                <StatusBadge status={doc.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 flex-row">
                <span>ضرب‌الاجل: {doc.deadline}</span>
                <span>تکرار بازبینی: {doc.revisions}</span>
                <span>SLA: {doc.slaDays} روز</span>
              </div>
              <div className="flex gap-2 flex-row">
                <Button variant="primary" className="text-sm" onClick={() => navigate(`/projects/${doc.projectId}/documents/${doc.id}`)}>
                  مشاهده سند
                </Button>
                <Button variant="secondary" className="text-sm" onClick={() => markReviewed(doc, "Accepted")}>
                  تایید نهایی
                </Button>
                <Button variant="ghost" className="text-sm" onClick={() => markReviewed(doc, "Commented")}>
                  ارسال نظر
                </Button>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-sm text-gray-500">سندی برای این فیلتر وجود ندارد.</div>
          )}
        </div>
      )}
    </Card>
  );
}
