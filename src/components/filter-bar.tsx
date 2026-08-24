import { useState, type ReactNode } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/tools/categories";
import { SORT_OPTIONS, type SortOption, type ToolFilters } from "@/lib/tools/filter";
import {
  PLATFORM_OPTIONS,
  PRICING_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/tools/types";
import { cn } from "@/lib/utils";

export function FilterBar({
  value,
  onChange,
  count,
  extra = true,
  sort,
  onSortChange,
}: {
  value: ToolFilters;
  onChange: (next: ToolFilters) => void;
  count?: number;
  extra?: boolean;
  sort?: SortOption;
  onSortChange?: (next: SortOption) => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const set = (patch: Partial<ToolFilters>) => onChange({ ...value, ...patch });

  const advancedCount = [value.platform, value.pricing, value.status].filter(
    Boolean,
  ).length;
  const activeCount = advancedCount + [value.category, value.q].filter(Boolean).length;

  const placeholder =
    typeof count === "number"
      ? `Search ${count} sites, tools and trackers`
      : "Search sites, tools and trackers";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 max-w-xl items-center gap-3 rounded-sm border border-border-strong bg-card px-4 py-3.5 transition-colors focus-within:border-primary">
          <span className="font-mono text-sm text-primary">/</span>
          <input
            value={value.q ?? ""}
            onChange={(e) => set({ q: e.target.value })}
            placeholder={placeholder}
            aria-label="Search tools"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>
        {sort && onSortChange ? (
          <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Sort">
              <span className="font-label mr-1 text-muted-foreground">Sort</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={!value.category}
          onClick={() => set({ category: "" })}
        >
          All
        </FilterChip>
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.slug}
            active={value.category === c.name}
            onClick={() =>
              set({ category: value.category === c.name ? "" : c.name })
            }
          >
            {c.label}
          </FilterChip>
        ))}
        {extra ? (
          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            className="font-label focus-ring ml-1 inline-flex min-h-9 items-center gap-2 border border-dashed border-border-strong px-3 text-foreground sm:min-h-8"
          >
            More filters
            {advancedCount > 0 ? (
              <span className="font-label grid size-4 place-items-center bg-primary text-primary-foreground">
                {advancedCount}
              </span>
            ) : null}
            <ChevronDown
              className={cn("size-3 text-muted-foreground transition-transform", showMore && "rotate-180")}
            />
          </button>
        ) : null}
      </div>
      {extra && showMore ? (
        <div className="border border-border bg-card p-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <FilterGroup label="Platform">
              {PLATFORM_OPTIONS.map((p) => (
                <FilterChip
                  key={p}
                  active={value.platform === p}
                  onClick={() => set({ platform: value.platform === p ? "" : p })}
                >
                  {p}
                </FilterChip>
              ))}
            </FilterGroup>
            <FilterGroup label="Pricing">
              {PRICING_OPTIONS.map((p) => (
                <FilterChip
                  key={p}
                  active={value.pricing === p}
                  onClick={() => set({ pricing: value.pricing === p ? "" : p })}
                >
                  {p}
                </FilterChip>
              ))}
            </FilterGroup>
            <FilterGroup label="Status">
              {STATUS_OPTIONS.map((s) => (
                <FilterChip
                  key={s}
                  active={value.status === s}
                  onClick={() => set({ status: value.status === s ? "" : s })}
                >
                  {s}
                </FilterChip>
              ))}
            </FilterGroup>
          </div>
          {advancedCount > 0 ? (
            <button
              type="button"
              onClick={() => set({ platform: "", pricing: "", status: "" })}
              className="font-label focus-ring mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
              Clear these
            </button>
          ) : null}
        </div>
      ) : null}
      {activeCount > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="self-start font-label"
          onClick={() =>
            onChange({
              q: "",
              category: "",
              platform: "",
              pricing: "",
              status: "",
            })
          }
        >
          <X className="size-3.5" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="font-label mb-2.5 text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "font-label focus-ring inline-flex min-h-9 items-center rounded-sm px-3 transition-colors sm:min-h-8",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-border-strong text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
