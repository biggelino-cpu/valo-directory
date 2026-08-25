import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { FilterBar } from "@/components/filter-bar";
import { CategoryStrip } from "@/components/category-strip";
import { FilterRail } from "@/components/filter-rail";
import { OrderNote } from "@/components/order-note";
import { SpotlightRow } from "@/components/spotlight-row";
import { useSavedTools } from "@/hooks/use-saved";
import { mergeCatalog } from "@/lib/tools/catalog";
import { resolveSpotlights } from "@/lib/tools/spotlight";
import { dailySeed, shuffleTools } from "@/lib/tools/shuffle";
import { filterTools, type ToolFilters } from "@/lib/tools/filter";
import { listApprovedSubmissions } from "@/lib/tools/submissions";
import { absoluteUrl, jsonLd, seo, SITE_URL } from "@/lib/seo";
import { APP_NAME } from "@/lib/brand";
import type { Category } from "@/lib/tools/types";

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
  loader: async () => {
    const approved = await listApprovedSubmissions();
    const catalog = mergeCatalog(approved);
    return {
      // Shuffled here rather than in the component so the server and the
      // client cannot disagree about the day, and so every downstream filter
      // simply preserves the order.
      catalog: shuffleTools(catalog, dailySeed()),
      // Same reason: the weekly slot is time-derived.
      spotlights: resolveSpotlights(catalog),
    };
  },
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
  const { catalog, spotlights } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/" });
  const saved = useSavedTools();
  const filters: ToolFilters = {
    q: search.q ?? "",
    category: search.category ?? "",
    platform: "",
    pricing: "",
    status: "",
  };
  const filtering = Boolean(filters.q || filters.category);
  const results = filterTools(catalog, filters);
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6">
      {/* The rail owns category selection at lg and up; below that the
          horizontal strip does, since 230px cannot collapse to a phone. */}
      <FilterRail
        value={filters}
        onChange={onChange}
        counts={categoryCounts}
        total={catalog.length}
      />

      <div className="min-w-0 flex-1 py-6 lg:pl-6 sm:py-8">
      {/* Hero and search share one row: the search is the primary action on a
          directory and previously sat 1,472px down the page. */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <h1 className="font-display text-2xl leading-tight sm:text-3xl lg:whitespace-nowrap">
          Every Valorant site worth your bookmark.
        </h1>
        <p className="hidden font-mono text-xs whitespace-nowrap text-muted-foreground xl:ml-auto xl:block">
          {catalog.length} listings · reviewed by hand · no affiliate links
        </p>
      </div>

      {!filtering ? (
        <div className="mt-5 lg:hidden">
          <CategoryStrip counts={categoryCounts} />
        </div>
      ) : null}

      {!filtering && spotlights.length > 0 ? (
        <div className="mt-5">
          <SpotlightRow spotlights={spotlights} />
        </div>
      ) : null}

      <div className="mt-6">
        <FilterBar
          value={filters}
          onChange={onChange}
          count={catalog.length}
          extra={false}
          hasRail
        />
      </div>

      <OrderNote className="mt-5" />

      <div className="mt-3">
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
      </div>
    </main>
  );
}
