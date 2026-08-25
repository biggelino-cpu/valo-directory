import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { DISCLAIMER } from "@/lib/brand";
import { LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/impressum")({
  component: ImpressumPage,
  head: () =>
    seo({
      title: "Impressum",
      description:
        "Anbieterkennzeichnung nach § 5 DDG für VALO DIRECTORY — Betreiber, Anschrift und Kontakt.",
      path: "/impressum",
    }),
});

function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Angaben gemäß § 5 DDG (bis 2024: § 5 TMG)."
      updated={LEGAL_UPDATED}
    >
      <LegalSection heading="Diensteanbieter">
        <p>
          <LegalValue value={OPERATOR.name} />
          <br />
          <LegalValue value={OPERATOR.street} />
          <br />
          <LegalValue value={OPERATOR.city} />
          <br />
          {OPERATOR.country}
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          E-Mail: <LegalValue value={OPERATOR.email} />
          {OPERATOR.phone ? (
            <>
              <br />
              Telefon: {OPERATOR.phone}
            </>
          ) : null}
        </p>
      </LegalSection>

      {OPERATOR.vatId ? (
        <LegalSection heading="Umsatzsteuer-Identifikationsnummer">
          <p>Gemäß § 27 a UStG: {OPERATOR.vatId}</p>
        </LegalSection>
      ) : null}

      <LegalSection heading="Verantwortlich für den Inhalt">
        <p>
          <LegalValue value={OPERATOR.name} />, Anschrift wie oben.
        </p>
      </LegalSection>

      <LegalSection heading="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungs&shy;verfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection heading="Haftung für Links">
        <p>
          VALO DIRECTORY ist ein Verzeichnis: Der wesentliche Inhalt dieser Seite
          besteht aus Verweisen auf fremde Websites. Auf deren Inhalte haben wir
          keinen Einfluss und übernehmen dafür keine Gewähr. Für die Inhalte der
          verlinkten Seiten ist stets deren jeweiliger Anbieter verantwortlich.
          Die verlinkten Seiten wurden zum Zeitpunkt der Aufnahme auf offensichtliche
          Rechtsverstöße geprüft; jeder Eintrag trägt sichtbar das Datum der letzten
          Prüfung. Bei Bekanntwerden von Rechtsverletzungen entfernen wir den
          betreffenden Eintrag umgehend.
        </p>
      </LegalSection>

      <LegalSection heading="Urheberrecht und Marken">
        <p>
          Namen, Logos und Screenshots der gelisteten Projekte gehören ihren jeweiligen
          Inhabern und werden hier ausschließlich zur Kennzeichnung des jeweiligen
          Angebots verwendet.
        </p>
        <p className="font-mono text-xs">{DISCLAIMER}</p>
      </LegalSection>
    </LegalPage>
  );
}
