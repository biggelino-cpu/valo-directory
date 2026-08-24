import { APP_NAME } from "@/lib/brand";
import type { Platform } from "@/lib/tools/types";

/**
 * Absolute origin for canonical URLs, sitemap entries and structured data.
 * VITE_SITE_URL overrides it per environment; the fallback is the host the
 * site is actually served from. It must match that host exactly — the apex
 * 308-redirects to www, so an apex canonical would point every page at a
 * redirect and contradict the sitemap, which derives its host per request.
 */
export const SITE_URL = (
  import.meta.env?.VITE_SITE_URL || "https://www.valodirectory.com"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Titles read best with the brand last; the home page carries its own. */
export function pageTitle(title: string): string {
  return title.includes(APP_NAME) ? title : `${title} — ${APP_NAME}`;
}

/**
 * Search engines truncate around 160 characters. Trim on a word boundary so a
 * generated description never ends mid-word.
 */
export function clampDescription(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, "")}…`;
}

type SeoOptions = {
  title: string;
  description: string;
  /** Path of the page itself, used for the canonical link. */
  path?: string;
  /** Utility pages that must stay out of the index. */
  noindex?: boolean;
};

/**
 * Head fragment for a route.
 *
 * Deliberately omits og:* and twitter:* — the platform PWA middleware
 * (server/middleware/grok-pwa.ts) strips share meta from the document and
 * re-injects its own, so per-page values set here would be discarded. Share
 * card identity is configured through src/lib/og/site.json instead.
 */
export function seo({ title, description, path, noindex }: SeoOptions) {
  const meta: Array<Record<string, string>> = [
    { title: pageTitle(title) },
    { name: "description", content: clampDescription(description) },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });

  const links = path ? [{ rel: "canonical", href: absoluteUrl(path) }] : [];
  return { meta, links };
}

/** Inline JSON-LD, shaped for a TanStack `head().scripts` entry. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** schema.org `operatingSystem` expects platform names, not our internal slugs. */
const PLATFORM_OS: Record<Platform, string> = {
  web: "Web",
  desktop: "Windows, macOS",
  overwolf: "Windows",
  mobile: "Android, iOS",
  discord: "Discord",
  "browser-extension": "Web",
};

export function platformLabel(platform: Platform): string {
  return PLATFORM_OS[platform] ?? "Web";
}
