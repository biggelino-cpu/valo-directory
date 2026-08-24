import { type ReactNode } from "react";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/tools/categories";
import type { ToolFilters } from "@/lib/tools/filter";
import {
  PLATFORM_OPTIONS,
  PRICING_OPTIONS,
  STATUS_OPTIONS,
  type Category,
} from "@/lib/tools/types";
import { cn } from "@/lib/utils";

/**
 * Persistent left rail: category navigation, and on /browse the platform,
 * pricing and status filters too — no toggle to open, no chip row to scan.
 *
 * Desktop only. At 230px it cannot collapse gracefully into a phone width, so
 * below `lg` the horizontal strip and chip row stay as they are.
 */
export function FilterRail({
  value,
  onChange,
  counts,
  total,
  extra = false,
}: {
  value: ToolFilters;
  onChange: (next: ToolFilters) => void;
  counts: Map<Category, number>;
  total: number;
  /** Show the platform / pricing / status groups. */
  extra?: boolean;
}) {
  const set = (patch: Partial<ToolFilters>) => onChange({ ...value, ...patch });
  const activeCount = [
    value.category,
    value.platform,
    value.pricing,
    value.status,
  ].filter(Boolean).length;

  return (
    <aside className="hidden w-[230px] shrink-0 border-r border-border py-6 pr-5 lg:block">
      <p className="font-label mb-3 px-3 text-primary">Category</p>
      <div className="flex flex-col">
        <RailRow
          active={!value.category}
          count={total}
          onClick={() => set({ category: "" })}
        >
          All
        </RailRow>
        {CATEGORIES.map((c) => (
          <RailRow
            key={c.slug}
            active={value.category === c.name}
            count={counts.get(c.name) ?? 0}
            onClick={() =>
              set({ category: value.category === c.name ? "" : c.name })
            }
          >
            {c.label}
          </RailRow>
        ))}
      </div>

      {extra ? (
        <>
          <RailGroup label="Platform">
            {PLATFORM_OPTIONS.map((p) => (
              <RailChip
                key={p}
                active={value.platform === p}
                onClick={() => set({ platform: value.platform === p ? "" : p })}
              >
                {p}
              </RailChip>
            ))}
          </RailGroup>
          <RailGroup label="Pricing">
            {PRICING_OPTIONS.map((p) => (
              <RailChip
                key={p}
                active={value.pricing === p}
                onClick={() => set({ pricing: value.pricing === p ? "" : p })}
              >
                {p}
              </RailChip>
            ))}
          </RailGroup>
          <RailGroup label="Status">
            {STATUS_OPTIONS.map((s) => (
              <RailChip
                key={s}
                active={value.status === s}
                onClick={() => set({ status: value.status === s ? "" : s })}
              >
                {s}
              </RailChip>
            ))}
          </RailGroup>
        </>
      ) : null}

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() =>
            onChange({ q: value.q ?? "", category: "", platform: "", pricing: "", status: "" })
          }
          className="font-label focus-ring mt-6 flex w-full items-center gap-2 border-t border-border px-3 pt-4 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      ) : null}
    </aside>
  );
}

function RailRow({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring flex items-center justify-between gap-2 px-3 py-2 transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-card",
      )}
    >
      <span className="font-label">{children}</span>
      <span
        className={cn(
          "font-mono text-xs tabular-nums",
          active ? "text-primary-foreground" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function RailGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-6 border-t border-border px-3 pt-5">
      <p className="font-label mb-3 text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function RailChip({
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
        "font-label focus-ring inline-flex min-h-7 items-center rounded-sm px-2 transition-colors",
        active
          ? "border border-primary text-primary"
          : "border border-border-strong text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
