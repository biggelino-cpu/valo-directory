import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

function Bars({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 22 16"
      className={cn("text-primary", className)}
      fill="currentColor"
      aria-hidden
    >
      <rect width="22" height="3.5" />
      <rect y="6.25" width="15.4" height="3.5" />
      <rect y="12.5" width="8.8" height="3.5" />
    </svg>
  );
}

export function BrandMark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn("flex items-center gap-3 text-foreground", className)}
    >
      <Bars className={compact ? "h-3.5 w-[18px]" : "h-4 w-5"} />
      <span className="flex items-baseline gap-2">
        <span className="text-lg font-bold leading-none tracking-tight">
          VALO
        </span>
        {compact ? null : (
          <span className="font-label text-muted-foreground">Directory</span>
        )}
      </span>
    </Link>
  );
}
