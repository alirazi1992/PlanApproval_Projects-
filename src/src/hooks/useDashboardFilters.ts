import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardFilters } from "../types";

const defaultFilters: DashboardFilters = {
  timeRange: "month",
};

export function useDashboardFilters() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  useEffect(() => {
    const next: DashboardFilters = { ...defaultFilters };
    const range = params.get("range") as DashboardFilters["timeRange"] | null;
    if (range) next.timeRange = range;
    const status = params.get("status") as DashboardFilters["status"] | null;
    if (status) next.status = status;
    if (params.get("trackFast") === "true") next.trackFastOnly = true;
    setFilters(next);
  }, [params]);

  const updateFilters = (next: DashboardFilters) => {
    setFilters(next);
    const newParams = new URLSearchParams();
    newParams.set("range", next.timeRange);
    if (next.status) newParams.set("status", next.status);
    if (next.trackFastOnly) newParams.set("trackFast", "true");
    setParams(newParams, { replace: true });
  };

  return { filters, updateFilters };
}
