import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { FilterBar } from "@/components/filter-bar";
import { useSavedTools } from "@/hooks/use-saved";
import { mergeCatalog } from "@/lib/tools/catalog";
import { filterTools, type ToolFilters } from "@/lib/tools/filter";
import { listApprovedSubmissions } from "@/lib/tools/submissions";
import type { Category, Platform, Pricing, ToolStatus } from "@/lib/tools/types";

type BrowseSearch = {
  q?: string;
  category?: Category;
  platform?: Platform;
  pricing?: Pricing;
  status?: ToolStatus;
};

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category:
      typeof search.category === "string"
        ? (search.category as Category)
        : undefined,
    platform:
      typeof search.platform === "string"
        ? (search.platform as Platform)
        : undefined,
    pricing:
      typeof search.pricing === "string"
        ? (search.pricing as Pricing)
        : undefined,
    status:
      typeof search.status === "string"
        ? (search.status as ToolStatus)
        : undefined,
  }),
  loader: async () => ({ approved: await listApprovedSubmissions() }),
  component: BrowsePage,
  head: () => ({
    meta: [{ title: "Browse — VALO DIRECTORY" }],
  }),
});

function BrowsePage() {
  const search = Route.useSearch();
  const { approved } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/browse" });
  const saved = useSavedTools();
  const tools = mergeCatalog(approved);

  const filters: ToolFilters = {
    q: search.q ?? "",
    category: search.category ?? "",
    platform: search.platform ?? "",
    pricing: search.pricing ?? "",
    status: search.status ?? "",
  };

  const results = filterTools(tools, filters);

  const onChange = (next: ToolFilters) => {
    void navigate({
      search: {
        q: next.q || undefined,
        category: next.category || undefined,
        platform: next.platform || undefined,
        pricing: next.pricing || undefined,
        status: next.status || undefined,
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">Browse</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Filter by category, platform, pricing, and status. We link out — this is
        a discovery hub, not a host.
      </p>
      <div className="mt-8">
        <FilterBar value={filters} onChange={onChange} count={tools.length} />
      </div>
      <p className="mt-8 px-1 font-mono text-xs tabular-nums text-muted-foreground">
        {results.length} of {tools.length}
      </p>
      <div className="mt-2">
        <DirectoryList
          tools={results}
          saved={new Set(saved.ids)}
          onToggleSave={saved.toggle}
        />
      </div>
    </main>
  );
}
