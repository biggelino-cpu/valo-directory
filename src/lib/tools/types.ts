export type Pricing = "free" | "freemium" | "paid" | "donation";
export type ToolStatus = "active" | "outdated" | "abandoned" | "unknown";

export type Platform =
  | "web"
  | "desktop"
  | "overwolf"
  | "mobile"
  | "discord"
  | "browser-extension";

export type Category =
  | "Trackers & Stats"
  | "Esports & Competitive"
  | "Lineups & Strategies"
  | "Store, Inventory & Skins"
  | "Crosshairs & Settings"
  | "Overlays & Desktop Apps"
  | "Discord Bots & Utilities"
  | "Other";

/**
 * Home-page spotlight slots. A tool carries at most one; the slots are an
 * editorial decision, not something derived from the data — lastVerified ties
 * across most of the catalogue and would not discriminate.
 */
export type SpotlightSlot = "editors" | "weekly" | "gem";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  websiteUrl: string;
  category: Category;
  tags: string[];
  platforms: Platform[];
  pricing: Pricing;
  status: ToolStatus;
  lastVerified: string;
  features: string[];
  safetyNotes?: string;
  featured: boolean;
  spotlight?: SpotlightSlot;
  community?: boolean;
  reviewStatus?: "pending" | "approved" | "rejected";
}

export const PRICING_OPTIONS: Pricing[] = [
  "free",
  "freemium",
  "paid",
  "donation",
];

export const PLATFORM_OPTIONS: Platform[] = [
  "web",
  "desktop",
  "overwolf",
  "mobile",
  "discord",
  "browser-extension",
];

export const STATUS_OPTIONS: ToolStatus[] = [
  "active",
  "outdated",
  "abandoned",
  "unknown",
];
