import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { FilterBar } from "@/components/filter-bar";
import { FeaturedCard } from "@/components/tool-card";
import { useSavedTools } from "@/hooks/use-saved";
import { mergeCatalog } from "@/lib/tools/catalog";
import { filterTools, type ToolFilters } from "@/lib/tools/filter";
import { listApprovedSubmissions } from "@/lib/tools/submissions";
import type { Category, Tool } from "@/lib/tools/types";

const FEATURED_CAP = 4;

function pickFeatured(tools: Tool[]) {
  const seen = new Set<string>();
  const out: Tool[] = [];
  for (const tool of tools) {
    if (!tool.featured || seen.has(tool.category)) continue;
    seen.add(tool.category);
    out.push(tool);
    if (out.length >= FEATURED_CAP) break;
  }
  return out;
}

type HomeSearch = {
  q?: string;
  category?: Category;
};

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category:
      typeof search.category === "string"
        ? (search.category as Category)
        : undefined,
  }),
  loader: async () => ({ approved: await listApprovedSubmissions() }),
  component: Home,
  head: () => ({
    meta: [{ title: "VALO DIRECTORY — Valorant sites worth your bookmark" }],
  }),
});

function Home() {
  const search = Route.useSearch();
  const { approved } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/" });
  const saved = useSavedTools();
  const catalog = mergeCatalog(approved);
  const filters: ToolFilters = {
    q: search.q ?? "",
    category: search.category ?? "",
    platform: "",
    pricing: "",
    status: "",
  };
  const filtering = Boolean(filters.q || filters.category);
  const results = filterTools(catalog, filters);
  const featured = pickFeatured(catalog);

  const onChange = (next: ToolFilters) => {
    void navigate({
      search: {
        q: next.q || undefined,
        category: next.category || undefined,
      },
    });
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="max-w-3xl">
        <h1 className="font-display text-4xl leading-none sm:text-6xl">
          Every Valorant site worth your bookmark.
        </h1>
        <p className="mt-5 max-w-xl text-base text-muted-foreground">
          {catalog.length} trackers, stat sites, guides, tools and community
          projects. Reviewed by hand, no affiliate links.
        </p>
      </section>

      {!filtering && featured.length > 0 ? (
        <section className="mt-12">
          <p className="font-label text-primary">Featured</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featured.map((tool) => (
              <FeaturedCard
                key={tool.id}
                tool={tool}
                saved={saved.has(tool.id)}
                onToggleSave={saved.toggle}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12">
        <FilterBar
          value={filters}
          onChange={onChange}
          count={catalog.length}
          extra={false}
        />
      </div>

      <div className="mt-8">
        <DirectoryList
          tools={results}
          saved={new Set(saved.ids)}
          onToggleSave={saved.toggle}
        />
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-6 font-mono text-xs text-muted-foreground">
        <span>
          Showing {results.length} of {catalog.length}
        </span>
        <Link to="/browse" className="text-primary">
          Browse all filters
        </Link>
      </div>
    </main>
  );
}
