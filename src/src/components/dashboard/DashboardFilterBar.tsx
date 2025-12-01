import { DashboardFilters } from "../../types";
import { Button } from "../ui/Button";

interface Props {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

const rangeLabels: Record<DashboardFilters["timeRange"], string> = {
  day: "امروز",
  week: "هفته",
  month: "ماه",
  quarter: "فصل",
  year: "سال",
};

export function DashboardFilterBar({ filters, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-between bg-white border border-gray-200 rounded-xl p-3" dir="rtl">
      <div className="flex items-center gap-2 flex-row">
        {(Object.keys(rangeLabels) as DashboardFilters["timeRange"][]).map((range) => (
          <Button
            key={range}
            variant={filters.timeRange === range ? "primary" : "ghost"}
            className="text-sm px-3"
            onClick={() => onChange({ ...filters, timeRange: range })}
          >
            {rangeLabels[range]}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2 flex-row">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <span>Track-Fast</span>
          <input
            type="checkbox"
            checked={Boolean(filters.trackFastOnly)}
            onChange={(e) => onChange({ ...filters, trackFastOnly: e.target.checked })}
          />
        </label>
        <Button
          variant="ghost"
          className="text-sm"
          onClick={() => onChange({ timeRange: "month" })}
        >
          بازنشانی فیلتر
        </Button>
      </div>
    </div>
  );
}
