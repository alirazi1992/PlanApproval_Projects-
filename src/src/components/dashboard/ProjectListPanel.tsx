import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../../services/apiClient";
import { DashboardFilters, Project } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { logAuditTrail } from "../../services/apiClient";

interface Props {
  filters: DashboardFilters;
}

export function ProjectListPanel({ filters }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    getProjects(currentUser.scopes, filters).then((data) => {
      setProjects(data);
      logAuditTrail("dashboard:view-projects", { filters, scope: currentUser.scopes });
      setLoading(false);
    });
  }, [filters, currentUser]);

  return (
    <Card className="p-4 space-y-3" aria-label="پروژه‌ها">
      <div className="flex items-center justify-between flex-row">
        <div>
          <p className="text-xs text-gray-500">پرونده‌های جاری</p>
          <h3 className="text-lg font-semibold">پروژه‌های فعال</h3>
        </div>
        <Button variant="secondary" className="text-sm" onClick={() => navigate("/workspace/projects") }>
          میز پروژه‌ها
        </Button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">در حال بارگذاری...</div>
      ) : (
        <div className="grid gap-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-gray-100 bg-white p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between flex-row">
                <span className="text-xs text-gray-500">{project.code}</span>
                <StatusBadge
                  status={project.status === "Track-Fast" ? "warning" : "success"}
                  label={project.status === "Track-Fast" ? "Track-Fast" : "Normal"}
                />
              </div>
              <div className="flex items-center justify-between flex-row">
                <div>
                  <p className="font-semibold text-gray-900">{project.title}</p>
                  <p className="text-sm text-gray-600">مشتری: {project.clientName} · {project.location}</p>
                </div>
                <span className="text-sm text-gray-700">پیشرفت {project.progress}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 flex-row">
                <span>شروع: {project.startDate}</span>
                <span>سررسید: {project.dueDate}</span>
                <span>آخرین بروزرسانی: {project.lastUpdate}</span>
              </div>
              <div className="flex gap-2 flex-row">
                <Button variant="primary" className="text-sm" onClick={() => navigate(`/projects/${project.id}`)}>
                  باز کردن پرونده
                </Button>
                <Button
                  variant="secondary"
                  className="text-sm"
                  onClick={() => navigate(`/projects/${project.id}?action=review`)}
                >
                  تکمیل ارزیابی
                </Button>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-sm text-gray-500">پروژه‌ای در این محدوده یافت نشد.</div>
          )}
        </div>
      )}
    </Card>
  );
}
