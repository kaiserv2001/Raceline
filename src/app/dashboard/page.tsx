import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { circuitById } from "@/data/circuits";
import { liveSessionCircuitId } from "@/data/telemetry";
import { DashboardBoard } from "./_components/DashboardBoard";

/**
 * Live Race Dashboard — the centerpiece screen. Server Component shell: it
 * resolves the static session context (circuit, weather, temps) and hands off
 * to the client DashboardBoard, which owns the mock live feed and animation.
 *
 * Layout is a three-column CSS grid (leaderboard | track map | telemetry) with
 * a bottom info strip, collapsing responsively on tablet and mobile.
 */

export const metadata: Metadata = {
  title: "Live Race — Apex Grid",
  description:
    "Broadcast-style live race command center: track map, timing tower, sector splits, tire strategy, and weather.",
};

export default function DashboardPage() {
  const circuit = circuitById(liveSessionCircuitId);

  // Session conditions are part of the portfolio illusion — fixed per session.
  const weather = "Dry" as const;
  const airTemp = 24;
  const trackTemp = 41;

  return (
    <PageTransition>
    <div className="bg-[#0A0A0F]">
      {/* Session header */}
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1E1E2A] px-4 py-3 sm:px-6">
        <div className="flex items-baseline gap-3">
          <h1 className="font-[family-name:var(--font-condensed)] text-xl font-black uppercase tracking-tight text-[#E8E8E0]">
            Race Control
          </h1>
          <span className="font-[family-name:var(--font-condensed)] text-sm uppercase tracking-widest text-[#666680]">
            {circuit?.name ?? "Live Session"} · {circuit?.country ?? ""}
          </span>
        </div>
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Lap record {circuit?.lapRecord ?? "—"}
        </span>
      </header>

      <DashboardBoard
        weather={weather}
        airTemp={airTemp}
        trackTemp={trackTemp}
      />
    </div>
    </PageTransition>
  );
}
