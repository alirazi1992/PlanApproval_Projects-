export type Role =
  | "TechnicalExpert"
  | "LeadEngineer"
  | "Clerk"
  | "FinanceUser"
  | "UnitManager"
  | "DepartmentManager"
  | "IMSManager"
  | "SystemSecurityAdmin"
  | "CEO"
  | "ClientOwner"
  | "ClientRepresentative"
  | "ClientDesigner"
  | "ClientBuilder";

export interface Scope {
  organizationId: string;
  departmentId?: string;
  unitId?: string;
  clientId?: string;
  projectIds?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  scopes: Scope;
}

export type ProjectStatus = "Normal" | "Track-Fast";

export interface Project {
  id: string;
  code: string;
  title: string;
  clientName: string;
  location: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  lastUpdate: string;
  scope: Scope;
}

export type DocumentStatus =
  | "Draft"
  | "UnderReview"
  | "Commented"
  | "Accepted"
  | "Rejected"
  | "Verified";

export interface Document {
  id: string;
  projectId: string;
  type: string;
  code: string;
  version: string;
  status: DocumentStatus;
  deadline: string;
  slaDays: number;
  revisions: number;
  requiresClientAction?: boolean;
}

export interface Invoice {
  id: string;
  projectId: string;
  issued: number;
  paid: number;
  overdue: number;
  waiverPending?: boolean;
}

export interface FinanceSummary {
  scope: Scope;
  invoicesIssued: number;
  invoicesPaid: number;
  invoicesOverdue: number;
  budget: number;
  actual: number;
  waiverCount: number;
}

export interface KPIValue {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: number;
  threshold: { green: number; yellow: number };
}

export type AlertSeverity = "Critical" | "Major" | "Minor";

export interface AlertItem {
  id: string;
  projectCode: string;
  timestamp: string;
  severity: AlertSeverity;
  roleOwner: Role;
  suggestedAction: string;
  status: "Open" | "InProgress" | "Closed";
  title: string;
  scope: Scope;
}

export interface DashboardFilters {
  timeRange: "day" | "week" | "month" | "quarter" | "year";
  projectType?: string;
  unitId?: string;
  departmentId?: string;
  status?: ProjectStatus;
  trackFastOnly?: boolean;
  customFrom?: string;
  customTo?: string;
}

export type WidgetType =
  | "projects"
  | "documents"
  | "finance"
  | "kpi"
  | "alerts"
  | "reports";
