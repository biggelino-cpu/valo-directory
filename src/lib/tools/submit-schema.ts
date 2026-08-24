import { z } from "zod";
import { CATEGORIES } from "./categories";
import {
  PLATFORM_OPTIONS,
  PRICING_OPTIONS,
  type Category,
  type Platform,
  type Pricing,
} from "./types";

const CATEGORY_NAMES = CATEGORIES.map((c) => c.name) as [Category, ...Category[]];

export const submitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name needs at least 2 characters.")
    .max(80, "Name is too long."),
  websiteUrl: z
    .string()
    .trim()
    .min(8, "Enter a valid http(s) URL.")
    .max(300, "URL is too long."),
  shortDescription: z
    .string()
    .trim()
    .min(12, "Description needs at least 12 characters.")
    .max(220, "Description is too long."),
  category: z.enum(CATEGORY_NAMES, {
    error: "Pick a category.",
  }),
  pricing: z.enum(PRICING_OPTIONS as unknown as [string, ...string[]], {
    error: "Pick a pricing type.",
  }),
  platforms: z
    .array(z.enum(PLATFORM_OPTIONS as unknown as [string, ...string[]]))
    .min(1, "Pick at least one platform.")
    .max(6),
});

export type SubmitInput = {
  name: string;
  websiteUrl: string;
  shortDescription: string;
  category: Category;
  pricing: Pricing;
  platforms: Platform[];
};

export function formatSubmitError(err: unknown): string {
  if (err && typeof err === "object" && "issues" in err) {
    const issues = (err as { issues?: { message?: string }[] }).issues;
    if (issues?.[0]?.message) return issues[0].message;
  }
  if (err instanceof Error && err.message) {
    const m = err.message;
    if (m.toLowerCase().includes("shortDescription") || m.includes("Too small")) {
      return "Description needs at least 12 characters.";
    }
    if (m.length > 8 && m.length < 180 && !m.includes("Failed to fetch")) {
      return m;
    }
  }
  return "Could not send the listing. Try again in a moment.";
}

export type SubmitField = keyof SubmitInput;

/** The DOM id of the control each field is rendered as, for focus and aria wiring. */
export const SUBMIT_FIELD_IDS: Record<SubmitField, string> = {
  name: "name",
  websiteUrl: "url",
  shortDescription: "desc",
  category: "category",
  pricing: "pricing",
  platforms: "platforms",
};

export type SubmitValidationError = {
  field: SubmitField | null;
  message: string;
};

export function validateSubmitInput(
  data: SubmitInput,
): SubmitValidationError | null {
  const parsed = submitSchema.safeParse(data);
  if (parsed.success) return null;
  const issue = parsed.error.issues[0];
  const key = issue?.path[0];
  return {
    field:
      typeof key === "string" && key in SUBMIT_FIELD_IDS
        ? (key as SubmitField)
        : null,
    message: issue?.message ?? "Check the form and try again.",
  };
}
