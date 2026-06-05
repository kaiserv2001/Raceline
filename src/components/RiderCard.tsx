"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Rider, Team } from "@/data/types";
import { countryFlag } from "@/lib/flags";

/**
 * RiderCard — compact rider portrait block: big number, name, nationality,
 * and a team-color accent bar. Display-only; pass the resolved team in so the
 * card stays free of data lookups.
 */

interface RiderCardProps {
  rider: Rider;
  team: Team;
  /** Highlight as the active/selected rider. */
  active?: boolean;
  /** Optional click handler — when present the card becomes interactive. */
  onSelect?: (riderId: string) => void;
  className?: string;
}

export function RiderCard({
  rider,
  team,
  active = false,
  onSelect,
  className = "",
}: RiderCardProps) {
  const interactive = typeof onSelect === "function";
  const shouldReduce = useReducedMotion();

  const stateClasses = active
    ? "border-[#E8001C] bg-[#1A0008] shadow-[0_0_12px_rgba(232,0,28,0.3)]"
    : "border-[#1E1E2A] bg-[#0F0F14]";

  const hoverClasses = interactive
    ? "cursor-pointer hover:border-[#E8001C] hover:bg-[#141420]"
    : "";

  return (
    <motion.div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.(rider.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(rider.id);
              }
            }
          : undefined
      }
      whileHover={interactive && !shouldReduce ? { scale: 1.015 } : undefined}
      whileTap={interactive && !shouldReduce ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`relative flex items-stretch overflow-hidden rounded-sm border transition-all duration-150 ${stateClasses} ${hoverClasses} ${className}`}
    >
      {/* Team color accent bar */}
      <div
        className="w-1.5 shrink-0"
        style={{ backgroundColor: team.color }}
        aria-hidden
      />

      <div className="flex flex-1 items-center gap-3 p-3">
        {/* Number */}
        <span
          className="font-[family-name:var(--font-condensed)] text-4xl font-black leading-none tabular-nums"
          style={{ color: team.color }}
        >
          {rider.number}
        </span>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-condensed)] text-lg font-bold uppercase leading-tight tracking-tight text-[#E8E8E0]">
            {rider.name}
          </p>
          <div className="mt-0.5 flex items-center gap-2 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            <span>{countryFlag(rider.nationality)} {rider.nationality}</span>
            <span className="h-2.5 w-px bg-[#1E1E2A]" aria-hidden />
            <span className="truncate">{team.name}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
