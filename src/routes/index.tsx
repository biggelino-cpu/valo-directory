import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { FilterBar } from "@/components/filter-bar";
import { CategoryTile, FeaturedCard } from "@/components/tool-card";
import { useSavedTools } from "@/hooks/use-saved";
import { CATEGORIES } from "@/lib/tools/categories";
import { mergeCatalog } from "@/lib/tools/catalog";
import { filterTools, type ToolFilters } from "@/lib/tools/filter";
import { listApprovedSubmissions } from "@/lib/tools/submissions";
import { absoluteUrl, jsonLd, seo, SITE_URL } from "@/lib/seo";
import { APP_NAME } from "@/lib/brand";
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
  head: () => {
    const { meta, links } = seo({
      // Distinct from /browse on purpose: the home page targets discovery
      // ("what should I use"), /browse targets filtering ("narrow the list").
      title: "VALO DIRECTORY — Valorant trackers, tools and sites worth a bookmark",
      description:
        "A hand-reviewed catalog of Valorant trackers, stat sites, lineup guides, crosshair tools, overlays and Discord bots. Independent, no affiliate links.",
      path: "/",
    });
    return {
      meta,
      links,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: APP_NAME,
          url: SITE_URL,
          description:
            "Independent, curated directory of Valorant trackers, lineup sites, overlays, and community tools.",
          inLanguage: "en",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${absoluteUrl("/browse")}?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }),
      ],
    };
  },
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
  const categoryCounts = new Map<Category, number>();
  for (const tool of catalog) {
    categoryCounts.set(tool.category, (categoryCounts.get(tool.category) ?? 0) + 1);
  }

  const clearFilters = () =>
    onChange({ q: "", category: "", platform: "", pricing: "", status: "" });

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

      {!filtering ? (
        <section className="mt-12">
          <p className="font-label text-primary">Browse by category</p>
          <div className="mt-4 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <CategoryTile
                key={c.slug}
                name={c.name}
                slug={c.slug}
                blurb={c.blurb}
                count={categoryCounts.get(c.name) ?? 0}
                label={c.label}
              />
            ))}
          </div>
        </section>
      ) : null}

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
          totalCount={catalog.length}
          onClearFilters={filtering ? clearFilters : undefined}
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
