import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark, SearchX, X } from "lucide-react";
import { SiteIcon, VerifiedBadge } from "@/components/site-meta";
import { categoryLabel, categorySlug } from "@/lib/tools/categories";
import type { Tool } from "@/lib/tools/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function padIndex(n: number) {
  return String(n).padStart(2, "0");
}

export function DirectoryList({
  tools,
  saved,
  onToggleSave,
  start = 1,
  totalCount,
  onClearFilters,
}: {
  tools: Tool[];
  saved?: Set<string>;
  onToggleSave?: (id: string) => void;
  start?: number;
  totalCount?: number;
  onClearFilters?: () => void;
}) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 border-t border-border px-4 py-16 text-center">
        <span className="grid size-14 place-items-center border border-input text-muted-foreground">
          <SearchX className="size-6" />
        </span>
        <div>
          <p className="font-medium text-foreground">
            No sites match those filters.
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try a broader search or drop a filter
            {typeof totalCount === "number"
              ? ` — ${totalCount} sites are listed in total.`
              : "."}
          </p>
        </div>
        {onClearFilters ? (
          <Button type="button" variant="outline" size="sm" onClick={onClearFilters}>
            <X className="size-3.5" />
            Clear filters
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="border-t border-border">
      <div className="hidden grid-cols-[2.75rem_1.75rem_minmax(0,1fr)_9rem_7rem_2.5rem] gap-4 bg-card px-4 py-3 font-label text-muted-foreground md:grid">
        <span>#</span>
        <span />
        <span>Site</span>
        <span>Category</span>
        <span>Access</span>
        <span />
      </div>
      <ol>
        {tools.map((tool, i) => {
          const n = start + i;
          const isSaved = saved?.has(tool.id);
          return (
            <li
              key={tool.id}
              className="group border-t border-border transition-colors hover:bg-card"
            >
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-5 md:grid-cols-[2.75rem_1.75rem_minmax(0,1fr)_9rem_7rem_2.5rem] md:gap-4">
                <span className="font-mono text-index tabular-nums text-muted-foreground group-hover:text-primary">
                  {padIndex(n)}
                </span>
                <SiteIcon
                  name={tool.name}
                  websiteUrl={tool.websiteUrl}
                  className="hidden size-7 text-xs md:grid"
                />
                <Link
                  to="/tools/$slug"
                  params={{ slug: tool.slug }}
                  className="min-w-0"
                >
                  <span className="block font-bold tracking-tight group-hover:text-primary">
                    {tool.name}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                    {tool.shortDescription}
                  </span>
                  <span className="font-label mt-2 block text-primary md:hidden">
                    {categoryLabel(tool.category)}
                  </span>
                </Link>
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug(tool.category) }}
                  className="font-label hidden text-primary md:block"
                >
                  {categoryLabel(tool.category)}
                </Link>
                <div className="hidden flex-col items-start gap-1 md:flex">
                  <span className="font-mono text-xs text-muted-foreground">
                    {tool.pricing}
                  </span>
                  <VerifiedBadge date={tool.lastVerified} compact />
                </div>
                <div className="flex items-center justify-end gap-1">
                  {onToggleSave ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      aria-label={isSaved ? "Remove from saved" : "Save"}
                      onClick={() => onToggleSave(tool.id)}
                    >
                      <Bookmark
                        className={cn(
                          "size-3.5",
                          isSaved && "fill-primary text-primary",
                        )}
                      />
                    </Button>
                  ) : null}
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-8 place-items-center text-muted-foreground group-hover:text-primary"
                    aria-label={`Visit ${tool.name}`}
                  >
                    <ArrowUpRight className="size-4" />
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
