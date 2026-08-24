import { seo } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { DirectoryList } from "@/components/directory-list";
import { Button } from "@/components/ui/button";
import { useSavedTools } from "@/hooks/use-saved";
import { mergeCatalog } from "@/lib/tools/catalog";
import { listApprovedSubmissions } from "@/lib/tools/submissions";

export const Route = createFileRoute("/saved")({
  loader: async () => ({ approved: await listApprovedSubmissions() }),
  component: SavedPage,
  head: () =>
    seo({
      title: "Saved",
      description: "Your saved Valorant tools, stored in this browser only.",
      noindex: true,
    }),
});

function SavedPage() {
  const { approved } = Route.useLoaderData();
  const saved = useSavedTools();
  const tools = useMemo(() => {
    return mergeCatalog(approved).filter((t) => saved.ids.includes(t.id));
  }, [approved, saved.ids]);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">Saved</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bookmarks stay in this browser only.
      </p>
      {!saved.ready ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : tools.length === 0 ? (
        <div className="mt-10 max-w-md">
          <p className="text-muted-foreground">
            Nothing saved yet. Open a listing and tap Save, or browse the
            directory.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/browse">Browse tools</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6">
          <DirectoryList
            tools={tools}
            saved={new Set(saved.ids)}
            onToggleSave={saved.toggle}
          />
        </div>
      )}
    </main>
  );
}
