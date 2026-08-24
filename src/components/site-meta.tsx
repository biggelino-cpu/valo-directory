import { Check } from "lucide-react";
import { useState } from "react";
import { formatVerifiedDate } from "@/lib/tools/format";
import { cn } from "@/lib/utils";

function faviconUrl(websiteUrl: string) {
  try {
    const { hostname } = new URL(websiteUrl);
    return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
  } catch {
    return null;
  }
}

export function SiteIcon({
  name,
  websiteUrl,
  className,
}: {
  name: string;
  websiteUrl: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? null : faviconUrl(websiteUrl);
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden border border-border bg-input font-mono text-muted-foreground",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-contain p-1"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
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
        "inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground",
        className,
      )}
    >
      <Check className="size-2.5" />
      {compact ? formatVerifiedDate(date) : `Verified ${formatVerifiedDate(date)}`}
    </span>
  );
}
