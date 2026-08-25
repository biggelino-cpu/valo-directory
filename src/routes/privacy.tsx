import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

/**
 * Kept to what California's privacy law actually asks a site like this to
 * disclose (Cal. Bus. & Prof. Code § 22575): the categories collected, who
 * else sees them, how to ask about them, how changes are announced, an
 * effective date, and a Do Not Track statement — plus a line on children.
 *
 * Everything else that a template would add is left out on purpose. We are
 * far below the CCPA's thresholds, so reciting its rights would describe
 * obligations we do not have; and since there is no account, no analytics and
 * no advertising, most of a standard policy would be describing an absence.
 */
export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () =>
    seo({
      title: "Privacy Policy",
      description:
        "What VALO DIRECTORY collects: server logs at our host, the project details you submit, and a list of saved tools that stays in your browser. No analytics, no advertising, no accounts.",
      path: "/privacy",
    }),
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="VALO DIRECTORY is a catalog of links, run from the United States. There are no accounts, no advertising and no analytics, so there is very little to collect."
      updated={LEGAL_UPDATED}
    >
      <LegalSection heading="What we collect">
        <p>
          <strong className="text-foreground">Server logs.</strong> Our host, Vercel Inc.,
          records each request the way any web server does: the IP address, the time, the
          page requested, the response status, your browser and operating system string, and
          the referring page if your browser sends one. These keep the site running and help
          spot abuse. We do not build profiles from them or try to work out who you are.
        </p>
        <p>
          <strong className="text-foreground">Submitted projects.</strong> If you suggest a
          project through{" "}
          <Link to="/submit" className="focus-ring text-foreground underline underline-offset-4">
            Submit
          </Link>
          , we store what you typed about the project — its name, address, category,
          descriptions, pricing and platforms. A submission carries no IP address, no browser
          string and no email address, so we cannot connect one to a person. Please don&rsquo;t
          type personal details into the free-text fields.
        </p>
        <p>
          <strong className="text-foreground">Saved tools.</strong> Saving a listing writes
          its identifier to your browser&rsquo;s{" "}
          <code className="font-mono text-xs">localStorage</code>. That list never leaves your
          device and we cannot read it. Clearing your site data removes it.
        </p>
      </LegalSection>

      <LegalSection heading="Who else sees anything">
        <p>
          <strong className="text-foreground">Vercel Inc.</strong> hosts the site and
          therefore holds the server logs above.{" "}
          <strong className="text-foreground">xAI Corp.</strong> receives your IP address
          because the platform this site is built on injects{" "}
          <code className="font-mono text-xs">grok.com/grok-app-builder/extensions.js</code>{" "}
          into every page; it is not part of our code and we are working on removing it.
          Nobody else receives anything.
        </p>
        <p>
          We do not sell your personal information and do not share it for advertising. There
          are no ad networks, no analytics and no trackers on this site. Fonts and the icons
          of listed projects are served from our own servers, so loading a page contacts no
          one else. Following a link to another project, of course, hands you over to that
          site&rsquo;s own practices.
        </p>
        <p>
          Because nothing is sold or shared, a Do Not Track or Global Privacy Control signal
          has nothing to act on here. We do not respond to them differently.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          This site is not directed to children under 13 and we do not knowingly collect
          personal information from them.
        </p>
      </LegalSection>

      <LegalSection heading="Questions and requests">
        <p>
          Write to <LegalValue value={OPERATOR.email} /> to ask what we hold about you, or to
          have something corrected or deleted. Two honest caveats: we hold almost nothing,
          and because submissions carry no identifiers we usually cannot tell which log
          lines, if any, are yours.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          If what we collect changes, we update this page and the date below. There is no
          mailing list to notify, so the current version is always the one published here.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
