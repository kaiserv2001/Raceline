import Link from "next/link";
import { PageTransition } from "@/components/PageTransition";
import { HelmSceneLoader } from "@/components/HelmSceneLoader";

/**
 * Apex Grid homepage — hero title, the Three.js helmet centerpiece (loaded
 * client-side via next/dynamic with ssr:false so WebGL never runs during SSR),
 * and entry links to all five screens.
 */

const SCREENS: { href: string; label: string; blurb: string }[] = [
  { href: "/dashboard", label: "Live Race", blurb: "Broadcast timing tower, track map & telemetry" },
  { href: "/riders/1", label: "Riders", blurb: "Career stats, championship progression" },
  { href: "/calendar", label: "Calendar", blurb: "Full 18-round season schedule" },
  { href: "/garage", label: "Garage", blurb: "Bike setup, suspension & strategy" },
  { href: "/track/okuma", label: "Tracks", blurb: "Circuit maps, corners & tire strategy" },
];

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-[calc(100vh-3.5rem)] bg-[#0A0A0F]">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#1E1E2A] bg-[#080810] px-6 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-[0.4em] text-[#E8001C]">
                Motorsport Command Center
              </p>
              <h1 className="mt-2 font-[family-name:var(--font-condensed)] text-6xl font-black uppercase leading-none tracking-tight text-[#E8E8E0] sm:text-8xl">
                Apex
                <br />
                Grid
              </h1>
              <p className="mt-4 max-w-md font-[family-name:var(--font-condensed)] text-sm uppercase tracking-widest text-[#666680]">
                A high-performance interface exploring real-time race data,
                strategy controls, and premium sports UI design.
              </p>
            </div>

            {/* Three.js centerpiece */}
            <div className="rounded border border-[#1E1E2A] bg-[#080810]">
              <HelmSceneLoader />
            </div>
          </div>
        </section>

        {/* Screen entry links */}
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="mb-4 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            Screens
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCREENS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col gap-2 rounded-sm border border-[#1E1E2A] border-l-2 border-l-[#444460] bg-[#0F0F14] p-5 transition-colors hover:border-[#E8001C] hover:border-l-[#E8001C] hover:bg-[#141420]"
              >
                <span className="font-[family-name:var(--font-condensed)] text-xl font-black uppercase tracking-tight text-[#E8E8E0]">
                  {s.label}
                </span>
                <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-wider text-[#666680]">
                  {s.blurb}
                </span>
                <span className="mt-1 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest text-[#666680] transition-colors group-hover:text-[#E8001C]">
                  Enter →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
