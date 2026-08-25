import { Link } from "@tanstack/react-router";
import { Bookmark, Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DISCLAIMER } from "@/lib/brand";

const NAV = [
  { to: "/browse", label: "Browse" },
  { to: "/about", label: "About" },
  { to: "/saved", label: "Saved" },
];

// Keep the colour out of the base class: TanStack appends activeProps'
// classes, and two conflicting Tailwind colour utilities resolve by
// stylesheet order, not class order — so the active one would never win.
const NAV_LINK = "font-label focus-ring hover:text-foreground";
const NAV_ACTIVE = { className: "text-foreground" };
const NAV_INACTIVE = { className: "text-muted-foreground" };

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandMark />
        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={NAV_LINK}
              activeProps={NAV_ACTIVE}
              inactiveProps={NAV_INACTIVE}
            >
              {item.label}
            </Link>
          ))}
          <Button size="sm" className="font-label" asChild>
            <Link to="/submit">Submit</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="mb-6 font-display">Menu</SheetTitle>
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-label">
                Home
              </Link>
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="font-label inline-flex items-center gap-2"
                  activeProps={NAV_ACTIVE}
                  inactiveProps={NAV_INACTIVE}
                >
                  {item.to === "/saved" ? <Bookmark className="size-3.5" /> : null}
                  {item.label}
                </Link>
              ))}
              <Button className="mt-2 font-label" asChild>
                <Link to="/submit">Submit a site</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

const FOOTER_LINKS = [
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit" },
  { to: "/impressum", label: "Impressum" },
  { to: "/datenschutz", label: "Datenschutz" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={NAV_LINK}
              activeProps={NAV_ACTIVE}
              inactiveProps={NAV_INACTIVE}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <p className="max-w-3xl font-mono text-xs leading-relaxed text-muted-foreground">
          {DISCLAIMER}
        </p>
      </div>
    </footer>
  );
}
