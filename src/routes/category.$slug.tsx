import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DirectoryList } from "@/components/directory-list";
import { Button } from "@/components/ui/button";
import { useSavedTools } from "@/hooks/use-saved";
import { categoryBySlug } from "@/lib/tools/categories";
import { mergeCatalog } from "@/lib/tools/catalog";
import { listApprovedSubmissions } from "@/lib/tools/submissions";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const cat = categoryBySlug(params.slug);
    if (!cat) throw notFound();
    const approved = await listApprovedSubmissions();
    const tools = mergeCatalog(approved).filter((t) => t.category === cat.name);
    return { cat, tools };
  },
  component: CategoryPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.cat.name} — VALO DIRECTORY`
          : "Category — VALO DIRECTORY",
      },
    ],
  }),
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
      <p className="mt-6 font-mono text-xs tabular-nums text-muted-foreground">
        {tools.length} site{tools.length === 1 ? "" : "s"}
      </p>
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
