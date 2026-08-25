import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteIcon, VerifiedBadge } from "@/components/site-meta";
import { categoryLabel } from "@/lib/tools/categories";
import type { Spotlight } from "@/lib/tools/spotlight";

/**
 * The three editorial slots. On mobile they scroll horizontally with snap
 * rather than stacking — three stacked cards would push the catalogue back
 * below the fold, which is the whole reason this row replaced the old grid.
 */
export function SpotlightRow({ spotlights }: { spotlights: Spotlight[] }) {
  if (spotlights.length === 0) return null;

  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-px overflow-x-auto border-y border-border bg-border px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:border sm:px-0">
      {spotlights.map(({ slot, label, tool }) => (
        <article
          key={slot}
          className="group flex min-w-[82%] snap-start flex-col gap-3 bg-card p-5 sm:min-w-0"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-label text-primary">{label}</span>
            <span className="font-label text-muted-foreground">{categoryLabel(tool.category)}</span>
          </div>

          <div className="flex items-start gap-3">
            <SiteIcon slug={tool.slug} name={tool.name} className="size-9 text-sm" />
            <div className="min-w-0 flex-1">
              <Link
                to="/tools/$slug"
                params={{ slug: tool.slug }}
                className="focus-ring text-lg font-bold leading-tight tracking-tight group-hover:text-primary"
              >
                {tool.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                {tool.shortDescription}
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{tool.pricing}</span>
              <VerifiedBadge date={tool.lastVerified} compact />
            </div>
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
        </article>
      ))}
    </div>
  );
}
