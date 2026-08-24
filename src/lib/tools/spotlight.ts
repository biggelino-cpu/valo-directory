import type { SpotlightSlot, Tool } from "./types";

export type Spotlight = {
  slot: SpotlightSlot;
  label: string;
  /** Why this slot exists, shown to no one — it keeps the labels honest. */
  intent: string;
  tool: Tool;
};

const SLOTS: { slot: SpotlightSlot; label: string; intent: string }[] = [
  {
    slot: "editors",
    label: "Editor's pick",
    intent: "The one listing to open if you only open one. Changes rarely.",
  },
  {
    slot: "weekly",
    label: "Weekly feature",
    intent: "Rotates. Set it by hand, or leave it and it cycles each week.",
  },
  {
    slot: "gem",
    label: "Hidden gem",
    intent: "Something good that the big names crowd out.",
  },
];

/**
 * ISO-ish week index. Only needs to be stable within a week and to advance by
 * one each week — not to match any calendar authority.
 */
function weekIndex(now: Date): number {
  return Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
}

/**
 * Resolve the three spotlight slots.
 *
 * A tool tagged with a slot in the catalogue wins it outright. Any slot left
 * untagged is filled from the featured pool so the row is never short a card:
 * "weekly" advances through that pool once a week, the others take the first
 * unclaimed listing. Every slot resolves to a different tool.
 *
 * `now` is injected so the caller resolves this once on the server and hands
 * the result down — computing it in the component would risk the server and
 * client landing on opposite sides of a week boundary.
 */
export function resolveSpotlights(tools: Tool[], now: Date = new Date()): Spotlight[] {
  const taken = new Set<string>();
  const claim = (tool: Tool | undefined) => {
    if (!tool || taken.has(tool.id)) return undefined;
    taken.add(tool.id);
    return tool;
  };

  // Explicit designations first, so an automatic fill can never steal one.
  const designated = new Map<SpotlightSlot, Tool>();
  for (const { slot } of SLOTS) {
    const match = tools.find((t) => t.spotlight === slot && t.reviewStatus !== "pending");
    if (match) designated.set(slot, match);
  }
  for (const tool of designated.values()) taken.add(tool.id);

  const pool = tools.filter(
    (t) => t.featured && t.reviewStatus !== "pending" && !taken.has(t.id),
  );
  let nextFree = 0;

  const out: Spotlight[] = [];
  for (const { slot, label, intent } of SLOTS) {
    let tool = designated.get(slot);

    if (!tool && pool.length > 0) {
      if (slot === "weekly") {
        tool = claim(pool[weekIndex(now) % pool.length]);
      }
      // Either a non-rotating slot, or the rotation landed on a taken tool.
      while (!tool && nextFree < pool.length) {
        tool = claim(pool[nextFree++]);
      }
    }

    if (tool) out.push({ slot, label, intent, tool });
  }
  return out;
}
