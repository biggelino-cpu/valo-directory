import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { SiteIcon, VerifiedBadge } from "@/components/site-meta";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryLabel } from "@/lib/tools/categories";
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
  return (
    <Card className="group relative flex h-full flex-col">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <SiteIcon
            name={tool.name}
            websiteUrl={tool.websiteUrl}
            className="size-10 text-sm"
          />
          <span className="font-label text-muted-foreground">
            {categoryLabel(tool.category)}
          </span>
        </div>
        <div className="min-w-0">
          <Link
            to="/tools/$slug"
            params={{ slug: tool.slug }}
            className="focus-ring text-xl font-bold tracking-tight text-foreground group-hover:text-primary"
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
              className="focus-ring grid size-8 place-items-center text-primary"
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
