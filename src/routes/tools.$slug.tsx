import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ArrowUpRight, Bookmark, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useSavedTools } from "@/hooks/use-saved";
import { categorySlug } from "@/lib/tools/categories";
import { mergeCatalog } from "@/lib/tools/catalog";
import { formatVerifiedDate } from "@/lib/tools/format";
import { getToolBySlug } from "@/lib/tools/seed";
import {
  getSubmissionBySlug,
  listApprovedSubmissions,
  reviewSubmission,
} from "@/lib/tools/submissions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tools/$slug")({
  loader: async ({ params }) => {
    const seed = getToolBySlug(params.slug);
    const [fromDb, approved] = await Promise.all([
      seed ? Promise.resolve(null) : getSubmissionBySlug({ data: { slug: params.slug } }),
      listApprovedSubmissions(),
    ]);
    const tool = seed ?? fromDb;
    if (!tool) throw notFound();
    const related = mergeCatalog(approved)
      .filter((t) => t.category === tool.category && t.id !== tool.id)
      .slice(0, 3);
    return { tool, related };
  },
  component: ToolDetail,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.tool.name} — VALO DIRECTORY`
          : "Tool — VALO DIRECTORY",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="mx-auto max-w-7xl flex-1 px-4 py-16">
      <h1 className="font-display text-3xl">Tool not found</h1>
      <p className="mt-2 text-muted-foreground">
        That listing is not in the directory.
      </p>
      <Button className="mt-6" asChild>
        <Link to="/browse">Back to browse</Link>
      </Button>
    </main>
  ),
});

function ToolDetail() {
  const { tool, related } = Route.useLoaderData();
  const saved = useSavedTools();
  const isPending = tool.reviewStatus === "pending";

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
      <p className="font-label text-muted-foreground">
        <Link
          to="/category/$slug"
          params={{ slug: categorySlug(tool.category) }}
          className="hover:text-foreground"
        >
          {tool.category}
        </Link>
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">
            {tool.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
          {isPending ? (
            <p className="mt-3 max-w-xl text-sm text-primary">
              Waiting on review — not in the main directory yet.
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => saved.toggle(tool.id)}
          >
            <Bookmark
              className={cn(
                "size-4",
                saved.has(tool.id) && "fill-primary text-primary",
              )}
            />
            {saved.has(tool.id) ? "Saved" : "Save"}
          </Button>
          <Button asChild>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              Visit site
              <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="accent">{tool.pricing}</Badge>
        <Badge>{tool.status}</Badge>
        {tool.platforms.map((p) => (
          <Badge key={p} variant="outline">
            {p}
          </Badge>
        ))}
        {tool.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <Separator className="my-8" />

      <div className="grid gap-10 lg:grid-cols-[1fr_16rem]">
        <div>
          <h2 className="font-display text-2xl">
            About
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
          {tool.features.length > 0 ? (
            <>
              <h2 className="mt-8 font-display text-2xl">
                Features
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {tool.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          ) : null}
          {tool.safetyNotes ? (
            <div className="mt-8 flex gap-3 border border-border bg-card p-4">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">Safety note</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.safetyNotes}
                </p>
              </div>
            </div>
          ) : null}
          {tool.community ? <CommunityReview toolId={tool.id} /> : null}
        </div>
        <aside className="border border-border bg-card p-5">
          <p className="font-label text-muted-foreground">
            Listing
          </p>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Last verified</dt>
              <dd className="tabular-nums">{formatVerifiedDate(tool.lastVerified)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="capitalize">{tool.status}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Pricing</dt>
              <dd className="capitalize">{tool.pricing}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl">
            Related
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <ToolCard
                key={t.id}
                tool={t}
                saved={saved.has(t.id)}
                onToggleSave={saved.toggle}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function CommunityReview({ toolId }: { toolId: string }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const onReject = async () => {
    if (!key.trim()) {
      setMessage("Enter the review key.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await reviewSubmission({
        data: { id: toolId, action: "reject", key: key.trim() },
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setMessage("Removed from the directory.");
      await router.invalidate();
    } catch {
      setMessage("Could not update that listing.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-8 border border-border bg-card p-4">
      <p className="text-sm font-medium">Reviewer</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Community listings can be taken down with the review key.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Input
          type="password"
          autoComplete="off"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="max-w-xs"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() => void onReject()}
        >
          Remove
        </Button>
      </div>
      {message ? <p className="mt-2 text-sm text-primary">{message}</p> : null}
    </div>
  );
}

