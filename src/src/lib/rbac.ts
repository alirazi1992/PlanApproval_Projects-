import { Role, WidgetType } from "../types";

export const roleDashboardProfile: Record<
  Role,
  { widgets: WidgetType[]; scopeLevel: "organization" | "department" | "unit" | "project" | "client" }
> = {
  TechnicalExpert: { widgets: ["projects", "documents", "alerts", "kpi"], scopeLevel: "project" },
  LeadEngineer: { widgets: ["projects", "documents", "alerts", "kpi"], scopeLevel: "unit" },
  Clerk: { widgets: ["projects", "documents", "alerts"], scopeLevel: "unit" },
  FinanceUser: { widgets: ["finance", "projects", "alerts"], scopeLevel: "unit" },
  UnitManager: { widgets: ["projects", "documents", "alerts", "kpi", "finance"], scopeLevel: "unit" },
  DepartmentManager: {
    widgets: ["projects", "documents", "alerts", "kpi", "finance", "reports"],
    scopeLevel: "department",
  },
  IMSManager: { widgets: ["projects", "documents", "alerts", "kpi", "reports"], scopeLevel: "organization" },
  SystemSecurityAdmin: { widgets: ["alerts", "reports"], scopeLevel: "organization" },
  CEO: { widgets: ["projects", "documents", "alerts", "kpi", "finance", "reports"], scopeLevel: "organization" },
  ClientOwner: { widgets: ["projects", "documents", "alerts", "finance", "kpi"], scopeLevel: "client" },
  ClientRepresentative: { widgets: ["projects", "documents", "alerts", "finance", "kpi"], scopeLevel: "client" },
  ClientDesigner: { widgets: ["projects", "documents", "alerts"], scopeLevel: "client" },
  ClientBuilder: { widgets: ["projects", "documents", "alerts"], scopeLevel: "client" },
};

export function canViewWidget(role: Role, widget: WidgetType) {
  return roleDashboardProfile[role]?.widgets.includes(widget);
}

export function getDashboardProfileForRole(role: Role) {
  return roleDashboardProfile[role];
}
