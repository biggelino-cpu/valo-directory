import { type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/tools/categories";
import type { ToolFilters } from "@/lib/tools/filter";
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
}: {
  value: ToolFilters;
  onChange: (next: ToolFilters) => void;
  count?: number;
  extra?: boolean;
}) {
  const set = (patch: Partial<ToolFilters>) => onChange({ ...value, ...patch });

  const activeCount = [
    value.category,
    value.platform,
    value.pricing,
    value.status,
    value.q,
  ].filter(Boolean).length;

  const placeholder =
    typeof count === "number"
      ? `Search ${count} sites, tools and trackers`
      : "Search sites, tools and trackers";

  return (
    <div className="flex flex-col gap-5">
      <label className="flex max-w-xl items-center gap-3 rounded-sm border border-input bg-card px-4 py-3.5">
        <span className="font-mono text-sm text-primary">/</span>
        <input
          value={value.q ?? ""}
          onChange={(e) => set({ q: e.target.value })}
          placeholder={placeholder}
          aria-label="Search tools"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
      <div className="flex flex-wrap gap-2">
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
      </div>
      {extra ? (
        <div className="flex flex-wrap gap-2">
          {PLATFORM_OPTIONS.map((p) => (
            <FilterChip
              key={p}
              active={value.platform === p}
              onClick={() =>
                set({ platform: value.platform === p ? "" : p })
              }
            >
              {p}
            </FilterChip>
          ))}
          {PRICING_OPTIONS.map((p) => (
            <FilterChip
              key={p}
              active={value.pricing === p}
              onClick={() => set({ pricing: value.pricing === p ? "" : p })}
            >
              {p}
            </FilterChip>
          ))}
          {STATUS_OPTIONS.map((s) => (
            <FilterChip
              key={s}
              active={value.status === s}
              onClick={() => set({ status: value.status === s ? "" : s })}
            >
              {s}
            </FilterChip>
          ))}
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
        "font-label rounded-sm px-2.5 py-1.5",
        active
          ? "bg-primary text-primary-foreground"
          : "border border-input text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
