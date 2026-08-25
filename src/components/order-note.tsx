import { Shuffle } from "lucide-react";
import type { SortOption } from "@/lib/tools/filter";
import { cn } from "@/lib/utils";

/**
 * States the ordering out loud.
 *
 * The catalogue is shuffled because nothing in a listing's data supports a
 * fair ranking, and a directory that silently presents an arbitrary order as
 * if it were a ranking is making a claim it has not earned. Saying so is the
 * point — this note is not decoration.
 */
export function OrderNote({
  sort = "random",
  className,
}: {
  sort?: SortOption;
  className?: string;
}) {
  if (sort !== "random") return null;

  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-xs text-muted-foreground",
        className,
      )}
    >
      <Shuffle className="size-3 shrink-0 text-primary" />
      <span>
        Random order — we don&rsquo;t rank listings. Reshuffles daily.
      </span>
    </p>
  );
}
