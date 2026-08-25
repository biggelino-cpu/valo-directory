import { seo } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { DISCLAIMER } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () =>
    seo({
      title: "About",
      description:
        "How VALO DIRECTORY picks and verifies listings: an independent, community-run catalog that links out to Valorant tools rather than hosting them.",
      path: "/about",
    }),
});

function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">About VALO DIRECTORY</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">
        The catalog of everything worth using around Valorant. Independent,
        curated, and structured like a reference work rather than a fan page.
        We do not host those products. We catalog them and send you to the
        original site.
      </p>
      <h2 className="mt-10 font-display text-2xl">How listings work</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>Each entry has a category, platforms, pricing, and last-verified date.</li>
        <li>Safety notes flag login risk, overlays, or abandoned projects.</li>
        <li>
          Anyone can submit a tool. New listings stay private until a reviewer
          approves them into Browse.
        </li>
        <li>
          Submissions store the project name, URL, and a short description — no
          accounts and no personal info.
        </li>
      </ul>
      <h2 className="mt-10 font-display text-2xl">How we order listings</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We don&rsquo;t rank. The catalogue is shown in a random order that
        reshuffles once a day, so no listing keeps the top spot and position
        carries no meaning. You can re-sort it yourself by name, or by when we
        last checked a listing.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        We considered ranking by popularity and decided against it: whatever
        sits at the top gets the clicks, and would therefore stay at the top —
        which buries smaller projects for being smaller. Scoring listings
        against each other would mean inventing a number none of our data
        supports. Random is the honest answer until we have something real to
        rank on.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        The three highlighted picks on the home page are the exception, and
        they are labelled as what they are: our own editorial choices. Nobody
        pays for one.
      </p>

      <h2 className="mt-10 font-display text-2xl">Independence</h2>
      <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
        {DISCLAIMER}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Third-party tools can request Riot sign-in, install overlays, or go
        stale. Review each project yourself, enable MFA, and never enter your
        password on a site you do not trust. Some client-side utilities may
        conflict with Riot’s terms — we list them for discovery, not as an
        endorsement.
      </p>
    </main>
  );
}
