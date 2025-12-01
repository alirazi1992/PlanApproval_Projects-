import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { getDocumentsForProject, getProjectDetails } from "../services/apiClient";
import { Document, Project } from "../types";

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    if (!id) return;
    getProjectDetails(id).then((data) => setProject(data));
    getDocumentsForProject(id).then(setDocs);
  }, [id]);

  if (!project) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto p-4 text-right" dir="rtl">
          <p className="text-gray-600">پروژه‌ای یافت نشد.</p>
          <Button className="mt-3" onClick={() => navigate("/workspace/projects") }>
            بازگشت به مرور پروژه‌ها
          </Button>
        </div>
      </AppShell>
    );
  }

  const canCompleteEvaluation = docs.every((doc) => ["Accepted", "Verified"].includes(doc.status));

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-4" dir="rtl">
        <div className="flex items-center justify-between flex-row">
          <div>
            <p className="text-xs text-gray-500">{project.code}</p>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-sm text-gray-600">مشتری: {project.clientName} · {project.location}</p>
          </div>
          <div className="flex gap-2 flex-row">
            <StatusBadge status={project.status === "Track-Fast" ? "warning" : "success"} label={project.status} />
            <Button variant="secondary" onClick={() => navigate("/workspace/projects") }>
              بازگشت به مرور پروژه‌ها
            </Button>
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-row">
            <div>
              <p className="text-xs text-gray-500">زمان‌بندی</p>
              <p className="text-sm text-gray-700">
                شروع {project.startDate} · سررسید {project.dueDate} · آخرین بروزرسانی {project.lastUpdate}
              </p>
            </div>
            <div className="text-sm text-gray-700">پیشرفت {project.progress}%</div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-row">
            <h2 className="text-lg font-semibold">مدارک مرتبط</h2>
            <div className="text-sm text-gray-600">امکان مسیر‌یابی به تک‌تک مدارک</div>
          </div>
          <div className="space-y-2">
            {docs.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl border border-gray-100 bg-white flex flex-col gap-1">
                <div className="flex items-center justify-between flex-row">
                  <span className="text-sm font-semibold">{doc.type}</span>
                  <StatusBadge
                    status={doc.status === "Rejected" ? "error" : doc.status === "UnderReview" ? "info" : "success"}
                    label={doc.status}
                  />
                </div>
                <div className="text-xs text-gray-600 flex gap-3 flex-row flex-wrap">
                  <span>کد: {doc.code}</span>
                  <span>نسخه: {doc.version}</span>
                  <span>ضرب‌الاجل: {doc.deadline}</span>
                  <span>بازبینی: {doc.revisions}</span>
                </div>
                <div className="flex gap-2 flex-row">
                  <Button variant="primary" className="text-sm" onClick={() => navigate(`/projects/${project.id}/documents/${doc.id}`)}>
                    باز کردن سند
                  </Button>
                  <Button variant="secondary" className="text-sm" disabled={doc.status === "Accepted"}>
                    در انتظار اقدام
                  </Button>
                </div>
              </div>
            ))}
            {docs.length === 0 && <div className="text-sm text-gray-500">مدرکی ثبت نشده است.</div>}
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between flex-row">
          <div>
            <p className="text-sm font-semibold">تکمیل ارزیابی</p>
            <p className="text-xs text-gray-600">پس از تایید همه مدارک فعال می‌شود</p>
          </div>
          <Button variant="primary" disabled={!canCompleteEvaluation}>
            تکمیل ارزیابی نهایی
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
