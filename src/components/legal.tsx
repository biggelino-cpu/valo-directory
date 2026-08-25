import { isPlaceholder } from "@/lib/legal";

/**
 * Shared shell for the legal pages, so the Privacy Policy and the Terms read
 * as one document set rather than two differently-styled pages.
 */
export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl">{title}</h1>
      {intro ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>
      ) : null}
      <div className="mt-8 space-y-8">{children}</div>
      <p className="mt-12 border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        Last updated: {updated}
      </p>
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/**
 * Renders an operator detail, or — while it is still a TODO — says so in the
 * page itself. A policy that silently shows a filler address is worse than one
 * that admits it is unfinished.
 */
export function LegalValue({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <span className="font-mono text-xs text-primary">
      [{value.replace(/^TODO:\s*/, "")} — to be filled in]
    </span>
  );
}
