import { useCallback } from "react";
import { logAuditTrail } from "../services/apiClient";
import { DashboardFilters } from "../types";

export function useAuditTrail() {
  const log = useCallback(
    (action: string, payload: Record<string, any> = {}) => {
      logAuditTrail(action, payload);
    },
    []
  );

  const logFilters = useCallback(
    (filters: DashboardFilters) => {
      log("dashboard:filters", { filters });
    },
    [log]
  );

  return { log, logFilters };
}
