"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, FileText, House, Menu, Search, User, Users, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";

export type HeaderUser = {
  id: string;
  name: string;
  email: string;
  // Session 63 (S63-G / A-L1): the dead avatar-color field is deleted —
  // the header avatar renders the static blue-500 -> purple-600 gradient +
  // User icon and never read the color (grep-verified zero consumers of
  // the HeaderUser shape's field). The DB column and the auth API's
  // response shape stay (dropping them is a prisma schema change — the
  // same deferred class as the dead thumbnailSeed column, B-L6).
};

const NAV_LINKS = [
  { href: "/Dashboard", label: "Dashboard", icon: House },
  { href: "/Recent", label: "Recent", icon: FileText },
  { href: "/Teams", label: "Teams", icon: Users },
] as const;

// The dashboard is served at BOTH "/" and "/Dashboard" (reference parity:
// its links point at /Dashboard while the root also renders it) — but the
// reference's active-state check is an EXACT pathname match (session 12,
// measured settled on four routes): at "/" NO nav link is highlighted;
// the pill appears only on /Dashboard, /Recent and /Teams themselves.
function isNavActive(pathname: string, href: string): boolean {
  return pathname === href;
}

/**
 * THE mobile navigation fix (the reference app's Tailwind v4 failure class A:
 * desktop nav `hidden md:flex` with no mobile fallback — no navigation at all
 * below 768px). This Sheet-based drawer restores it: a `md:hidden` trigger,
 * Radix focus trap + Escape + scroll lock, 44px touch targets, closes on
 * route change, and every link is SheetClose-wrapped so a tap both navigates
 * and dismisses.
 */
function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // No pathname-reset effect needed: every link is SheetClose-wrapped (a tap
  // both navigates and dismisses), and each route renders its own AppHeader,
  // so navigation unmounts this sheet anyway. That keeps the React 19
  // set-state-in-effect contract clean.

  // Session 56 (S56-I — this session's audit finding N-1): the drawer's
  // md-crossing close — the S55-B pattern at the md boundary. The
  // trigger is md:hidden (it vanishes at 768) while the Sheet's portal
  // renders at document.body, so an OPEN drawer survived the crossing —
  // floating over the desktop layout where the desktop nav is the
  // sanctioned surface. The listener registers only while open and
  // setOpen fires ONLY in the event callback (the app-header bell's
  // outside-pointerdown pattern — never the effect body).
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 768px)");
    function toDesktop() {
      if (mq.matches) setOpen(false);
    }
    mq.addEventListener("change", toDesktop);
    return () => mq.removeEventListener("change", toDesktop);
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 md:hidden"
        aria-label="Navigation menu"
        aria-expanded={open}
        aria-controls="mobile-nav-sheet"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        {/* Session 78 (S78-G / A-I3): the dynamic visually-hidden
            "Open/Close menu" label span is GONE — aria-label wins the
            accessible-name computation, so the span never reached AT
            (dead duplication beside the documented stable-label +
            aria-expanded contract; the state is carried by
            aria-expanded). */}
      </SheetTrigger>
      <SheetContent
        id="mobile-nav-sheet"
        side="left"
        className="w-72 gap-0 border-gray-200 p-0 [&>button]:h-11 [&>button]:w-11"
      >
        <SheetHeader className="space-y-0 border-b border-gray-200 px-5 py-4 text-left">
          <div className="flex items-center gap-3">
            <LogoMark stretch className="h-8 w-8" />
            <SheetTitle className="text-xl font-bold text-gray-900">Digma</SheetTitle>
          </div>
          {/* Session 54 (S54-B — the session-53 audit's deferred F-5): the
              drawer's PURPOSE for screen readers, wired by Radix into the
              dialog's aria-describedby (the vendored SheetDescription that no
              consumer used). Visually sr-only — the drawer's chrome is
              pixel-identical. */}
          <SheetDescription className="sr-only">
            Navigate between Digma's main pages.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                    active ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <link.icon className="h-5 w-5" aria-hidden />
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-gray-200 p-5">
          {/* Session 61 (S61-B — the ninth audit's M-2): AA at 12px —
              gray-500 (#6b7280, 4.83:1), not the 2.54:1 gray-400. */}
          <p className="text-xs text-gray-500">Digma · Design workspace</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * The shared top chrome — measured from the reference app: white sticky bar
 * (h-16, border-b), logo + name, `hidden md:flex` nav links, `hidden md:block`
 * search, bell, avatar + name/plan. The deviation (and fix): the mobile
 * hamburger + drawer on the left of the bar.
 */
export function AppHeader({ user }: { user: HeaderUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState("");
  const [bellOpen, setBellOpen] = React.useState(false);
  const bellRef = React.useRef<HTMLDivElement>(null);

  // Click-outside closes the bell popover (the §9.3 class-H race guard:
  // the popover itself is excluded from the outside handler).
  React.useEffect(() => {
    if (!bellOpen) return;
    function onDown(event: PointerEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [bellOpen]);

  // Session 56 (S56-I — the Mode C audit's L-5): the bell popover carries
  // role="dialog", so a keyboard user must be able to dismiss it with
  // Escape — the pointerdown-outside handler covers pointers only. The
  // same guarded-effect pattern (registered only while open, setState
  // only in the event callback).
  React.useEffect(() => {
    if (!bellOpen) return;
    function onBellKey(event: KeyboardEvent) {
      if (event.key === "Escape") setBellOpen(false);
    }
    window.addEventListener("keydown", onBellKey);
    return () => window.removeEventListener("keydown", onBellKey);
  }, [bellOpen]);

  function onSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/Recent?search=${encodeURIComponent(q)}` : "/Recent");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <MobileNav />
            <Link href="/Dashboard" className="flex items-center gap-3" aria-label="Digma home">
              {/* The reference's header logo: the full source frame squeezed
               * into a 32×32 square (object-fit: fill, no rounding). */}
              <LogoMark stretch className="h-8 w-8" />
              <h1 className="text-xl font-bold text-gray-900">Digma</h1>
            </Link>
            <nav aria-label="Primary" className="hidden items-center space-x-8 md:flex">
              {NAV_LINKS.map((link) => {
                const active = isNavActive(pathname, link.href);
                return (
                  /* Reference parity (re-measured session 10, post-hydration):
                   * the CURRENT route's link carries the purple pill
                   * (bg-purple-50 text-purple-700, no hover classes on the
                   * active variant); the others are gray with hovers. Session
                   * 8's "no active pill" reading was taken pre-hydration —
                   * the reference is a Base44 SPA whose SSR shell ships bare
                   * <a> tags and client hydration applies the classes. The
                   * mobile drawer below styles its active links the same way.
                   * aria-current stays for a11y. */
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    <link.icon className="h-4 w-4" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <form onSubmit={onSearch} role="search">
                <label htmlFor="global-search" className="sr-only">
                  Search
                </label>
                <input
                  id="global-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-80 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </form>
            </div>

            <div className="relative" ref={bellRef}>
              {/* Session 61 (S61-H / B-L-2 — the ninth audit): the bell meets
               * the 44px touch floor (the project's own convention for
               * mobile header controls — it sits beside the 44px hamburger
               * at 390) and announces its dialog semantics
               * (aria-haspopup="dialog"); the popover keeps its pinned
               * role/Escape contract (workspace.spec.ts:94). */}
              {/* Session 65 (S65-D — the thirteenth audit's A-3): the glyph
                  meets the non-text contrast floor (the S61-B family — the
                  lightest gray measured 2.54:1 on white against the 3:1
                  floor; the next step measures 4.83:1). Not a parity-pinned
                  site — the reference's own bell is unreachable dead chrome
                  (the A-9 datum), so the clone's working control follows the
                  project's AA pass. */}
              <button
                type="button"
                onClick={() => setBellOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={bellOpen}
                aria-haspopup="dialog"
                className="flex h-11 w-11 items-center justify-center rounded-lg p-0 text-gray-500 transition-colors hover:text-gray-700"
              >
                <Bell className="h-5 w-5" aria-hidden />
              </button>
              {bellOpen && (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg"
                >
                  <p className="mb-2 text-sm font-semibold text-gray-900">Notifications</p>
                  <p className="text-sm text-gray-500">You&apos;re all caught up. Nothing new for now.</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                aria-hidden
              >
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Pro Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
