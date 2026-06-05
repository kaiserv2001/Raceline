"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TrackMarker, StatTile } from "@/components";
import type { Circuit } from "@/data/types";
import { zoneColor } from "@/lib/designTokens";

const TyreDegChart = dynamic(() => import("./TyreDegChart"), {
  ssr: false,
  loading: () => <div className="h-[180px] animate-pulse rounded-sm bg-[#0F0F14]" />,
});

/** Pit strategy options derived from circuit length + tire deg curves. */
interface StrategyOption {
  name: string;
  stops: number;
  stints: string;
  note: string;
  recommended?: boolean;
}

function buildStrategies(circuit: Circuit): StrategyOption[] {
  const laps = circuit.laps;
  // Soft drops to 0 by ~lap 33, medium ~lap 55, hard outlasts most races.
  const half = Math.round(laps / 2);
  const third = Math.round(laps / 3);

  return [
    {
      name: "ONE-STOP — M→H",
      stops: 1,
      stints: `Medium ${half} / Hard ${laps - half}`,
      note: "Lowest pit-loss. Hard goes long on the second stint.",
      recommended: true,
    },
    {
      name: "TWO-STOP — S→S→M",
      stops: 2,
      stints: `Soft ${third} / Soft ${third} / Medium ${laps - third * 2}`,
      note: "Fastest pace, fresh rubber for late attack. Higher pit-loss risk.",
    },
    {
      name: "ONE-STOP — S→H",
      stops: 1,
      stints: `Soft ${third} / Hard ${laps - third}`,
      note: "Aggressive early stint, manage the long hard run to the flag.",
    },
  ];
}

export function TrackView({ circuit }: { circuit: Circuit }) {
  const [selectedCornerId, setSelectedCornerId] = useState<string | null>(null);

  const cornerByZone = useMemo(() => {
    const map = new Map<string, string>();
    for (const z of circuit.brakingZones) {
      if (z.cornerId) map.set(z.id, z.cornerId);
    }
    return map;
  }, [circuit]);

  const selectedCorner = useMemo(
    () => circuit.cornerDetails.find((c) => c.id === selectedCornerId) ?? null,
    [circuit, selectedCornerId],
  );

  const strategies = useMemo(() => buildStrategies(circuit), [circuit]);

  const hasPath = circuit.svgPath && circuit.svgPath.trim().length > 0;
  const placeholderOval = "M 400 110 C 620 110, 720 220, 720 300 C 720 380, 620 490, 400 490 C 180 490, 80 380, 80 300 C 80 220, 180 110, 400 110 Z";
  const path = hasPath ? circuit.svgPath : placeholderOval;

  const onMarkerSelect = (zoneId: string) => {
    const cornerId = cornerByZone.get(zoneId);
    if (cornerId) setSelectedCornerId(cornerId === selectedCornerId ? null : cornerId);
  };

  const activeZoneId = useMemo(() => {
    if (!selectedCornerId) return null;
    for (const [zoneId, cornerId] of cornerByZone) {
      if (cornerId === selectedCornerId) return zoneId;
    }
    return null;
  }, [cornerByZone, selectedCornerId]);

  return (
    <div className="space-y-6">
      {/* Track stats strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="LENGTH" value={circuit.length.toFixed(3)} unit="km" />
        <StatTile label="CORNERS" value={circuit.corners} />
        <StatTile label="DRS ZONES" value={circuit.drsZones} />
        <StatTile label="RACE LAPS" value={circuit.laps} />
        <StatTile label="LAP RECORD" value={circuit.lapRecord} accent />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Circuit map */}
        <div>
          <div className="relative aspect-[4/3] rounded border border-[#1E1E2A] bg-[#080810]">
            <svg viewBox="0 0 800 600" className="absolute inset-0 h-full w-full">
              {/* Base track */}
              <path d={path} fill="none" stroke="#2A2A3A" strokeWidth="28" strokeLinejoin="round" />
              <path d={path} fill="none" stroke="#444460" strokeWidth="1.5" strokeLinejoin="round" />

              {/* Speed zones (behind interactive markers) */}
              {circuit.speedZones.map((z) => (
                <TrackMarker key={z.id} zone={z} radius={8} />
              ))}
              {/* Overtaking zones */}
              {circuit.overtakingZones.map((z) => (
                <TrackMarker key={z.id} zone={z} radius={8} />
              ))}
              {/* Braking zones — clickable, drive corner panel */}
              {circuit.brakingZones.map((z) => (
                <TrackMarker
                  key={z.id}
                  zone={z}
                  radius={9}
                  active={z.id === activeZoneId}
                  onSelect={onMarkerSelect}
                />
              ))}
            </svg>
          </div>

          {/* Zone legend */}
          <div className="mt-3 flex flex-wrap gap-4 px-1">
            <LegendItem color={zoneColor.braking} label="Braking zone — click for detail" />
            <LegendItem color={zoneColor.overtaking} label="Overtaking zone" />
            <LegendItem color={zoneColor.speed} label="Top-speed zone" />
          </div>
        </div>

        {/* Corner detail panel */}
        <aside>
          <AnimatePresence mode="wait">
            {selectedCorner ? (
              <motion.div
                key={selectedCorner.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
                    CORNER {selectedCorner.number}
                    {selectedCorner.name ? (
                      <span className="ml-2 text-[#E8001C]">{selectedCorner.name}</span>
                    ) : null}
                  </h3>
                  <button
                    onClick={() => setSelectedCornerId(null)}
                    className="font-[family-name:var(--font-condensed)] text-xs text-[#666680] hover:text-[#E8E8E0]"
                    aria-label="Close corner detail"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <StatTile label="APEX SPEED" value={selectedCorner.apexSpeed} unit="km/h" />
                  <StatTile label="BRAKING DISTANCE" value={selectedCorner.brakingDistance} unit="m" />
                  <StatTile label="RECOMMENDED GEAR" value={selectedCorner.gear} accent />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[200px] items-center justify-center rounded-sm border border-dashed border-[#1E1E2A] bg-[#0B0B11] p-6 text-center"
              >
                <p className="font-[family-name:var(--font-condensed)] text-sm uppercase tracking-widest text-[#666680]">
                  Select a braking zone
                  <br />
                  on the circuit map
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tire degradation chart */}
        <section className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            TIRE DEGRADATION — STINT LIFE
          </h3>
          <TyreDegChart data={circuit.tyreDegradationData} />
          <div className="mt-2 flex gap-4 px-1">
            <LegendItem color={zoneColor.braking} label="Soft" />
            <LegendItem color={zoneColor.speed} label="Medium" />
            <LegendItem color="#888899" label="Hard" />
          </div>
        </section>

        {/* Race strategy panel */}
        <section className="rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4">
          <h3 className="mb-3 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
            RACE STRATEGY — {circuit.laps} LAPS
          </h3>
          <div className="space-y-2">
            {strategies.map((s) => (
              <div
                key={s.name}
                className={`rounded-sm border p-3 ${
                  s.recommended ? "border-l-2 border-l-[#E8001C] border-[#1E1E2A]" : "border-[#1E1E2A]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-condensed)] text-sm font-bold uppercase tracking-wide text-[#E8E8E0]">
                    {s.name}
                  </span>
                  {s.recommended ? (
                    <span className="rounded-sm bg-[#2A0008] px-2 py-0.5 font-[family-name:var(--font-condensed)] text-[10px] font-bold uppercase tracking-widest text-[#E8001C]">
                      Recommended
                    </span>
                  ) : (
                    <span className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
                      {s.stops} stop{s.stops > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#B0B0C0]">
                  {s.stints}
                </p>
                <p className="mt-0.5 font-[family-name:var(--font-condensed)] text-[11px] text-[#666680]">
                  {s.note}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-wider text-[#666680]">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
