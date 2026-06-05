"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav — fixed top navigation bar shared across all five Apex Grid screens.
 * Highlights the active route. Height is h-14 (56px); pages render below it
 * via the pt-14 on <main> in the root layout.
 */

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "RACE" },
  { href: "/riders/1", label: "RIDERS" },
  { href: "/calendar", label: "CALENDAR" },
  { href: "/garage", label: "GARAGE" },
  { href: "/track/okuma", label: "TRACKS" },
];

/** True when the current path belongs to the nav item's section. */
function isActive(pathname: string, href: string): boolean {
  const section = href.split("/")[1];
  return pathname === href || pathname.startsWith(`/${section}`);
}

export function Nav() {
  const pathname = usePathname() ?? "";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-8 border-b border-[#1E1E2A] bg-[#0A0A0F]/90 px-6 backdrop-blur">
      <Link
        href="/"
        className="font-[family-name:var(--font-condensed)] text-xl font-black tracking-tight text-[#E8001C]"
      >
        APEX GRID
      </Link>

      <div className="flex items-center gap-6">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase tracking-widest transition-colors ${
                active
                  ? "text-[#E8E8E0]"
                  : "text-[#666680] hover:text-[#B0B0C0]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <span className="ml-auto hidden items-center gap-2 sm:flex">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#E8001C]" aria-hidden />
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Live
        </span>
      </span>
    </nav>
  );
}
