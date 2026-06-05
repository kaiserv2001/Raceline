import Link from "next/link";
import { countryFlag } from "@/lib/flags";

import { PageTransition } from "@/components/PageTransition";
import { StatusBadge } from "@/components/StatusBadge";
import { circuitById } from "@/data/circuits";
import { riderById, riders } from "@/data/riders";
import { teamById } from "@/data/teams";
import type { ChampionshipPoint } from "./_components/ChampionshipChart";
import { ChampionshipChartLoader } from "./_components/ChampionshipChartLoader";
import { StatsGrid, type StatItem } from "./_components/StatsGrid";

/**
 * Rider Profile — server component. Hero with giant bike-number backdrop and
 * team-color stripe, an 8-tile career stats grid, a championship points chart
 * (client/Recharts via a client dynamic-import loader), and a last-5-races
 * results table.
 */

export function generateStaticParams() {
  return riders.map((r) => ({ id: r.id }));
}

const TOTAL_ROUNDS = 18;

/**
 * Build a full 18-round cumulative-points series. A rider's seasonResults only
 * contain rounds they finished top-5, so we carry the last known total forward
 * across rounds with no scoring result.
 */
function buildChampionshipSeries(
  results: { round: number; cumulativePoints: number }[],
): ChampionshipPoint[] {
  const byRound = new Map(results.map((r) => [r.round, r.cumulativePoints]));
  const series: ChampionshipPoint[] = [];
  let running = 0;
  for (let round = 1; round <= TOTAL_ROUNDS; round++) {
    if (byRound.has(round)) running = byRound.get(round)!;
    series.push({ round, cumulativePoints: running });
  }
  return series;
}

function NotFound({ id }: { id: string }) {
  return (
    <main className="min-h-screen bg-[#0A0A0F] p-8">
      <div className="mx-auto max-w-xl rounded-sm border border-[#1E1E2A] border-l-2 border-l-[#E8001C] bg-[#0F0F14] p-8">
        <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Error
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-condensed)] text-3xl font-black uppercase text-[#E8E8E0]">
          Rider Not Found
        </h1>
        <p className="mt-2 font-[family-name:var(--font-condensed)] text-sm text-[#B0B0C0]">
          No rider exists for id{" "}
          <span className="text-[#E8001C]">&ldquo;{id}&rdquo;</span>.
        </p>
        <Link
          href="/riders/1"
          className="mt-6 inline-block rounded-sm border border-[#1E1E2A] px-4 py-2 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest text-[#E8E8E0] transition-colors hover:border-[#E8001C] hover:text-[#E8001C]"
        >
          ← Back to grid
        </Link>
      </div>
    </main>
  );
}

export default async function RiderProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rider = riderById(id);

  if (!rider) return <NotFound id={id} />;

  const team = teamById(rider.teamId);
  const accent = team?.color ?? "#E8001C";
  const series = buildChampionshipSeries(rider.seasonResults);
  const recent = [...rider.seasonResults].sort((a, b) => b.round - a.round).slice(0, 5);

  const statTiles: StatItem[] = [
    { label: "WORLD TITLES", value: rider.stats.titles },
    { label: "VICTORIES", value: rider.stats.wins },
    { label: "PODIUMS", value: rider.stats.podiums },
    { label: "POLE POSITIONS", value: rider.stats.poles },
    { label: "FASTEST LAPS", value: rider.stats.fastestLaps },
    { label: "POINTS", value: rider.stats.points, accent: true },
    { label: "SEASONS", value: rider.stats.seasons },
    { label: "AVG FINISH", value: rider.stats.avgFinish, decimals: 1 },
  ];

  return (
    <PageTransition>
    <main className="min-h-screen bg-[#0A0A0F] pb-16">
      {/* Hero */}
      <section className="relative h-72 overflow-hidden border-b border-[#1E1E2A] bg-[#080810]">
        {/* Giant bike-number backdrop */}
        <span
          className="pointer-events-none absolute -top-8 right-0 select-none font-[family-name:var(--font-condensed)] font-black leading-none"
          style={{
            fontSize: "clamp(8rem, 25vw, 22rem)",
            color: accent,
            opacity: 0.07,
          }}
          aria-hidden
        >
          {rider.number}
        </span>

        {/* Team color stripe */}
        <div
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ background: accent }}
          aria-hidden
        />

        {/* Rider info */}
        <div className="relative z-10 flex h-full flex-col justify-end p-8">
          <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            {team?.name ?? "Independent"}
          </p>
          <h1 className="font-[family-name:var(--font-condensed)] text-4xl font-black uppercase leading-none text-[#E8E8E0] sm:text-6xl break-words">
            {rider.name}
          </h1>
          <p className="mt-2 font-[family-name:var(--font-condensed)] font-bold uppercase tracking-widest text-[#E8001C]">
            {countryFlag(rider.nationality)} {rider.nationality} · #{rider.number}
            {team ? (
              <span className="ml-3 text-[#666680]">{team.engine} ENGINE</span>
            ) : null}
          </p>
        </div>
      </section>

      {/* Stats grid */}
      <section className="px-6 pt-6">
        <h2 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Career Statistics
        </h2>
        <StatsGrid tiles={statTiles} />
      </section>

      {/* Championship chart */}
      <section className="px-6 pt-8">
        <h2 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Championship Progression — Season {new Date().getFullYear()}
        </h2>
        <div className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <ChampionshipChartLoader data={series} />
        </div>
      </section>

      {/* Recent races */}
      <section className="px-6 pt-8">
        <h2 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Recent Races
        </h2>
        <div className="overflow-hidden rounded-sm border border-[#1E1E2A] bg-[#0F0F14]">
          {recent.length === 0 ? (
            <p className="p-6 font-[family-name:var(--font-condensed)] text-sm text-[#666680]">
              No top-5 results this season.
            </p>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#1E1E2A] font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
                  <th className="px-4 py-3 font-semibold">Rd</th>
                  <th className="px-4 py-3 font-semibold">Circuit</th>
                  <th className="px-4 py-3 font-semibold">Pos</th>
                  <th className="px-4 py-3 font-semibold">Gap</th>
                  <th className="px-4 py-3 font-semibold">Strategy</th>
                  <th className="px-4 py-3 text-right font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => {
                  const circuit = circuitById(r.circuitId);
                  const isDnf = r.position === "DNF" || r.position === "DNS";
                  return (
                    <tr
                      key={r.round}
                      className="border-b border-[#1E1E2A] last:border-0 font-[family-name:var(--font-condensed)] text-sm text-[#B0B0C0] transition-colors hover:bg-[#141420]"
                    >
                      <td className="px-4 py-3 tabular-nums text-[#666680]">
                        {String(r.round).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3 font-semibold uppercase tracking-wide text-[#E8E8E0]">
                        {circuit?.name ?? r.circuitId}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold tabular-nums text-[#E8E8E0]">
                          {isDnf ? (
                            <StatusBadge
                              variant="flag"
                              flag="RED"
                              label={String(r.position)}
                              size="sm"
                            />
                          ) : (
                            `P${r.position}`
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {isDnf ? "—" : r.gap}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex gap-1">
                          {r.tireStrategy.map((c, i) => (
                            <StatusBadge
                              key={i}
                              variant="compound"
                              compound={c}
                              size="sm"
                            />
                          ))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-[#E8E8E0]">
                        {r.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </main>
    </PageTransition>
  );
}
