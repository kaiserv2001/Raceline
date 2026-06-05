"use client";

import { SectorBar, SpeedGauge, StatusBadge } from "@/components";
import type { LiveRiderState } from "@/data/types";
import { riderById } from "@/data/riders";
import { teamById } from "@/data/teams";

/**
 * TelemetryColumn — right sidebar. For the top-5 running order it shows a
 * three-sector timing block per rider, a tire-compound grid, and a speed-trap
 * gauge for the session leader. Sector colors flash by broadcast convention:
 * purple = overall best, green = personal best, yellow = slower.
 */

interface TelemetryColumnProps {
  field: LiveRiderState[];
}

/** Parse "28.442" / "1:28.442" to seconds. */
function toSeconds(t: string): number {
  const [a, b] = t.split(":");
  return b === undefined ? Number(a) : Number(a) * 60 + Number(b);
}

type SectorStatus = "best" | "improve" | "slower" | "neutral";

/** Decide a sector's status given its time and the field-best for that sector. */
function statusFor(time: number, fieldBest: number, riderBest: number): SectorStatus {
  if (Math.abs(time - fieldBest) < 0.0005) return "best";
  if (time <= riderBest + 0.0005) return "improve";
  return "slower";
}

export function TelemetryColumn({ field }: TelemetryColumnProps) {
  const top5 = [...field].sort((a, b) => a.position - b.position).slice(0, 5);

  // Field-best per sector across the top 5 (drives purple flashes).
  const bestS1 = Math.min(...top5.map((s) => toSeconds(s.sector1)));
  const bestS2 = Math.min(...top5.map((s) => toSeconds(s.sector2)));
  const bestS3 = Math.min(...top5.map((s) => toSeconds(s.sector3)));

  const leader = top5[0];
  const fieldBestSpeed = Math.max(...field.map((s) => s.topSpeed));

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Speed trap gauge for the leader */}
      {leader && (
        <section className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            Speed Trap — Leader
          </h3>
          <div className="flex items-center justify-center">
            <SpeedGauge
              value={leader.topSpeed}
              min={280}
              max={360}
              label={riderById(leader.riderId)?.name ?? "Leader"}
              size={150}
            />
          </div>
        </section>
      )}

      {/* Sector timing for the top 5 */}
      <section className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
        <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Sector Timing — Top 5
        </h3>
        <div className="space-y-4">
          {top5.map((state) => {
            const rider = riderById(state.riderId);
            const team = rider ? teamById(rider.teamId) : undefined;
            const s1 = toSeconds(state.sector1);
            const s2 = toSeconds(state.sector2);
            const s3 = toSeconds(state.sector3);

            return (
              <div key={state.riderId}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className="h-3 w-1 rounded-sm"
                    style={{ backgroundColor: team?.color ?? "#666680" }}
                    aria-hidden
                  />
                  <span className="font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#666680]">
                    P{state.position}
                  </span>
                  <span className="truncate font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase text-[#E8E8E0]">
                    {rider?.name ?? state.riderId}
                  </span>
                  <span className="ml-auto font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#B0B0C0]">
                    {state.lastLap}
                  </span>
                </div>
                <div className="space-y-1">
                  <SectorBar
                    label="S1"
                    time={state.sector1}
                    status={statusFor(s1, bestS1, s1)}
                    fill={bestS1 / s1}
                  />
                  <SectorBar
                    label="S2"
                    time={state.sector2}
                    status={statusFor(s2, bestS2, s2)}
                    fill={bestS2 / s2}
                  />
                  <SectorBar
                    label="S3"
                    time={state.sector3}
                    status={statusFor(s3, bestS3, s3)}
                    fill={bestS3 / s3}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tire compound grid */}
      <section className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
        <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Tire Compounds — Top 5
        </h3>
        <div className="space-y-2">
          {top5.map((state) => {
            const rider = riderById(state.riderId);
            return (
              <div
                key={state.riderId}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="w-7 shrink-0 font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#666680]">
                    P{state.position}
                  </span>
                  <span className="truncate font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase text-[#E8E8E0]">
                    {rider?.name ?? state.riderId}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-[family-name:var(--font-condensed)] text-[10px] tabular-nums text-[#666680]">
                    {state.tireAge}L
                  </span>
                  <StatusBadge
                    variant="compound"
                    compound={state.tireCompound}
                    showLabel
                    size="sm"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-3 font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
          Field-best speed {fieldBestSpeed} km/h
        </p>
      </section>
    </div>
  );
}
