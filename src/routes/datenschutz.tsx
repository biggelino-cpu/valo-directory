import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/datenschutz")({
  component: DatenschutzPage,
  head: () =>
    seo({
      title: "Datenschutzerklärung",
      description:
        "Welche Daten VALO DIRECTORY verarbeitet: Server-Logs beim Hoster, freiwillige Einreichungen, lokale Speicherung gemerkter Tools. Kein Tracking, keine Analyse-Dienste.",
      path: "/datenschutz",
    }),
});

function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="VALO DIRECTORY ist ein Verzeichnis ohne Nutzerkonten, ohne Tracking und ohne Werbenetzwerke. Diese Seite beschreibt, welche Daten trotzdem anfallen und warum."
      updated={LEGAL_UPDATED}
    >
      <LegalSection heading="1. Verantwortlicher">
        <p>
          Verantwortlich im Sinne der DSGVO ist:
          <br />
          <LegalValue value={OPERATOR.name} />
          <br />
          <LegalValue value={OPERATOR.street} />
          <br />
          <LegalValue value={OPERATOR.city} />
          <br />
          {OPERATOR.country}
          <br />
          E-Mail: <LegalValue value={OPERATOR.email} />
        </p>
        <p>
          Ein Datenschutzbeauftragter ist nicht bestellt; die Voraussetzungen des
          § 38 BDSG liegen nicht vor.
        </p>
      </LegalSection>

      <LegalSection heading="2. Kurzfassung">
        <ul className="list-disc space-y-1 pl-5">
          <li>Keine Analyse-, Tracking- oder Werbe-Dienste.</li>
          <li>Keine Cookies, die eine Einwilligung erfordern — deshalb auch kein Cookie-Banner.</li>
          <li>Kein Nutzerkonto, keine Registrierung, keine Newsletter.</li>
          <li>
            Schriften und die Symbole der gelisteten Seiten liegen auf unserem eigenen
            Server. Beim Aufruf werden dafür keine Anfragen an Dritte ausgelöst.
          </li>
          <li>Was Sie sich merken, bleibt in Ihrem Browser und erreicht uns nie.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Hosting und Server-Logs">
        <p>
          Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723,
          USA, betrieben. Beim Abruf jeder Seite überträgt Ihr Browser technisch
          notwendige Daten, die dort in Server-Protokollen verarbeitet werden:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP-Adresse des anfragenden Geräts,</li>
          <li>Datum und Uhrzeit des Zugriffs,</li>
          <li>aufgerufene Adresse, HTTP-Statuscode und übertragene Datenmenge,</li>
          <li>Browser- und Betriebssystemkennung (User-Agent) sowie ggf. die verweisende Seite.</li>
        </ul>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse
          liegt im sicheren und störungsfreien Betrieb der Website. Die Daten werden
          nicht mit anderen Quellen zusammengeführt und nicht zur Bildung von
          Nutzungsprofilen verwendet.
        </p>
        <p>
          Mit Vercel besteht ein Auftragsverarbeitungsvertrag nach Art. 28 DSGVO. Da die
          Verarbeitung auch in den USA stattfinden kann, stützt sich die Übermittlung auf
          die Standardvertragsklauseln der EU-Kommission nach Art. 46 Abs. 2 lit. c DSGVO
          bzw. auf die Zertifizierung des Anbieters unter dem EU-US Data Privacy Framework.
        </p>
      </LegalSection>

      <LegalSection heading="4. Einreichung eines Projekts">
        <p>
          Über das Formular unter <Link to="/submit" className="focus-ring text-foreground underline underline-offset-4">Submit</Link>{" "}
          können Sie uns ein Projekt vorschlagen. Gespeichert werden ausschließlich die
          Angaben zum Projekt: Name, Adresse der Website, Kategorie, Kurz- und
          Langbeschreibung, Preismodell und unterstützte Plattformen.
        </p>
        <p>
          Wir speichern zu einer Einreichung <strong className="text-foreground">keine
          IP-Adresse, keine Browserkennung und keine E-Mail-Adresse</strong>. Eine
          Einreichung ist damit für uns keiner Person zuzuordnen. Machen Sie in den
          Freitextfeldern freiwillig Angaben zu Ihrer Person, werden diese mitgespeichert —
          wir bitten darum, das zu unterlassen.
        </p>
        <p>
          Rechtsgrundlage für die Verarbeitung der Projektangaben ist Art. 6 Abs. 1 lit. f
          DSGVO (Interesse am Aufbau und an der Pflege des Verzeichnisses). Angenommene
          Einreichungen werden dauerhaft im Verzeichnis veröffentlicht, abgelehnte
          Einreichungen werden entfernt.
        </p>
      </LegalSection>

      <LegalSection heading="5. Gemerkte Tools (lokale Speicherung)">
        <p>
          Wenn Sie einen Eintrag merken, wird dessen Kennung im
          <code className="mx-1 font-mono text-xs">localStorage</code> Ihres Browsers
          abgelegt. Diese Liste verlässt Ihr Gerät nicht und wird von uns weder abgerufen
          noch ausgewertet. Sie können sie jederzeit über die Einstellungen Ihres Browsers
          löschen.
        </p>
        <p>
          Der Zugriff auf diesen Speicher ist nach § 25 Abs. 2 Nr. 2 TDDDG einwilligungsfrei,
          weil er ausschließlich dazu dient, eine von Ihnen ausdrücklich gewünschte Funktion
          bereitzustellen.
        </p>
      </LegalSection>

      <LegalSection heading="6. Externe Verweise">
        <p>
          Der Zweck dieser Seite ist es, auf fremde Angebote zu verweisen. Sobald Sie einem
          solchen Verweis folgen, gelten die Datenschutzbestimmungen des jeweiligen
          Anbieters; auf dessen Verarbeitung haben wir keinen Einfluss. Die auf unserer
          Seite gezeigten Symbole der verlinkten Projekte werden von unserem eigenen Server
          ausgeliefert, sodass allein durch die Anzeige einer Übersicht noch keine
          Verbindung zu diesen Anbietern entsteht.
        </p>
      </LegalSection>

      <LegalSection heading="7. Skript der Betriebsplattform">
        <p>
          Die Website wird auf einer Plattform betrieben, die in jede ausgelieferte Seite
          das Skript <code className="font-mono text-xs">grok.com/grok-app-builder/extensions.js</code>{" "}
          einfügt. Beim Laden dieses Skripts wird Ihre IP-Adresse an den Betreiber dieser
          Domain, die xAI Corp. (USA), übertragen. Das Skript ist nicht Teil unseres
          Quellcodes und dient dem Betrieb der Plattform, nicht der Analyse Ihres
          Verhaltens durch uns. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
          (Bereitstellung der Website über den gewählten Anbieter). Wir arbeiten daran,
          diese Einbindung zu entfernen.
        </p>
      </LegalSection>

      <LegalSection heading="8. Speicherdauer">
        <p>
          Server-Protokolle werden beim Hoster nur kurzzeitig für den technischen Betrieb
          und die Angriffserkennung vorgehalten und anschließend automatisch gelöscht.
          Projektangaben aus Einreichungen speichern wir so lange, wie der Eintrag im
          Verzeichnis geführt wird.
        </p>
      </LegalSection>

      <LegalSection heading="9. Ihre Rechte">
        <p>
          Sie haben nach der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16),
          Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und
          Datenübertragbarkeit (Art. 20) sowie ein Widerspruchsrecht gegen Verarbeitungen
          auf Grundlage berechtigter Interessen (Art. 21). Eine erteilte Einwilligung können
          Sie jederzeit mit Wirkung für die Zukunft widerrufen.
        </p>
        <p>
          Für diese Rechte genügt eine formlose Nachricht an{" "}
          <LegalValue value={OPERATOR.email} />. Bitte beachten Sie, dass wir Zugriffe nicht
          personenbezogen speichern und Sie deshalb in vielen Fällen nicht identifizieren
          können (Art. 11 DSGVO).
        </p>
        <p>
          Unabhängig davon steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu
          (Art. 77 DSGVO), in der Regel bei der Behörde Ihres gewöhnlichen Aufenthaltsorts.
        </p>
      </LegalSection>

      <LegalSection heading="10. Änderungen">
        <p>
          Wir passen diese Erklärung an, sobald sich die tatsächliche Verarbeitung ändert —
          etwa wenn ein weiterer Dienst eingebunden wird. Maßgeblich ist die jeweils hier
          veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
