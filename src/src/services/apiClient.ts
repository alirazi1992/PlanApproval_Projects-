import { alerts, documents, financeSummaries, kpis, projects } from "./mockData";
import {
  AlertItem,
  DashboardFilters,
  Document,
  FinanceSummary,
  KPIValue,
  Project,
  Scope,
} from "../types";

function matchesScope(recordScope: Scope, scope: Scope) {
  if (scope.clientId && recordScope.clientId && scope.clientId !== recordScope.clientId) return false;
  if (scope.unitId && recordScope.unitId && scope.unitId !== recordScope.unitId) return false;
  if (scope.departmentId && recordScope.departmentId && scope.departmentId !== recordScope.departmentId) return false;
  return true;
}

function filterByScope<T extends { scope?: Scope }>(items: T[], scope: Scope) {
  return items.filter((item) => {
    if (!item.scope) return true;
    return matchesScope(item.scope, scope);
  });
}

function filterProjects(data: Project[], scope: Scope, filters?: DashboardFilters) {
  const scoped = filterByScope(data, scope);
  return scoped.filter((project) => {
    if (filters?.status && project.status !== filters.status) return false;
    if (filters?.trackFastOnly && project.status !== "Track-Fast") return false;
    if (scope.clientId && project.scope.clientId && project.scope.clientId !== scope.clientId) return false;
    return true;
  });
}

export async function getProjects(scope: Scope, filters?: DashboardFilters): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(filterProjects(projects, scope, filters)), 200);
  });
}

export async function getProjectDetails(projectId: string): Promise<Project | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(projects.find((p) => p.id === projectId) ?? null);
    }, 150);
  });
}

export async function getDocumentsForProject(projectId: string, _filters?: DashboardFilters): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(documents.filter((d) => d.projectId === projectId));
    }, 220);
  });
}

export async function getDocumentsForScope(scope: Scope, _filters?: DashboardFilters): Promise<Document[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectIds = filterProjects(projects, scope).map((p) => p.id);
      resolve(documents.filter((d) => projectIds.includes(d.projectId)));
    }, 220);
  });
}

export async function getFinanceSummary(scope: Scope): Promise<FinanceSummary | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(financeSummaries.find((f) => matchesScope(f.scope, scope)) ?? null);
    }, 260);
  });
}

export async function getKpis(scope: Scope): Promise<KPIValue[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = scope.clientId ? kpis.filter((kpi) => kpi.id !== "kpi-4") : kpis;
      resolve(result);
    }, 180);
  });
}

export async function getAlerts(scope: Scope): Promise<AlertItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filterByScope(alerts, scope));
    }, 240);
  });
}

export async function getDashboardSummary(_role: string, scope: Scope, filters: DashboardFilters) {
  const [projectList, docs, kpiValues, alertItems, finance] = await Promise.all([
    getProjects(scope, filters),
    getDocumentsForScope(scope, filters),
    getKpis(scope),
    getAlerts(scope),
    getFinanceSummary(scope),
  ]);

  return {
    projects: projectList,
    documents: docs,
    kpis: kpiValues,
    alerts: alertItems,
    finance,
  };
}

export async function logAuditTrail(action: string, payload: Record<string, any>) {
  // Swap this console.log with a POST to /api/audit when backend is ready.
  console.info("AUDIT", action, payload);
}

export async function reviewDocument(documentId: string, decision: string) {
  // placeholder for POST /api/documents/:id/review
  console.info("REVIEW", documentId, decision);
  return {
    success: true,
    status: decision,
  };
}
