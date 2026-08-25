import { Check } from "lucide-react";
import { useState } from "react";
import { FAVICONS } from "@/lib/tools/favicons";
import { formatVerifiedDate } from "@/lib/tools/format";
import { cn } from "@/lib/utils";

/**
 * Icons are served from our own origin, fetched ahead of time by
 * scripts/fetch-favicons.mjs.
 *
 * They used to be loaded from a third-party favicon service, which meant every
 * visitor's IP address and referrer reached that service once per listing —
 * roughly twenty times per page view, automatically, before anyone could
 * consent to it. Nothing about the icons was worth that.
 *
 * A listing with no icon in the manifest shows its monogram instead.
 */
export function SiteIcon({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? undefined : FAVICONS[slug];
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden border border-border-strong bg-card font-mono font-bold text-foreground/80",
        className,
      )}
    >
      {initial}
      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full bg-card object-contain p-1"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}

export function VerifiedBadge({
  date,
  compact = false,
  className,
}: {
  date: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      <Check className="size-3" />
      {compact ? formatVerifiedDate(date) : `Verified ${formatVerifiedDate(date)}`}
    </span>
  );
}
