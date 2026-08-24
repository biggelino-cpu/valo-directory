import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bookmark,
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
import { SiteIcon, VerifiedBadge } from "@/components/site-meta";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryLabel, categorySlug } from "@/lib/tools/categories";
import type { Category, Tool } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

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

export function ToolCard({
  tool,
  saved,
  onToggleSave,
}: {
  tool: Tool;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}) {
  return (
    <Card className="group relative flex h-full flex-col">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <SiteIcon
            name={tool.name}
            websiteUrl={tool.websiteUrl}
            className="size-10 text-sm"
          />
          <span className="font-label text-primary">
            {categoryLabel(tool.category)}
          </span>
        </div>
        <div className="min-w-0">
          <Link
            to="/tools/$slug"
            params={{ slug: tool.slug }}
            className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary"
          >
            {tool.name}
          </Link>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
          <VerifiedBadge date={tool.lastVerified} className="mt-3" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
          <span>
            {tool.pricing}
            {tool.reviewStatus === "pending" ? " · pending" : ""}
            {tool.community ? " · community" : ""}
          </span>
          <div className="flex items-center gap-1">
            {onToggleSave ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={saved ? "Remove from saved" : "Save tool"}
                onClick={() => onToggleSave(tool.id)}
              >
                <Bookmark
                  className={cn("size-3.5", saved && "fill-primary text-primary")}
                />
              </Button>
            ) : null}
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-8 place-items-center text-primary"
              aria-label={`Visit ${tool.name}`}
            >
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeaturedCard({
  tool,
  saved,
  onToggleSave,
}: {
  tool: Tool;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}) {
  return (
    <Card className="group flex h-full flex-col">
      <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <SiteIcon
            name={tool.name}
            websiteUrl={tool.websiteUrl}
            className="size-12 text-lg"
          />
          <span className="font-label text-primary">
            {categoryLabel(tool.category)}
          </span>
        </div>
        <div className="min-w-0">
          <Link
            to="/tools/$slug"
            params={{ slug: tool.slug }}
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl group-hover:text-primary"
          >
            {tool.name}
          </Link>
          <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
          <VerifiedBadge date={tool.lastVerified} className="mt-4" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono text-xs text-muted-foreground">
            {tool.pricing}
          </span>
          <div className="flex items-center gap-2">
            {onToggleSave ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label={saved ? "Remove from saved" : "Save tool"}
                onClick={() => onToggleSave(tool.id)}
              >
                <Bookmark
                  className={cn("size-4", saved && "fill-primary text-primary")}
                />
              </Button>
            ) : null}
            <Button size="sm" variant="outline" asChild>
              <Link to="/tools/$slug" params={{ slug: tool.slug }}>
                Details
              </Link>
            </Button>
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center text-primary"
              aria-label={`Visit ${tool.name}`}
            >
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryTile({
  name,
  slug,
  blurb,
  count,
  label,
}: {
  name: Category;
  slug: string;
  blurb: string;
  count: number;
  label?: string;
}) {
  const Icon = CATEGORY_ICONS[name];
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className="group flex flex-col gap-8 border border-border bg-background p-5 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start justify-between">
        <Icon className="size-[18px] text-primary" />
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      </div>
      <div>
        <h3 className="font-display text-base group-hover:text-primary">
          {label ?? name}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {blurb}
        </p>
      </div>
    </Link>
  );
}

export function categoryHref(name: Tool["category"]) {
  return `/category/${categorySlug(name)}`;
}
