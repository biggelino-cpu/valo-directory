import type { Category } from "./types";

export const CATEGORIES: {
  name: Category;
  slug: string;
  label: string;
  blurb: string;
}[] = [
  {
    name: "Trackers & Stats",
    slug: "trackers-stats",
    label: "Stats",
    blurb: "Rank lookup, match history, leaderboards, and performance breakdowns.",
  },
  {
    name: "Esports & Competitive",
    slug: "esports-competitive",
    label: "Esports",
    blurb: "VCT schedules, pro stats, teams, and match analysis.",
  },
  {
    name: "Lineups & Strategies",
    slug: "lineups-strategies",
    label: "Guides",
    blurb: "Ability lineups, whiteboards, playbooks, and executes.",
  },
  {
    name: "Store, Inventory & Skins",
    slug: "store-inventory-skins",
    label: "Store",
    blurb: "Daily shop checkers, inventories, and skin databases.",
  },
  {
    name: "Crosshairs & Settings",
    slug: "crosshairs-settings",
    label: "Tools",
    blurb: "Crosshair codes, builders, and sensitivity converters.",
  },
  {
    name: "Overlays & Desktop Apps",
    slug: "overlays-desktop",
    label: "Apps",
    blurb: "In-game overlays, Overwolf companions, and desktop apps.",
  },
  {
    name: "Discord Bots & Utilities",
    slug: "discord-bots-utilities",
    label: "Bots",
    blurb: "Discord bots, LFG, randomizers, and helper utilities.",
  },
  {
    name: "Other",
    slug: "other",
    label: "Other",
    blurb: "Community hubs, leaks, and multi-purpose sites.",
  },
];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categorySlug(name: Category) {
  return CATEGORIES.find((c) => c.name === name)?.slug ?? "other";
}

export function categoryLabel(name: Category) {
  return CATEGORIES.find((c) => c.name === name)?.label ?? name;
}
