import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPage, LegalSection, LegalValue } from "@/components/legal";
import { DISCLAIMER } from "@/lib/brand";
import { DMCA_AGENT, LEGAL_UPDATED, OPERATOR } from "@/lib/legal";
import { seo } from "@/lib/seo";

/**
 * Nothing here is legally required — a US site owes no imprint and no terms.
 * What is kept earns its place: the catalog links to other people's software,
 * so the disclaimers are the point, and it carries user submissions, so there
 * has to be a way to report a copyright problem.
 */
export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () =>
    seo({
      title: "Terms of Use",
      description:
        "What the VALO DIRECTORY catalog is and isn't, how submissions work, and how to report a copyright or trademark problem.",
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
      <LegalSection heading="What this site is">
        <p>
          VALO DIRECTORY is an independent catalog of third-party tools and sites related to
          VALORANT. We do not host, operate or control any of them. Every entry is a
          description and a link; the project itself belongs to someone else and is governed
          by their terms.
        </p>
        <p>
          A listing is not an endorsement, a security review, or a promise that something
          works or is safe. Some listed utilities may conflict with Riot Games&rsquo; terms of
          service. Check any project yourself before trusting it with your account, and never
          enter your Riot password on a site you do not trust. Each entry shows when we last
          checked it; between checks, projects change hands or go stale.{" "}
          <Link to="/about" className="focus-ring text-foreground underline underline-offset-4">
            How we pick and order listings
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Submitting a project">
        <p>
          Anyone can suggest a project. By submitting, you confirm the information is
          accurate as far as you know and that you may send it, and you allow us to publish
          and edit it as part of the catalog. We may reject or remove any entry. Do not
          submit personal information, malware, phishing pages, or anything that infringes
          someone&rsquo;s rights.
        </p>
      </LegalSection>

      <LegalSection heading="Copyright and trademarks">
        {DMCA_AGENT ? (
          <>
            <p>
              To report infringing material under 17 U.S.C. § 512(c), send a notice to our
              designated agent: {DMCA_AGENT.name}, {DMCA_AGENT.address},{" "}
              {DMCA_AGENT.phone}, {DMCA_AGENT.email}. Include your signature, the work
              concerned, the page complained of, your contact details, a statement of good
              faith belief that the use is unauthorised, and a statement under penalty of
              perjury that the notice is accurate and that you are the owner or authorised to
              act for them.
            </p>
            <p>
              We remove material covered by a valid notice, accept counter-notices under
              § 512(g) at the same address, and terminate repeat infringers.
            </p>
          </>
        ) : (
          <p>
            Entries are short factual descriptions of publicly available projects. If you
            believe something here infringes your copyright, write to{" "}
            <LegalValue value={OPERATOR.email} /> with the page and the work concerned and we
            will take it down promptly.
          </p>
        )}
        <p>
          Names, logos and marks of listed projects belong to their owners and are used only
          to identify the project described. Mark owners can have an entry changed or removed
          at the same address.
        </p>
        <p className="font-mono text-xs">{DISCLAIMER}</p>
      </LegalSection>

      <LegalSection heading="No warranty, no liability">
        <p>
          The site is provided &ldquo;as is&rdquo;, without warranties of any kind. We do not
          warrant that the catalog is complete, current or error-free, or that any listed
          project is safe, lawful or functional. To the fullest extent the law allows, we are
          not liable for any loss arising from your use of this site or of any site it links
          to, including damage to or loss of a game account.
        </p>
      </LegalSection>

      <LegalSection heading="Contact and changes">
        <p>
          Reach us at <LegalValue value={OPERATOR.email} />. We may update these terms; the
          version published here is the current one, and its date is below.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
