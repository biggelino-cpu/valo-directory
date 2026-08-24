import type { Category, Platform, Pricing, Tool, ToolStatus } from "./types";

export type ToolFilters = {
  q?: string;
  category?: Category | "";
  platform?: Platform | "";
  pricing?: Pricing | "";
  status?: ToolStatus | "";
};

export type SortOption = "default" | "newest" | "az";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "az", label: "A–Z" },
];

export function sortTools(tools: Tool[], sort: SortOption): Tool[] {
  if (sort === "az") {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "newest") {
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
