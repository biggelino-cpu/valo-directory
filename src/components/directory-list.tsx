import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark, SearchX, X } from "lucide-react";
import { SiteIcon, VerifiedBadge } from "@/components/site-meta";
import { categoryLabel, categorySlug } from "@/lib/tools/categories";
import type { Tool } from "@/lib/tools/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function DirectoryList({
  tools,
  saved,
  onToggleSave,
  totalCount,
  onClearFilters,
}: {
  tools: Tool[];
  saved?: Set<string>;
  onToggleSave?: (id: string) => void;
  totalCount?: number;
  onClearFilters?: () => void;
}) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center gap-5 border-t border-border px-4 py-16 text-center">
        <span className="grid size-14 place-items-center border border-border-strong text-muted-foreground">
          <SearchX className="size-6" />
        </span>
        <div>
          <p className="font-medium text-foreground">No sites match those filters.</p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try a broader search or drop a filter
            {typeof totalCount === "number" ? ` — ${totalCount} sites are listed in total.` : "."}
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
      <div className="hidden grid-cols-[1.75rem_minmax(0,1fr)_9rem_7rem_2.5rem] gap-4 bg-card px-4 py-3 font-label text-muted-foreground md:grid">
        <span />
        <span>Site</span>
        <span>Category</span>
        <span>Access</span>
        <span />
      </div>
      <ol>
        {tools.map((tool) => {
          const isSaved = saved?.has(tool.id);
          return (
            <li
              key={tool.id}
              className="group border-t border-border transition-colors hover:bg-card"
            >
              <div className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 px-4 py-4 md:grid-cols-[1.75rem_minmax(0,1fr)_9rem_7rem_2.5rem] md:items-center md:gap-4 md:py-5">
                <SiteIcon
                  slug={tool.slug}
                  name={tool.name}
                  className="size-8 text-sm md:size-7 md:text-xs"
                />
                <Link to="/tools/$slug" params={{ slug: tool.slug }} className="focus-ring min-w-0">
                  <span className="block font-bold tracking-tight group-hover:text-primary">
                    {tool.name}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                    {tool.shortDescription}
                  </span>
                  <span className="font-label mt-2 flex items-center gap-2 text-muted-foreground md:hidden">
                    <span>{categoryLabel(tool.category)}</span>
                    <span aria-hidden>·</span>
                    <span>{tool.pricing}</span>
                  </span>
                </Link>
                <Link
                  to="/category/$slug"
                  params={{ slug: categorySlug(tool.category) }}
                  className="font-label focus-ring hidden text-muted-foreground hover:text-primary md:block"
                >
                  {categoryLabel(tool.category)}
                </Link>
                <div className="hidden flex-col items-start gap-1 md:flex">
                  <span className="font-mono text-xs text-muted-foreground">{tool.pricing}</span>
                  <VerifiedBadge date={tool.lastVerified} compact />
                </div>
                <div className="flex items-center justify-end gap-1">
                  {onToggleSave ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-10 sm:size-8"
                      aria-label={isSaved ? "Remove from saved" : "Save"}
                      onClick={() => onToggleSave(tool.id)}
                    >
                      <Bookmark
                        className={cn("size-3.5", isSaved && "fill-primary text-primary")}
                      />
                    </Button>
                  ) : null}
                  <a
                    href={tool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring grid size-10 place-items-center text-muted-foreground group-hover:text-primary sm:size-8"
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
