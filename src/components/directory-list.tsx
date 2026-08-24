import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark } from "lucide-react";
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
}: {
  tools: Tool[];
  saved?: Set<string>;
  onToggleSave?: (id: string) => void;
  start?: number;
}) {
  if (tools.length === 0) {
    return (
      <p className="border-t border-border px-1 py-10 text-muted-foreground">
        No sites match those filters.
      </p>
    );
  }

  return (
    <div className="border-t border-border">
      <div className="hidden grid-cols-[2.75rem_minmax(0,1fr)_9rem_5.5rem_2.5rem] gap-5 bg-card px-4 py-3 font-label text-muted-foreground md:grid">
        <span>#</span>
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
              <div className="grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-5 md:grid-cols-[2.75rem_minmax(0,1fr)_9rem_5.5rem_2.5rem] md:gap-5">
                <span className="font-mono text-index tabular-nums text-muted-foreground group-hover:text-primary">
                  {padIndex(n)}
                </span>
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
                <span className="hidden font-mono text-xs text-muted-foreground md:block">
                  {tool.pricing}
                </span>
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
