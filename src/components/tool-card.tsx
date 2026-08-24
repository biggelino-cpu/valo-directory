import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryLabel, categorySlug } from "@/lib/tools/categories";
import type { Tool } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

export function ToolCard({
  tool,
  saved,
  onToggleSave,
}: {
  tool: Tool;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}) {
  const initial = tool.name.slice(0, 1).toUpperCase();
  return (
    <Card className="group relative flex h-full flex-col">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-10 place-items-center border border-border font-mono text-sm text-muted-foreground">
            {initial}
          </span>
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
  const initial = tool.name.slice(0, 1).toUpperCase();
  return (
    <Card className="group flex h-full flex-col">
      <CardContent className="flex h-full flex-col gap-6 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <span className="grid size-12 place-items-center border border-input font-mono text-lg text-muted-foreground">
            {initial}
          </span>
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
  name: string;
  slug: string;
  blurb: string;
  count: number;
  label?: string;
}) {
  return (
    <Link
      to="/category/$slug"
      params={{ slug }}
      className="block border border-border bg-card p-5 transition-colors hover:border-primary/50"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-lg">{label ?? name}</h3>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {count}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
    </Link>
  );
}

export function categoryHref(name: Tool["category"]) {
  return `/category/${categorySlug(name)}`;
}
