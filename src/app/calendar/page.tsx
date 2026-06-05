"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { PageTransition } from "@/components/PageTransition";
import { TimelineCard } from "@/components/TimelineCard";
import {
  calendar,
  completedRaces,
  nextRace,
  upcomingRaces,
} from "@/data/calendar";
import { circuitById } from "@/data/circuits";
import { championshipStandings, riderById } from "@/data/riders";
import type { Race } from "@/data/types";

/**
 * Race Calendar — client component (filter state). Season summary strip, a
 * horizontal 18-round dot timeline, filter toggles, and a responsive grid of
 * TimelineCards filtered by the active toggle.
 */

type Filter = "all" | "completed" | "upcoming" | "street";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "upcoming", label: "Upcoming" },
  { key: "street", label: "Street Circuits" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function matches(race: Race, filter: Filter): boolean {
  switch (filter) {
    case "completed":
      return race.completed;
    case "upcoming":
      return !race.completed;
    case "street":
      return race.trackType === "Street";
    default:
      return true;
  }
}

export default function CalendarPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const shouldReduce = useReducedMotion();

  const sorted = useMemo(
    () => [...calendar].sort((a, b) => a.round - b.round),
    [],
  );
  const filtered = useMemo(
    () => sorted.filter((r) => matches(r, filter)),
    [sorted, filter],
  );

  const leader = championshipStandings[0];

  const summary = [
    { label: "Rounds", value: calendar.length },
    { label: "Completed", value: completedRaces.length },
    { label: "Remaining", value: upcomingRaces.length },
  ];

  return (
    <PageTransition>
    <main className="min-h-screen bg-[#0A0A0F] pb-16">
      {/* Header */}
      <header className="border-b border-[#1E1E2A] bg-[#080810] px-6 py-6">
        <p className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {new Date().getFullYear()} World Championship
        </p>
        <h1 className="font-[family-name:var(--font-condensed)] text-4xl font-black uppercase leading-none text-[#E8E8E0] sm:text-5xl">
          Race Calendar
        </h1>
      </header>

      {/* Season summary strip */}
      <section className="grid grid-cols-2 gap-px border-b border-[#1E1E2A] bg-[#1E1E2A] sm:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-[#0A0A0F] px-6 py-4">
            <p className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
              {s.label}
            </p>
            <p className="font-[family-name:var(--font-condensed)] text-3xl font-black tabular-nums text-[#E8E8E0]">
              {s.value}
            </p>
          </div>
        ))}
        <div className="bg-[#0A0A0F] px-6 py-4">
          <p className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            Championship Leader
          </p>
          <p className="font-[family-name:var(--font-condensed)] text-2xl font-black uppercase leading-tight text-[#E8001C]">
            {leader?.name ?? "—"}
          </p>
          <p className="font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#666680]">
            {leader ? `${leader.stats.points} pts` : ""}
          </p>
        </div>
      </section>

      {/* Horizontal round timeline */}
      <section className="overflow-x-auto border-b border-[#1E1E2A] px-6 py-5">
        <div className="flex min-w-max items-center gap-1.5">
          {sorted.map((race) => (
            <div
              key={race.id}
              title={`R${race.round} · ${race.country}${race.completed ? " (completed)" : ""}`}
              className={`h-2.5 w-2.5 rounded-full transition-transform hover:scale-125 ${
                race.completed
                  ? "bg-[#E8001C]"
                  : race.id === nextRace?.id
                    ? "bg-[#00D2FF]"
                    : "border border-[#444460] bg-[#1E1E2A]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Filter toggles */}
      <section className="flex flex-wrap gap-2 px-6 pt-6">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-sm border px-4 py-2 font-[family-name:var(--font-condensed)] text-xs font-bold uppercase tracking-widest transition-colors ${
                active
                  ? "border-[#E8001C] bg-[#1A0008] text-[#E8001C]"
                  : "border-[#1E1E2A] text-[#B0B0C0] hover:border-[#E8001C] hover:text-[#E8001C]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </section>

      {/* GP card grid */}
      <section className="px-6 pt-4">
        {filtered.length === 0 ? (
          <p className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-6 font-[family-name:var(--font-condensed)] text-sm text-[#666680]">
            No races match this filter.
          </p>
        ) : (
          <motion.div
            key={filter}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={shouldReduce ? undefined : containerVariants}
            initial={shouldReduce ? false : "hidden"}
            animate={shouldReduce ? undefined : "visible"}
          >
            {filtered.map((race) => {
              const winner = race.winner
                ? riderById(race.winner)
                : undefined;
              return (
                <motion.div key={race.id} variants={shouldReduce ? undefined : itemVariants}>
                  <TimelineCard
                    race={race}
                    circuitName={circuitById(race.circuitId)?.name ?? race.circuitId}
                    winnerName={winner?.name}
                    isNext={race.id === nextRace?.id}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
    </PageTransition>
  );
}
