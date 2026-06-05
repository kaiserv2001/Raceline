"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Weather } from "@/data/types";
import { useLiveRace } from "./useLiveRace";
import { Leaderboard } from "./Leaderboard";
import { TelemetryColumn } from "./TelemetryColumn";
import { BottomStrip } from "./BottomStrip";

/**
 * DashboardBoard — client orchestrator for the Live Race Dashboard. Owns the
 * shared mock live-feed state (useLiveRace) and distributes each snapshot to the
 * three columns + bottom strip. The page shell remains a Server Component; only
 * this interactive board needs the client boundary.
 *
 * TrackMap is loaded via next/dynamic with ssr:false — its Framer Motion SVG
 * animation is purely client-side and benefits from skipping server render.
 */

const TrackMap = dynamic(
  () => import("./TrackMap").then((m) => m.TrackMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded border border-[#1E1E2A] bg-[#080810]">
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Loading circuit…
        </span>
      </div>
    ),
  },
);

interface DashboardBoardProps {
  weather: Weather;
  airTemp: number;
  trackTemp: number;
}

export function DashboardBoard({
  weather,
  airTemp,
  trackTemp,
}: DashboardBoardProps) {
  const { field, currentLap, totalLaps } = useLiveRace();
  const [activeRiderId, setActiveRiderId] = useState<string | undefined>();

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 gap-px bg-[#1E1E2A] lg:grid-cols-[1fr_320px] xl:grid-cols-[280px_1fr_320px]">
      {/* Left — leaderboard */}
      <aside className="order-2 bg-[#0A0A0F] p-4 lg:order-1 lg:col-span-2 xl:order-none xl:col-span-1">
        <Leaderboard
          field={field}
          activeRiderId={activeRiderId}
          onSelect={setActiveRiderId}
        />
      </aside>

      {/* Center — track map + bottom strip */}
      <main className="order-1 bg-[#0A0A0F] p-4 sm:p-6 lg:order-2 xl:order-none">
        <TrackMap field={field} />
        <BottomStrip
          field={field}
          currentLap={currentLap}
          totalLaps={totalLaps}
          weather={weather}
          airTemp={airTemp}
          trackTemp={trackTemp}
        />
      </main>

      {/* Right — telemetry */}
      <aside className="order-3 bg-[#0A0A0F] p-4 lg:order-3 xl:order-none">
        <TelemetryColumn field={field} />
      </aside>
    </div>
  );
}
