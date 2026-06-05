"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Race } from "@/data/types";
import { StatusBadge } from "./StatusBadge";
import { countryNameFlag } from "@/lib/flags";

/**
 * TimelineCard — a Grand Prix card for the season calendar: round, country,
 * circuit name, date, weather, and (if completed) a winner chip. Upcoming
 * rounds get a cyan "NEXT" treatment when flagged. Display-only.
 */

interface TimelineCardProps {
  race: Race;
  /** Resolved circuit display name (race.circuitId is just an id). */
  circuitName: string;
  /** Resolved winner display name when the race is completed. */
  winnerName?: string;
  /** Mark this round as the next upcoming race. */
  isNext?: boolean;
  active?: boolean;
  onSelect?: (raceId: string) => void;
  className?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d).toUpperCase();
}

export function TimelineCard({
  race,
  circuitName,
  winnerName,
  isNext = false,
  active = false,
  onSelect,
  className = "",
}: TimelineCardProps) {
  const interactive = typeof onSelect === "function";
  const shouldReduce = useReducedMotion();

  const accentBorder = active
    ? "border-l-[#E8001C]"
    : isNext
      ? "border-l-[#00D2FF]"
      : race.completed
        ? "border-l-[#1E1E2A]"
        : "border-l-[#444460]";

  const stateBg = active ? "bg-[#1A0008]" : "bg-[#0F0F14]";
  const hoverClasses = interactive
    ? "cursor-pointer hover:bg-[#141420] hover:border-[#E8001C]"
    : "";

  return (
    <motion.div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.(race.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(race.id);
              }
            }
          : undefined
      }
      whileHover={shouldReduce ? undefined : { scale: 1.015, borderColor: "#E8001C" }}
      whileTap={shouldReduce ? undefined : { scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`flex flex-col gap-3 rounded-sm border border-[#1E1E2A] border-l-2 p-4 transition-all duration-150 ${accentBorder} ${stateBg} ${hoverClasses} ${className}`}
    >
      {/* Header: round + status */}
      <div className="flex items-start justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            Round
          </span>
          <span className="font-[family-name:var(--font-condensed)] text-2xl font-black leading-none tabular-nums text-[#E8E8E0]">
            {String(race.round).padStart(2, "0")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {isNext ? (
            <span className="rounded-sm bg-[#00D2FF] px-1.5 py-0.5 font-[family-name:var(--font-condensed)] text-[10px] font-bold uppercase tracking-widest text-[#0A0A0F]">
              Next
            </span>
          ) : null}
          <StatusBadge variant="weather" weather={race.weather} size="sm" />
        </div>
      </div>

      {/* Country + circuit */}
      <div>
        <p className="font-[family-name:var(--font-condensed)] text-lg font-bold uppercase leading-tight tracking-tight text-[#E8E8E0]">
          <span className="mr-1.5 not-uppercase">{countryNameFlag(race.country)}</span>{race.country}
        </p>
        <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {circuitName}
        </p>
      </div>

      {/* Footer: date + winner / status */}
      <div className="mt-auto flex items-center justify-between border-t border-[#1E1E2A] pt-2">
        <span className="font-[family-name:var(--font-condensed)] text-sm font-semibold tabular-nums text-[#B0B0C0]">
          {formatDate(race.date)}
        </span>

        {race.completed ? (
          winnerName ? (
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#1E1E2A] bg-[#0A0A0F] px-2 py-0.5">
              <span className="text-[#FFD000]" aria-hidden>
                ★
              </span>
              <span className="font-[family-name:var(--font-condensed)] text-xs font-semibold uppercase tracking-wide text-[#E8E8E0]">
                {winnerName}
              </span>
            </span>
          ) : (
            <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
              Completed
            </span>
          )
        ) : (
          <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            {race.trackType}
          </span>
        )}
      </div>
    </motion.div>
  );
}
