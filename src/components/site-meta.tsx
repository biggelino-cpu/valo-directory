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
  const [status, setStatus] = useState<"pending" | "loaded" | "failed">(
    "pending",
  );
  const src = status === "failed" ? null : faviconUrl(websiteUrl);
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
          className={cn(
            "absolute inset-0 size-full bg-card object-contain p-1",
            status === "loaded" ? "opacity-100" : "opacity-0",
          )}
          loading="lazy"
          onError={() => setStatus("failed")}
          onLoad={(e) => {
            // Google's service answers with a 16px generic globe when it has
            // no icon for the domain; anything that small is not a real icon.
            setStatus(e.currentTarget.naturalWidth > 16 ? "loaded" : "failed");
          }}
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
