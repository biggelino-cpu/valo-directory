import type { Tool } from "./types";

/**
 * The catalogue is presented in a random order, on purpose.
 *
 * Nothing in a listing's data can carry a fair ranking: every entry is
 * `status: "active"`, `lastVerified` ties across most of the catalogue, and a
 * feature count measures how much was written about a tool rather than how
 * good it is. A weighted score over those fields would look objective and mean
 * nothing — worse than random, because it launders an arbitrary order as data.
 * Ranking by outbound clicks would be worse still: whatever sits at the top
 * gets clicked, and would therefore stay at the top.
 *
 * So the order is shuffled, and the site says so.
 *
 * The shuffle is seeded by the UTC date rather than being drawn per request:
 * a fresh draw on every render would disagree between the server and the
 * client and break hydration, would stop anyone finding a listing again, and
 * would hand search engines different content on every crawl. Seeded by the
 * day, the order is stable while someone is using the site and rotates
 * overnight, so no listing keeps the first position.
 */

/** UTC day, so the rotation happens at one moment worldwide. */
export function dailySeed(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, and good enough for shuffling a list. */
function rng(state: number): () => number {
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates against a seeded generator. Same seed, same order — which is
 * what lets the server and the client agree without passing the result down.
 */
export function shuffleTools(tools: Tool[], seed: string): Tool[] {
  const out = [...tools];
  const next = rng(hashSeed(seed));
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
