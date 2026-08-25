import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { DISCLAIMER } from "@/lib/brand";
import { LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () =>
    seo({
      title: "Terms of Use",
      description:
        "Who operates VALO DIRECTORY, what the catalog is and isn't, how to submit a project, and how to report a copyright or trademark problem.",
      path: "/terms",
    }),
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro="Plain terms for a catalog of links. Using the site means you accept them."
      updated={LEGAL_UPDATED}
    >
      <LegalSection heading="Who operates this site">
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
      </LegalSection>

      <LegalSection heading="What this site is">
        <p>
          VALO DIRECTORY is an independent catalog of third-party tools and sites related to
          VALORANT. We do not host, distribute, operate or control any of the listed
          projects. Every entry is a description and a link; the project itself belongs to
          someone else and is governed by their terms.
        </p>
        <p>
          Listing something is not an endorsement, a security review or a guarantee that it
          works or is safe. Some listed utilities may conflict with Riot Games&rsquo; terms
          of service; we catalog them so you can find them, and what you do with them is
          your decision. Check any project yourself before trusting it with your account,
          enable multi-factor authentication, and never enter your Riot password on a site
          you do not trust.
        </p>
        <p>
          Each entry shows the date we last checked it. Between checks, projects change
          hands, go stale or disappear, and we may not have noticed yet.
        </p>
      </LegalSection>

      <LegalSection heading="How entries are ordered">
        <p>
          The catalog is shown in a random order that reshuffles daily, so position carries
          no meaning and no one can buy a better one. The highlighted picks on the home page
          are our own editorial choices and are labelled as such. Nobody pays for placement,
          and no listing is affiliate-linked.{" "}
          <Link to="/about" className="focus-ring text-foreground underline underline-offset-4">
            More about how we pick and order listings
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Submitting a project">
        <p>
          Anyone can suggest a project. By submitting, you confirm that the information is
          accurate to the best of your knowledge and that you have the right to send it, and
          you allow us to publish, edit and shorten it as part of the catalog. We review
          every submission and may reject or remove one for any reason.
        </p>
        <p>
          Do not submit personal information, anyone else&rsquo;s private material, malware,
          phishing pages, cheat software, or anything that infringes someone&rsquo;s rights.
        </p>
      </LegalSection>

      <LegalSection heading="Copyright complaints (DMCA)">
        <p>
          Entries are short factual descriptions of publicly available projects, but if you
          believe material here infringes your copyright, send a notice under 17 U.S.C.
          § 512(c) to <LegalValue value={OPERATOR.dmcaEmail} /> including: your signature
          (electronic is fine), identification of the work, the address of the page you are
          complaining about, your contact details, a statement that you believe in good
          faith the use is unauthorised, and a statement under penalty of perjury that your
          notice is accurate and that you are the owner or authorised to act for them.
        </p>
        <p>
          We remove material that is the subject of a valid notice. If yours was removed and
          you believe that was a mistake, you may send a counter-notice under § 512(g) to
          the same address. We terminate repeat infringers.
        </p>
      </LegalSection>

      <LegalSection heading="Trademarks">
        <p>
          Names, logos and marks of the listed projects belong to their respective owners
          and are used here only to identify the project being described. If you own a mark
          and want an entry changed or removed, write to{" "}
          <LegalValue value={OPERATOR.email} />.
        </p>
        <p className="font-mono text-xs">{DISCLAIMER}</p>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          The site is provided &ldquo;as is&rdquo;, without warranties of any kind, express
          or implied, including merchantability, fitness for a particular purpose and
          non-infringement. We do not warrant that the catalog is complete, current or
          error-free, or that any listed project is safe, lawful or functional.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect,
          incidental, special or consequential damages, or for any loss arising from your
          use of this site or of any site it links to — including damage to or loss of a
          game account. Some states do not allow certain limitations, in which case they
          apply to you only as far as the law allows.
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          These terms are governed by the laws of{" "}
          <LegalValue value={OPERATOR.governingLaw} />, without regard to its
          conflict-of-law rules.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these terms; the version published here is the current one, and its
          date is below. Continuing to use the site after a change means you accept it.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
