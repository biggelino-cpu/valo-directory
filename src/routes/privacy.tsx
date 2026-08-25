import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

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
      intro="VALO DIRECTORY is a catalog of links. There are no accounts, no advertising and no analytics, so there is very little to collect. This page describes what still gets recorded and why."
      updated={LEGAL_UPDATED}
    >
      <LegalSection heading="The short version">
        <ul className="list-disc space-y-1 pl-5">
          <li>No analytics, tracking pixels, advertising or data brokers.</li>
          <li>No cookies that require consent — which is why there is no cookie banner.</li>
          <li>No accounts, no sign-up, no newsletter.</li>
          <li>We never sell or share your personal information, under any definition of those words.</li>
          <li>
            Fonts and the icons of listed sites are served from our own servers, so simply
            loading a page does not contact anyone else.
          </li>
          <li>The tools you save stay in your browser and never reach us.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Who runs this site">
        <p>
          <LegalValue value={OPERATOR.name} />
          <br />
          <LegalValue value={OPERATOR.street} />
          <br />
          <LegalValue value={OPERATOR.city} />
          <br />
          {OPERATOR.country}
          <br />
          Contact: <LegalValue value={OPERATOR.email} />
        </p>
        <p>
          The site is operated from and hosted in the United States. If you use it from
          elsewhere, your information is processed in the US.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect">
        <p className="font-label text-foreground">Server logs</p>
        <p>
          The site is hosted by Vercel Inc. (Covina, California), and requests are served
          from its US East region. Like any web server, it records each request: the IP
          address it came from, the date and time, the address requested, the response
          status and size, the browser and operating system string, and the referring page
          if your browser sends one.
        </p>
        <p>
          These logs exist to keep the site running and to spot abuse. We do not use them
          to build profiles, we do not combine them with anything else, and we do not try
          to work out who you are from them.
        </p>

        <p className="pt-2 font-label text-foreground">Submitted projects</p>
        <p>
          If you suggest a project through{" "}
          <Link to="/submit" className="focus-ring text-foreground underline underline-offset-4">
            Submit
          </Link>
          , we store what you typed about the project: its name, website address, category,
          short and long description, pricing model and supported platforms.
        </p>
        <p>
          A submission carries{" "}
          <strong className="text-foreground">
            no IP address, no browser string and no email address
          </strong>
          . We have no way to connect one to a person. If you volunteer personal details in
          a free-text field, they are stored with the rest — please do not.
        </p>

        <p className="pt-2 font-label text-foreground">Saved tools</p>
        <p>
          Saving a listing writes its identifier to your browser&rsquo;s{" "}
          <code className="font-mono text-xs">localStorage</code>. That list never leaves
          your device and we cannot read it. Clearing your browser&rsquo;s site data
          removes it.
        </p>
      </LegalSection>

      <LegalSection heading="What we don't do">
        <p>
          We do not sell your personal information, and we do not share it for cross-context
          behavioural advertising — the two things California&rsquo;s privacy law is mainly
          concerned with. We run no advertising of any kind, and we have never done either
          of these things. There is no revenue arrangement behind any listing, including the
          three highlighted picks on the home page.
        </p>
        <p>
          Because we do not sell or share, there is nothing for a Global Privacy Control
          signal to opt you out of.
        </p>
      </LegalSection>

      <LegalSection heading="Who else is involved">
        <p>
          <strong className="text-foreground">Vercel Inc.</strong> hosts the site and
          therefore processes the server logs described above, under its own privacy terms
          and a data processing agreement with us.
        </p>
        <p>
          <strong className="text-foreground">xAI Corp.</strong> — the platform this site is
          built on injects the script{" "}
          <code className="font-mono text-xs">grok.com/grok-app-builder/extensions.js</code>{" "}
          into every page it serves. Loading it sends your IP address to that domain. The
          script is not part of our source code and is not something we use to observe you.
          We are working on removing it.
        </p>
        <p>Nobody else receives anything.</p>
      </LegalSection>

      <LegalSection heading="Links to other sites">
        <p>
          Sending you to other people&rsquo;s projects is the entire point of this
          directory. Once you follow a link, that site&rsquo;s own privacy practices apply
          and we have no visibility into or control over them. The icons we show for listed
          projects are copies served from our servers, so browsing the catalog does not
          announce you to any of them.
        </p>
      </LegalSection>

      <LegalSection heading="Children">
        <p>
          This site is not directed to children under 13 and we do not knowingly collect
          personal information from them. If you believe a child has sent us personal
          information through the submission form, write to{" "}
          <LegalValue value={OPERATOR.email} /> and we will delete it.
        </p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          Depending on where you live — California, Colorado, Connecticut, Texas, Virginia
          and a growing number of other states — you may have the right to know what
          personal information a business holds about you, to have it corrected or deleted,
          to receive a copy, to opt out of its sale or of targeted advertising, and not to
          be treated worse for exercising any of that.
        </p>
        <p>
          You are welcome to exercise these rights here regardless of your state, by writing
          to <LegalValue value={OPERATOR.email} />. Two honest caveats: we hold almost
          nothing about you, and because we do not record identifiers alongside submissions
          we usually cannot tell which log lines, if any, are yours. Where we cannot verify
          a request without collecting more information about you than we already have, we
          will say so rather than ask for it.
        </p>
      </LegalSection>

      <LegalSection heading="Visitors from the EU and UK">
        <p>
          This is a US site aimed at a general audience, not a service directed at the
          European market. If you visit from the EU or the UK, the processing described
          above still applies and your information is handled in the United States. You can
          use the same contact address for any request about your data.
        </p>
      </LegalSection>

      <LegalSection heading="Retention and security">
        <p>
          Server logs are kept only briefly by our host for operational and security
          purposes and then discarded. Project details from submissions are kept for as long
          as the listing remains in the catalog. The site is served over HTTPS.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We will update this page whenever the actual processing changes — for example if a
          new service is added. The version published here is the current one, and its date
          is at the bottom.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
