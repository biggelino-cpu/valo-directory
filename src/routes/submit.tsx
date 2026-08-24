import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/tools/categories";
import { submitTool } from "@/lib/tools/submissions";
import {
  formatSubmitError,
  validateSubmitInput,
  SUBMIT_FIELD_IDS,
  type SubmitField,
} from "@/lib/tools/submit-schema";
import { DISCLAIMER } from "@/lib/brand";
import type { Category, Platform, Pricing } from "@/lib/tools/types";
import { PLATFORM_OPTIONS, PRICING_OPTIONS } from "@/lib/tools/types";

export const Route = createFileRoute("/submit")({
  component: SubmitPage,
  head: () => ({
    meta: [{ title: "Submit a site — VALO DIRECTORY" }],
  }),
});

function SubmitPage() {
  const [doneSlug, setDoneSlug] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0].name);
  const [pricing, setPricing] = useState<Pricing>("free");
  const [platforms, setPlatforms] = useState<Platform[]>(["web"]);
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<SubmitField | null>(null);
  const doneHeadingRef = useRef<HTMLHeadingElement>(null);

  // Send focus to the confirmation so the state change is announced and
  // keyboard users are not dropped back at the top of the document.
  useEffect(() => {
    if (doneSlug) doneHeadingRef.current?.focus();
  }, [doneSlug]);

  const failWith = (field: SubmitField | null, message: string) => {
    setError(message);
    setErrorField(field);
    if (field) {
      const el = document.getElementById(SUBMIT_FIELD_IDS[field]);
      el?.focus();
    }
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setErrorField(null);
    const payload = {
      name: name.trim(),
      websiteUrl: websiteUrl.trim(),
      shortDescription: shortDescription.trim(),
      category,
      pricing,
      platforms,
    };
    const localError = validateSubmitInput(payload);
    if (localError) {
      failWith(localError.field, localError.message);
      return;
    }
    setBusy(true);
    try {
      const result = await submitTool({ data: payload });
      if (!result.ok) {
        failWith(null, result.error);
        return;
      }
      setDoneSlug(result.slug);
    } catch (err) {
      failWith(null, formatSubmitError(err));
    } finally {
      setBusy(false);
    }
  };

  if (doneSlug) {
    return (
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16" role="status">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          Submitted
        </p>
        <h1
          ref={doneHeadingRef}
          tabIndex={-1}
          className="mt-3 font-display text-4xl focus-ring"
        >
          In review
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thanks. A reviewer will look at it before it appears in the
          directory. It is not public while it waits.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/browse">Back to browse</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/submit">Submit another</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <h1 className="font-display text-4xl">
        Submit a site
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Suggest a Valorant tracker, lineup site, overlay, bot, or utility. We
        only list and link — we do not host the tool. No account needed.
        Submissions stay private until a reviewer approves them.
      </p>
      <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            aria-invalid={errorField === "name" || undefined}
            aria-describedby={errorField === "name" ? "submit-error" : undefined}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            type="url"
            placeholder="https://"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            aria-invalid={errorField === "websiteUrl" || undefined}
            aria-describedby={
              errorField === "websiteUrl" ? "submit-error" : undefined
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="desc">Short description</Label>
          <Textarea
            id="desc"
            minLength={12}
            maxLength={220}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            aria-invalid={errorField === "shortDescription" || undefined}
            aria-describedby={
              errorField === "shortDescription"
                ? "desc-hint submit-error"
                : "desc-hint"
            }
          />
          <p id="desc-hint" className="text-xs text-muted-foreground">
            {shortDescription.length}/220 — at least 12 characters, no personal
            info.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(v) => setCategory(v as Category)}
          >
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.slug} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="pricing">Pricing</Label>
          <Select
            value={pricing}
            onValueChange={(v) => setPricing(v as Pricing)}
          >
            <SelectTrigger id="pricing">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICING_OPTIONS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium">Platforms</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_OPTIONS.map((p, i) => {
              const on = platforms.includes(p);
              return (
                <Button
                  key={p}
                  id={i === 0 ? "platforms" : undefined}
                  type="button"
                  size="sm"
                  variant={on ? "default" : "outline"}
                  aria-pressed={on}
                  onClick={() => togglePlatform(p)}
                >
                  {p}
                </Button>
              );
            })}
          </div>
        </fieldset>
        {error ? (
          <p id="submit-error" role="alert" className="text-sm text-primary">
            {error}
          </p>
        ) : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Sending…" : "Submit listing"}
        </Button>
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      </form>
    </main>
  );
}
