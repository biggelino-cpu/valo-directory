import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { OrderNote } from "@/components/order-note";
import { Button } from "@/components/ui/button";
import { useSavedTools } from "@/hooks/use-saved";
import { categoryBySlug } from "@/lib/tools/categories";
import { mergeCatalog } from "@/lib/tools/catalog";
import { listApprovedSubmissions } from "@/lib/tools/submissions";
import { dailySeed, shuffleTools } from "@/lib/tools/shuffle";
import { absoluteUrl, breadcrumbs, jsonLd, seo } from "@/lib/seo";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const cat = categoryBySlug(params.slug);
    if (!cat) throw notFound();
    const approved = await listApprovedSubmissions();
    const tools = shuffleTools(
      mergeCatalog(approved).filter((t) => t.category === cat.name),
      dailySeed(),
    );
    return { cat, tools };
  },
  component: CategoryPage,
  head: ({ loaderData }) => {
    if (!loaderData) {
      return seo({ title: "Category", description: "Browse a category." });
    }
    const { cat, tools } = loaderData;
    const path = `/category/${cat.slug}`;
    const { meta, links } = seo({
      title: `${cat.name} — ${tools.length} Valorant ${
        tools.length === 1 ? "site" : "sites"
      }`,
      description: `${cat.blurb} ${tools.length} hand-reviewed Valorant ${
        tools.length === 1 ? "site" : "sites"
      } in this category.`,
      path,
    });

    return {
      meta,
      links,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.name,
          description: cat.blurb,
          url: absoluteUrl(path),
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: tools.length,
            itemListElement: tools.map((tool, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tool.name,
              url: absoluteUrl(`/tools/${tool.slug}`),
            })),
          },
        }),
        jsonLd(
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: cat.name, path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16">
      <h1 className="font-display text-3xl">Unknown category</h1>
      <Button className="mt-6" asChild>
        <Link to="/browse">Browse all</Link>
      </Button>
    </main>
  ),
});

function CategoryPage() {
  const { cat, tools } = Route.useLoaderData();
  const saved = useSavedTools();

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <p className="font-label text-primary">Category</p>
      <h1 className="mt-2 font-display text-4xl">{cat.name}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{cat.blurb}</p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          {tools.length} site{tools.length === 1 ? "" : "s"}
        </p>
        <OrderNote />
      </div>
      <div className="mt-4">
        <DirectoryList
          tools={tools}
          saved={new Set(saved.ids)}
          onToggleSave={saved.toggle}
        />
      </div>
    </main>
  );
}
