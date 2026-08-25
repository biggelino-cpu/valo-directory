/**
 * Operator details used by the Privacy Policy and the Terms of Use.
 *
 * The site and its operator are in the United States, so these pages follow
 * US practice: there is no general "imprint" duty as in the EU, but a
 * contactable operator, a DMCA agent and a privacy notice are all worth
 * having — the first two because this site carries user-submitted links, the
 * third because several state laws expect one regardless of company size.
 *
 * Anything still starting with "TODO:" renders on the page as visibly
 * unfinished. That is deliberate: a policy that names a plausible-looking
 * fake address is worse than one that admits it is incomplete.
 */
export const OPERATOR = {
  /** Person or company that runs the site. */
  name: "TODO: Full name or company",
  /** Mailing address. A DMCA agent designation needs a real one. */
  street: "TODO: Street address",
  city: "TODO: City, State ZIP",
  country: "United States",
  /** Primary contact. Also the address for privacy requests. */
  email: "TODO: contact@example.com",
  /** Where copyright complaints go. Often the same mailbox. */
  dmcaEmail: "TODO: contact@example.com",
  /** State whose law governs the Terms, e.g. "the State of California". */
  governingLaw: "TODO: your state",
} as const;

/** Date these texts were last changed in substance. */
export const LEGAL_UPDATED = "2026-08-25";

export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO:");
}
