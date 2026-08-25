/**
 * Contact details for the Privacy Policy and the Terms.
 *
 * There is deliberately no postal address here. US law has no equivalent of
 * the German § 5 DDG imprint duty: a website is not obliged to publish who
 * runs it or where they live. The one exception is the DMCA agent below, and
 * that is opt-in.
 */
export const OPERATOR = {
  /** The single contact address. Also where privacy requests go. */
  email: "TODO: contact@example.com",
} as const;

/**
 * Designated agent for copyright complaints.
 *
 * Safe harbour under 17 U.S.C. § 512(c) is conditional: the agent's name,
 * address, phone number and email must be posted publicly here *and*
 * registered with the US Copyright Office (dmca.copyright.gov, ~$6, renewed
 * every three years). That publication is the only reason this site would
 * ever carry a postal address — so it is a genuine trade-off, not a formality.
 * A PO box or virtual mailbox satisfies it.
 *
 * Leave this null and the Terms simply invite copyright complaints by email
 * without claiming a safe harbour we have not earned. Fill it in and the full
 * § 512 procedure appears.
 */
export const DMCA_AGENT: {
  name: string;
  address: string;
  phone: string;
  email: string;
} | null = null;

/** Date these texts were last changed in substance. */
export const LEGAL_UPDATED = "2026-08-25";

export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO:");
}
