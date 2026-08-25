import type { Category, Platform, Pricing, Tool, ToolStatus } from "./types";

export type ToolFilters = {
  q?: string;
  category?: Category | "";
  platform?: Platform | "";
  pricing?: Pricing | "";
  status?: ToolStatus | "";
};

export type SortOption = "random" | "verified" | "az";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "random", label: "Random" },
  { value: "verified", label: "Recently checked" },
  { value: "az", label: "A–Z" },
];

/**
 * "random" is a no-op here: the catalogue arrives already shuffled for the
 * day (see ./shuffle), and filtering preserves that order.
 *
 * The second option sorts by lastVerified, which records when we last checked
 * the listing — not when the tool itself was updated, and not when it was
 * added. It is labelled "Recently checked" rather than "Newest" because that
 * is the only claim the data supports.
 */
export function sortTools(tools: Tool[], sort: SortOption): Tool[] {
  if (sort === "az") {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "verified") {
    return [...tools].sort((a, b) => b.lastVerified.localeCompare(a.lastVerified));
  }
  return tools;
}

export function filterTools(tools: Tool[], filters: ToolFilters): Tool[] {
  const q = filters.q?.trim().toLowerCase() ?? "";
  return tools.filter((t) => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.platform && !t.platforms.includes(filters.platform)) return false;
    if (filters.pricing && t.pricing !== filters.pricing) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (!q) return true;
    const hay = [
      t.name,
      t.shortDescription,
      t.description,
      t.category,
      t.pricing,
      ...t.tags,
      ...t.platforms,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
