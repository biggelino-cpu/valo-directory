#!/usr/bin/env node
/**
 * Download the webfonts into public/fonts/ and print the @font-face rules
 * that belong at the top of src/styles.css.
 *
 * The stylesheet used to @import from fonts.googleapis.com, which transmits
 * every visitor's IP address to Google on page load, before any consent could
 * be given. Serving the files ourselves removes the transfer; the typefaces
 * are unchanged.
 *
 *   node scripts/fetch-fonts.mjs           # writes files, prints the CSS
 *   node scripts/fetch-fonts.mjs --check   # verifies the committed files
 *
 * Only latin and latin-ext are kept — enough for English and German, and it
 * halves the payload against pulling every subset.
 */
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "fonts");
const SUBSETS = new Set(["latin", "latin-ext"]);

const SOURCE =
  "https://fonts.googleapis.com/css2" +
  "?family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap";

// Without a modern browser UA the service answers with ttf instead of woff2.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

if (process.argv.includes("--check")) {
  const files = (await readdir(OUT).catch(() => [])).filter((f) => f.endsWith(".woff2"));
  console.log(`${files.length} font files present in public/fonts`);
  process.exit(files.length > 0 ? 0 : 1);
}

const css = await (await fetch(SOURCE, { headers: { "user-agent": UA } })).text();

// Each @font-face is preceded by a /* subset */ comment naming its coverage.
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[\s\S]*?\})/g)];
await mkdir(OUT, { recursive: true });

const seen = new Map();
const rules = [];

for (const [, subset, block] of blocks) {
  if (!SUBSETS.has(subset)) continue;
  const url = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/.exec(block)[1];

  // A variable font serves several weights from one file; dedupe by source.
  if (!seen.has(url)) {
    const family = /font-family: '([^']+)'/.exec(block)[1].toLowerCase().replace(/\s+/g, "-");
    const name = `${family}-${subset}-${seen.size}.woff2`;
    seen.set(url, name);
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(`${res.status} for ${url}`);
    await writeFile(join(OUT, name), Buffer.from(await res.arrayBuffer()));
  }

  rules.push(block.replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]+\)/, `url("/fonts/${seen.get(url)}")`));
}

console.error(`${seen.size} files written, ${rules.length} @font-face rules\n`);
console.log(rules.join("\n"));
