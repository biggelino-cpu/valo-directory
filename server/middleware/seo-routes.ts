/**
 * Serves /robots.txt and /sitemap.xml.
 *
 * Both are generated per request rather than shipped as static files in
 * public/, because each needs the absolute origin: robots.txt must point at
 * the sitemap with a full URL (a relative path is not valid in that
 * directive), and every sitemap entry has to be absolute. Deriving the origin
 * from the request means these stay correct on preview deployments and on
 * whatever custom domain the site ends up on, without a build-time constant.
 *
 * Registered automatically because vite.config.ts sets `serverDir: "./server"`.
 */
import { CATEGORIES } from "../../src/lib/tools/categories";
import { SEED_TOOLS } from "../../src/lib/tools/seed";

interface SeoEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

/** Static routes worth indexing. /saved, /review and /pending are excluded. */
const STATIC_PATHS: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/browse", priority: "0.9", changefreq: "daily" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
  { path: "/submit", priority: "0.5", changefreq: "monthly" },
  { path: "/impressum", priority: "0.2", changefreq: "yearly" },
  { path: "/datenschutz", priority: "0.2", changefreq: "yearly" },
];

const NOINDEX_PATHS = ["/saved", "/review", "/pending"];

function origin(event: SeoEvent): string {
  const host =
    event.req.headers.get("x-forwarded-host") ??
    event.req.headers.get("host") ??
    event.url.host;
  const proto =
    event.req.headers.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlEntry(
  base: string,
  path: string,
  lastmod?: string,
  changefreq = "weekly",
  priority = "0.7",
): string {
  const mod = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : "";
  return `  <url>
    <loc>${escapeXml(base + path)}</loc>${mod}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

/**
 * Approved community listings live in the database, so they are pulled in
 * alongside the static seed. A database failure must not take the sitemap
 * down — it degrades to the seed catalogue, which is the bulk of it.
 */
async function approvedSlugs(): Promise<{ slug: string; lastmod?: string }[]> {
  try {
    const { getSql } = await import("../../src/lib/db");
    const sql = await getSql();
    const rows = await sql<{ slug: string; created_at: string | Date }>`
      select slug, created_at from submissions where review_status = 'approved'
    `;
    return rows.map((row) => ({
      slug: row.slug,
      lastmod: (typeof row.created_at === "string"
        ? row.created_at
        : row.created_at?.toISOString?.() ?? ""
      ).slice(0, 10),
    }));
  } catch (err) {
    console.error("[valdir] sitemap: approved submissions unavailable", err);
    return [];
  }
}

async function renderSitemap(base: string): Promise<string> {
  const seen = new Set(SEED_TOOLS.map((t) => t.slug));
  const community = (await approvedSlugs()).filter((row) => !seen.has(row.slug));

  const entries = [
    ...STATIC_PATHS.map((s) => urlEntry(base, s.path, undefined, s.changefreq, s.priority)),
    ...CATEGORIES.map((c) =>
      urlEntry(base, `/category/${c.slug}`, undefined, "weekly", "0.8"),
    ),
    ...SEED_TOOLS.map((t) =>
      urlEntry(base, `/tools/${t.slug}`, t.lastVerified, "monthly", "0.7"),
    ),
    ...community.map((row) =>
      urlEntry(base, `/tools/${row.slug}`, row.lastmod, "monthly", "0.6"),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}

function renderRobots(base: string): string {
  return `User-agent: *
Allow: /
${NOINDEX_PATHS.map((p) => `Disallow: ${p}`).join("\n")}

Sitemap: ${base}/sitemap.xml
`;
}

export default async function seoRoutesMiddleware(
  event: SeoEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  if ((event.req.method ?? "GET").toUpperCase() !== "GET") return next();

  const path = event.url.pathname;
  if (path !== "/robots.txt" && path !== "/sitemap.xml") return next();

  const base = origin(event);

  if (path === "/robots.txt") {
    return new Response(renderRobots(base), {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "public, max-age=3600",
      },
    });
  }

  return new Response(await renderSitemap(base), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
