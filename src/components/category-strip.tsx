import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  Crosshair,
  MonitorPlay,
  MoreHorizontal,
  ShoppingBag,
  SquareLibrary,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/tools/categories";
import type { Category } from "@/lib/tools/types";

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  "Trackers & Stats": BarChart3,
  "Esports & Competitive": Trophy,
  "Lineups & Strategies": SquareLibrary,
  "Store, Inventory & Skins": ShoppingBag,
  "Crosshairs & Settings": Crosshair,
  "Overlays & Desktop Apps": MonitorPlay,
  "Discord Bots & Utilities": Bot,
  Other: MoreHorizontal,
};

/**
 * One row, scrolled horizontally rather than wrapped into a grid. The grid
 * version cost 333px of the first screen for navigation the filter chips on
 * /browse already provide; this keeps category browsing discoverable at 80px.
 */
export function CategoryStrip({
  counts,
}: {
  counts: Map<Category, number>;
}) {
  return (
    <div className="-mx-4 flex snap-x overflow-x-auto border-y border-border sm:mx-0 sm:border-x">
      {CATEGORIES.map((c) => {
        const Icon = CATEGORY_ICONS[c.name];
        return (
          <Link
            key={c.slug}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="focus-ring group flex min-w-[7rem] flex-1 snap-start flex-col justify-between gap-5 border-r border-border p-3 transition-colors last:border-r-0 hover:bg-card"
          >
            <Icon className="size-4 text-primary" />
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-sm group-hover:text-primary">
                {c.label}
              </span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {counts.get(c.name) ?? 0}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
