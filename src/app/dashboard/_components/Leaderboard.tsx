"use client";

import { LayoutGroup, motion, useReducedMotion, type Variants } from "framer-motion";
import { LeaderboardRow } from "@/components";
import type { LiveRiderState } from "@/data/types";
import { riderById } from "@/data/riders";
import { teamById } from "@/data/teams";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

/**
 * Leaderboard — the live timing tower. Renders one LeaderboardRow per rider in
 * running order (always 20 slots, fill/truncate as needed). Wrapped in motion
 * layout so position swaps animate smoothly when the order changes.
 */

interface LeaderboardProps {
  field: LiveRiderState[];
  activeRiderId?: string;
  onSelect?: (riderId: string) => void;
}

const FALLBACK_TEAM = {
  id: "unknown",
  name: "Unknown",
  color: "#666680",
  engine: "V4" as const,
  country: "—",
};

export function Leaderboard({ field, activeRiderId, onSelect }: LeaderboardProps) {
  const shouldReduce = useReducedMotion();
  const ordered = [...field].sort((a, b) => a.position - b.position).slice(0, 20);
  const maxTopSpeed = ordered.reduce((m, s) => Math.max(m, s.topSpeed), 0);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="font-[family-name:var(--font-condensed)] text-sm font-bold uppercase tracking-widest text-[#E8E8E0]">
          Live Timing
        </h2>
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {ordered.length} riders
        </span>
      </div>

      <LayoutGroup>
        <motion.div
          className="flex-1 overflow-y-auto"
          variants={shouldReduce ? undefined : containerVariants}
          initial={shouldReduce ? false : "hidden"}
          animate={shouldReduce ? undefined : "visible"}
        >
          {ordered.map((state) => {
            const rider = riderById(state.riderId);
            const team = rider ? teamById(rider.teamId) : undefined;
            return (
              <motion.div
                key={state.riderId}
                layout
                layoutId={`rider-${state.riderId}`}
                variants={shouldReduce ? undefined : itemVariants}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <LeaderboardRow
                  state={state}
                  riderName={rider?.name ?? `Rider ${state.riderId}`}
                  riderNumber={rider?.number ?? 0}
                  team={team ?? FALLBACK_TEAM}
                  maxTopSpeed={maxTopSpeed}
                  active={state.riderId === activeRiderId}
                  onSelect={onSelect}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
