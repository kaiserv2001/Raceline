"use client";

import dynamic from "next/dynamic";
import type { ChampionshipPoint } from "./ChampionshipChart";

/**
 * ChampionshipChartLoader — client boundary that dynamically imports the
 * Recharts ChampionshipChart with ssr:false. `ssr:false` dynamic imports are
 * only allowed inside Client Components, so the (server) profile page renders
 * this thin wrapper instead of calling dynamic() directly.
 */
const ChampionshipChart = dynamic(() => import("./ChampionshipChart"), {
  ssr: false,
  loading: () => <div className="h-[220px] animate-pulse rounded-sm bg-[#0F0F14]" />,
});

export function ChampionshipChartLoader({ data }: { data: ChampionshipPoint[] }) {
  return <ChampionshipChart data={data} />;
}
