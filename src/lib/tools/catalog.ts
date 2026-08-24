import { SEED_TOOLS } from "./seed";
import type {
  Category,
  Platform,
  Pricing,
  Tool,
  ToolStatus,
} from "./types";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type SubmissionRow = {
  id: string;
  slug: string;
  name: string;
  website_url: string;
  category: string;
  short_description: string;
  description: string;
  platforms: string;
  pricing: string;
  review_status: string;
  created_at: string | Date;
};

export function slugify(name: string): string {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56);
  return s || "tool";
}

export function normalizeUrl(raw: string): string {
  const u = new URL(raw);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Only http(s) URLs are allowed.");
  }
  u.hash = "";
  u.hostname = u.hostname.toLowerCase();
  let href = u.toString();
  if (href.endsWith("/") && u.pathname === "/") href = href.slice(0, -1);
  return href;
}

export function seedHasUrl(url: string): boolean {
  const target = url.toLowerCase().replace(/\/$/, "");
  return SEED_TOOLS.some(
    (t) => t.websiteUrl.toLowerCase().replace(/\/$/, "") === target,
  );
}

export function seedHasSlug(slug: string): boolean {
  return SEED_TOOLS.some((t) => t.slug === slug);
}

export function rowToTool(row: SubmissionRow): Tool {
  let platforms: Platform[] = ["web"];
  try {
    const parsed = JSON.parse(row.platforms) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0) {
      platforms = parsed as Platform[];
    }
  } catch {
    platforms = ["web"];
  }
  const created =
    typeof row.created_at === "string"
      ? row.created_at
      : row.created_at?.toISOString?.() ?? "";
  const reviewStatus = row.review_status as ReviewStatus;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description || row.short_description,
    websiteUrl: row.website_url,
    category: row.category as Category,
    tags: ["community-submitted"],
    platforms,
    pricing: row.pricing as Pricing,
    status: (reviewStatus === "approved" ? "active" : "unknown") as ToolStatus,
    lastVerified: created.slice(0, 10),
    features: [],
    featured: false,
    community: true,
    reviewStatus,
  };
}

export function mergeCatalog(approved: Tool[]): Tool[] {
  const slugs = new Set(SEED_TOOLS.map((t) => t.slug));
  const extra = approved.filter((t) => !slugs.has(t.slug));
  return [...SEED_TOOLS, ...extra];
}
