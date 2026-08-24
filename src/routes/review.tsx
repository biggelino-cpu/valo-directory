import { createFileRoute } from "@tanstack/react-router";
import { Inbox, Lock } from "lucide-react";
import { useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  listPendingSubmissions,
  reviewSubmission,
} from "@/lib/tools/submissions";
import type { Tool } from "@/lib/tools/types";

export const Route = createFileRoute("/review")({
  component: ReviewPage,
  head: () => ({
    meta: [{ title: "Review — VALO DIRECTORY" }],
  }),
});

function ReviewPage() {
  const [key, setKey] = useState("");
  const [tools, setTools] = useState<Tool[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadQueue = async () => {
    if (!key.trim()) {
      setMessage("Enter the review key.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const result = await listPendingSubmissions({
        data: { key: key.trim() },
      });
      if (!result.ok) {
        setTools(null);
        setMessage(result.error);
        return;
      }
      setTools(result.tools);
      if (result.tools.length === 0) {
        setMessage("Queue is empty.");
      }
    } catch {
      setMessage("Could not load the queue.");
    } finally {
      setBusy(false);
    }
  };

  const onReview = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    setMessage("");
    try {
      const result = await reviewSubmission({
        data: { id, action, key: key.trim() },
      });
      if (!result.ok) {
        setMessage(result.error);
        return;
      }
      setTools((prev) => (prev ?? []).filter((t) => t.id !== id));
      setMessage(
        action === "approve"
          ? "Approved — it now shows in Browse."
          : "Rejected — removed from the queue.",
      );
    } catch {
      setMessage("Review failed. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
        Reviewers
      </p>
      <h1 className="mt-2 font-display text-4xl">
        Review queue
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Unlisted on purpose. Pending submissions stay off the public site until
        you approve them.
      </p>

      <form
        className="mt-8 max-w-md border border-border bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void loadQueue();
        }}
      >
        <Label htmlFor="review-key">Reviewer key</Label>
        <div className="mt-3 flex gap-2">
          <Input
            id="review-key"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
          />
          <Button type="submit" disabled={busy}>
            <Lock className="size-4" />
            {busy ? "Checking…" : "Unlock"}
          </Button>
        </div>
        {message ? (
          <p className="mt-3 text-sm text-primary">{message}</p>
        ) : null}
      </form>

      {tools ? (
        <>
          <p className="mt-8 text-sm tabular-nums text-muted-foreground">
            {tools.length} pending
          </p>
          {tools.length === 0 ? (
            <div className="mt-10 max-w-md">
              <Inbox className="size-8 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Nothing waiting.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.id} className="flex flex-col gap-2">
                  <ToolCard tool={tool} />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busyId === tool.id}
                      onClick={() => void onReview(tool.id, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === tool.id}
                      onClick={() => void onReview(tool.id, "reject")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="mt-10 max-w-md text-sm text-muted-foreground">
          Unlock to see submissions. Public visitors only see approved tools in
          Browse.
        </p>
      )}
    </main>
  );
}
