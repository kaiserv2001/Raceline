"use client";

import { motion, useReducedMotion } from "framer-motion";
import { StatTile, StatusBadge } from "@/components";
import type { LiveRiderState, Weather } from "@/data/types";
import { riderById } from "@/data/riders";

/**
 * BottomStrip — the dashboard's footer band: lap counter, fastest-lap ticker,
 * weather badge, and air/track temps. The fastest lap scrolls as a marquee
 * banner (broadcast-style) unless reduced motion is requested.
 */

interface BottomStripProps {
  field: LiveRiderState[];
  currentLap: number;
  totalLaps: number;
  weather: Weather;
  airTemp: number;
  trackTemp: number;
}

/** Parse a lap-time string into seconds for comparison. */
function toSeconds(t: string): number {
  const [a, b] = t.split(":");
  return b === undefined ? Number(a) : Number(a) * 60 + Number(b);
}

export function BottomStrip({
  field,
  currentLap,
  totalLaps,
  weather,
  airTemp,
  trackTemp,
}: BottomStripProps) {
  const reduceMotion = useReducedMotion();

  // Fastest lap across the field this tick.
  const fastest = field.reduce<LiveRiderState | null>((best, s) => {
    if (!best) return s;
    return toSeconds(s.lastLap) < toSeconds(best.lastLap) ? s : best;
  }, null);

  const fastestRider = fastest ? riderById(fastest.riderId) : undefined;
  const fastestText = fastest
    ? `FASTEST LAP — ${fastestRider?.name ?? fastest.riderId} #${fastestRider?.number ?? ""} — ${fastest.lastLap} — LAP ${currentLap}`
    : "Awaiting fastest lap";

  return (
    <div className="mt-4 space-y-3">
      {/* Fastest lap marquee */}
      <div className="overflow-hidden rounded-sm border border-[#1E1E2A] bg-[#16001E]">
        <div className="flex items-center">
          <span className="shrink-0 bg-[#CC00FF] px-3 py-1.5 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest text-[#0A0A0F]">
            ◆ Fastest
          </span>
          <div className="relative flex-1 overflow-hidden py-1.5">
            {reduceMotion ? (
              <span className="px-3 font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase tracking-wide text-[#CC00FF]">
                {fastestText}
              </span>
            ) : (
              <motion.div
                className="whitespace-nowrap"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 18, ease: "linear", repeat: Infinity }}
              >
                <span className="font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase tracking-wide text-[#CC00FF]">
                  {fastestText}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="LAP" value={`${currentLap} / ${totalLaps}`} accent />
        <StatTile
          label="FASTEST LAP"
          value={fastest?.lastLap ?? "—"}
        />
        <div className="flex flex-col justify-center rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            Weather
          </span>
          <div className="mt-1.5">
            <StatusBadge variant="weather" weather={weather} />
          </div>
        </div>
        <div className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            Temps
          </span>
          <div className="mt-1 flex items-baseline gap-3">
            <div>
              <span className="font-[family-name:var(--font-condensed)] text-2xl font-bold tabular-nums text-[#E8E8E0]">
                {airTemp}°
              </span>
              <span className="ml-1 font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
                Air
              </span>
            </div>
            <div>
              <span className="font-[family-name:var(--font-condensed)] text-2xl font-bold tabular-nums text-[#FFD000]">
                {trackTemp}°
              </span>
              <span className="ml-1 font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
                Track
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
