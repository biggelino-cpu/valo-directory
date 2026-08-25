#!/usr/bin/env node
/**
 * Fetch a favicon for every catalogue listing into public/favicons/<slug>.png.
 *
 * The list used to load icons straight from Google's favicon service in the
 * browser, which meant every visitor's IP address reached Google once per
 * listing — about twenty times per page view, on load, before any consent
 * could be given. Fetching them here instead means the browser only ever
 * talks to our own origin.
 *
 * Run it after adding listings:  node scripts/fetch-favicons.mjs
 * Icons are committed, so a build needs no network access.
 *
 * Google answers with a generic grey placeholder for domains it has no icon
 * for. Those are detected and skipped so the listing falls back to its
 * monogram rather than showing someone else's placeholder.
 */
import { mkdir, writeFile, readFile, readdir, unlink } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "favicons");
const SIZE = 64;

/** Pull slug + websiteUrl straight out of the seed module's source. */
async function listings() {
  const src = await readFile(join(ROOT, "src/lib/tools/seed.ts"), "utf8");
  const out = [];
  const re = /slug:\s*"([^"]+)"[\s\S]*?websiteUrl:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src))) out.push({ slug: m[1], url: m[2] });
  return out;
}

function serviceUrl(site) {
  return `https://www.google.com/s2/favicons?sz=${SIZE}&domain=${new URL(site).hostname}`;
}

/**
 * Icons the site itself declares, best first. A site's own mark is the
 * authoritative one; the third-party service only ever has a copy, and for
 * newer domains it answers with a generic placeholder instead.
 */
async function declaredIcons(site) {
  const out = [];
  try {
    const { buf } = await get(site);
    const html = buf.toString("utf8").slice(0, 200_000);
    const links = html.matchAll(/<link\s[^>]*rel=["']?[^"'>]*icon[^"'>]*["']?[^>]*>/gi);
    for (const [tag] of links) {
      const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
      if (href) out.push(new URL(href, site).href);
    }
  } catch {
    /* unreachable or not HTML — the conventional path below still applies */
  }
  out.push(new URL("/favicon.ico", site).href);
  return out;
}

async function get(url, { allowError = false } = {}) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 (compatible; valo-directory favicon fetcher)" },
  });
  // The placeholder body arrives with a 404, and that body is the fingerprint
  // we need — so errors are readable on request.
  if (!res.ok && !allowError) throw new Error(`HTTP ${res.status}`);
  return {
    buf: Buffer.from(await res.arrayBuffer()),
    type: res.headers.get("content-type") ?? "",
    ok: res.ok,
  };
}

function extensionFor(buf) {
  if (buf.subarray(0, 8).toString("binary") === "\x89PNG\r\n\x1a\n") return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1) return "ico";
  return null;
}

/** Google answers in PNG or JPEG depending on the source icon. */
function imageSize(buf) {
  if (buf.subarray(0, 8).toString("binary") === "\x89PNG\r\n\x1a\n") {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // ICO: the first directory entry carries the dimensions (0 means 256).
  if (buf.length > 22 && buf.readUInt16LE(0) === 0 && buf.readUInt16LE(2) === 1) {
    return { w: buf[6] || 256, h: buf[7] || 256 };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    // Walk the JPEG marker chain to the start-of-frame, which carries the size.
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return null;
}

const args = new Set(process.argv.slice(2));
const only = [...args].find((a) => !a.startsWith("--"));

const placeholders = new Set();
// Real-looking but unregistered hostnames: the service answers these with its
// own fallback icon, which is exactly the fingerprint we want to recognise.
for (const probe of [
  "definitely-not-a-real-domain-xyz123.com",
  "another-nonexistent-domain-abc987.com",
]) {
  try {
    const { buf } = await get(serviceUrl(`https://${probe}`), { allowError: true });
    if (buf.length) placeholders.add(buf.toString("base64"));
  } catch {
    /* a probe failing just means one fewer fingerprint */
  }
}
console.log(`Placeholder fingerprints: ${placeholders.size}`);

await mkdir(OUT, { recursive: true });
const all = await listings();
const targets = only ? all.filter((t) => t.slug === only) : all;
const kept = [];
const skipped = [];
const manifest = new Map();

for (const { slug, url } of targets) {
  const usable = (buf) => {
    if (!buf.length || placeholders.has(buf.toString("base64"))) return false;
    // SVG is refused on purpose. It can carry script, and serving a third
    // party's SVG from our own origin would make that script same-origin for
    // anyone who opens the file directly. Those listings fall back to the
    // next declared icon, or to their monogram.
    const head = buf.subarray(0, 300).toString("utf8");
    if (head.includes("<svg") || head.includes("<?xml")) return false;
    const size = imageSize(buf);
    // Google upscales real icons to the size asked for; anything smaller is
    // its own fallback rather than the site's own mark.
    return Boolean(size && size.w >= 32);
  };

  // Site's own declarations first, the service only as a fallback.
  const sources = [
    ...(await declaredIcons(url)).map((href) => ["site", href]),
    ["service", serviceUrl(url)],
  ];

  let saved = false;
  let why = "no usable icon";
  for (const [source, href] of sources) {
    try {
      const { buf } = await get(href);
      if (!usable(buf)) {
        why = "placeholder or too small";
        continue;
      }
      // The extension decides the Content-Type the host serves, so it has to
      // match what the bytes actually are.
      const ext = extensionFor(buf);
      if (!ext) {
        why = "unrecognised format";
        continue;
      }
      await writeFile(join(OUT, `${slug}.${ext}`), buf);
      manifest.set(slug, `/favicons/${slug}.${ext}`);
      kept.push(source === "site" ? `${slug}*` : slug);
      saved = true;
      break;
    } catch (err) {
      why = err.message;
    }
  }
  if (!saved) skipped.push(`${slug} (${why})`);
}

// Drop icons for listings that no longer exist.
if (!only) {
  const slugs = new Set(all.map((t) => t.slug));
  for (const file of await readdir(OUT)) {
    if (!slugs.has(file.replace(/\.[a-z]+$/, ""))) {
      await unlink(join(OUT, file));
      console.log(`removed stale ${file}`);
    }
  }

  // A generated map, so the component knows which listings have an icon and
  // under which extension — without probing at runtime.
  const entries = [...manifest].sort(([a], [b]) => a.localeCompare(b));
  await writeFile(
    join(ROOT, "src/lib/tools/favicons.ts"),
    "// GENERATED by scripts/fetch-favicons.mjs — do not edit by hand.\n" +
      "// Listings absent from this map fall back to their monogram.\n" +
      "export const FAVICONS: Record<string, string> = {\n" +
      entries.map(([slug, href]) => `  ${JSON.stringify(slug)}: ${JSON.stringify(href)},`).join("\n") +
      "\n};\n",
  );
  console.log(`manifest: ${entries.length} entries`);
}

console.log(`\n${kept.length} saved (* = from the site itself), ${skipped.length} without an icon`);
if (skipped.length) console.log("  " + skipped.join("\n  "));
