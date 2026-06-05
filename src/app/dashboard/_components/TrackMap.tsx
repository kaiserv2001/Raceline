"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LiveRiderState } from "@/data/types";
import { circuitById } from "@/data/circuits";
import { riderById } from "@/data/riders";
import { teamById } from "@/data/teams";
import { liveSessionCircuitId } from "@/data/telemetry";

/**
 * TrackMap — the broadcast-style centerpiece. Renders the live session's
 * circuit outline and a position dot per rider, animated toward each new
 * snapshot's coordinates via Framer Motion. Falls back to a placeholder oval
 * when the circuit SVG path is unavailable.
 */

interface TrackMapProps {
  field: LiveRiderState[];
}

const FALLBACK_PATH =
  "M 400 110 C 620 110, 700 200, 700 280 C 700 420, 540 460, 400 460 C 260 460, 100 420, 100 280 C 100 200, 180 110, 400 110 Z";

export function TrackMap({ field }: TrackMapProps) {
  const reduceMotion = useReducedMotion();
  const circuit = circuitById(liveSessionCircuitId);
  const path = circuit?.svgPath ?? FALLBACK_PATH;
  const usingFallback = !circuit?.svgPath;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-[#1E1E2A] bg-[#080810]">
      {/* Circuit label */}
      <div className="absolute left-4 top-4 z-10">
        <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {circuit?.country ?? "Session"}
        </p>
        <h2 className="font-[family-name:var(--font-condensed)] text-2xl font-black uppercase leading-none text-[#E8E8E0]">
          {circuit?.name ?? "Live Track"}
        </h2>
        <p className="mt-1 font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#666680]">
          {circuit ? `${circuit.length} km · ${circuit.corners} corners` : ""}
        </p>
      </div>

      <svg
        viewBox="0 0 800 600"
        className={`absolute inset-0 h-full w-full ${usingFallback ? "opacity-50" : ""}`}
      >
        {/* Track bed */}
        <path
          d={path}
          fill="none"
          stroke="#2A2A3A"
          strokeWidth={32}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Racing line */}
        <path
          d={path}
          fill="none"
          stroke="#444460"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeDasharray="6 8"
        />

        {/* Rider dots */}
        {field.map((state) => {
          const rider = riderById(state.riderId);
          const team = rider ? teamById(rider.teamId) : undefined;
          const color = team?.color ?? "#E8E8E0";
          const isLeader = state.position === 1;

          return (
            <motion.g
              key={state.riderId}
              initial={false}
              animate={{ x: state.trackPosition.x, y: state.trackPosition.y }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 2.8, ease: "linear" }
              }
            >
              {isLeader && (
                <circle
                  r={11}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={0.5}
                />
              )}
              <circle
                r={7}
                fill={color}
                stroke="#080810"
                strokeWidth={1.5}
              />
              <text
                x={0}
                y={-12}
                textAnchor="middle"
                className="font-[family-name:var(--font-condensed)]"
                fontSize={11}
                fontWeight={700}
                fill={color}
              >
                {rider?.number ?? ""}
              </text>
            </motion.g>
          );
        })}
      </svg>

      {/* Live badge */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#E8001C]" aria-hidden />
        <span className="font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest text-[#E8001C]">
          On Track
        </span>
      </div>
    </div>
  );
}
