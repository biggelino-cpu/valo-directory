/**
 * Angaben für Impressum (§ 5 DDG) und Datenschutzerklärung (Art. 13 DSGVO).
 *
 * Diese Werte müssen vom Betreiber ausgefüllt werden, bevor die Seite breit
 * geteilt wird. Alles, was hier noch mit "TODO:" beginnt, wird auf den
 * Rechtsseiten sichtbar als offen markiert — bewusst, damit ein unfertiges
 * Impressum nicht wie ein fertiges aussieht.
 */
export const OPERATOR = {
  /** Vor- und Nachname bzw. Firmenname des Diensteanbieters. */
  name: "TODO: Vor- und Nachname",
  /** Ladungsfähige Anschrift — ein Postfach genügt nach § 5 DDG nicht. */
  street: "TODO: Straße und Hausnummer",
  city: "TODO: PLZ und Ort",
  country: "Deutschland",
  /** E-Mail ist Pflicht; eine zweite schnelle Kontaktmöglichkeit ist empfohlen. */
  email: "TODO: kontakt@example.com",
  /** Optional: Telefonnummer, USt-IdNr., Registereintrag. Leer lassen, wenn nicht zutreffend. */
  phone: "",
  vatId: "",
} as const;

/** Datum der letzten inhaltlichen Änderung dieser Texte. */
export const LEGAL_UPDATED = "2026-08-25";

export function isPlaceholder(value: string): boolean {
  return value.startsWith("TODO:");
}
