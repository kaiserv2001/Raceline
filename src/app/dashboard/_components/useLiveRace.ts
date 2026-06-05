"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { LiveRiderState } from "@/data/types";
import { liveTelemetry } from "@/data/telemetry";

/**
 * useLiveRace — portfolio "live feed" mock. Rather than a WebSocket, it cycles
 * through pre-built snapshots derived from the base liveTelemetry fixture on a
 * fixed interval, nudging each rider's track position along the circuit path
 * and jittering sector/lap/speed numbers so the dashboard feels alive.
 *
 * No real data source — this is a deterministic illusion. Respects
 * prefers-reduced-motion by holding the first snapshot (no ticking).
 */

const TICK_MS = 3000;
const SNAPSHOT_COUNT = 8;

/** Parse "1:28.442" or "28.442" into total seconds. */
function parseTime(t: string): number {
  const [a, b] = t.split(":");
  return b === undefined ? Number(a) : Number(a) * 60 + Number(b);
}

/** Format seconds back to a mm:ss.mmm lap string. */
function formatLap(total: number): string {
  const minutes = Math.floor(total / 60);
  const seconds = total - minutes * 60;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

/**
 * Move a track position a small step "around" the circuit by rotating it about
 * the circuit's visual centroid. Cheap, path-free, and keeps dots on the loop
 * well enough for a broadcast-style map.
 */
function advancePosition(
  x: number,
  y: number,
  angleStep: number,
): { x: number; y: number } {
  const cx = 400;
  const cy = 280;
  const dx = x - cx;
  const dy = y - cy;
  const cos = Math.cos(angleStep);
  const sin = Math.sin(angleStep);
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

/** Build a single perturbed snapshot of the full field for a given tick. */
function buildSnapshot(base: LiveRiderState[], tick: number): LiveRiderState[] {
  // Each rider advances slightly; faster (lower position) riders edge ahead.
  const baseAngle = 0.32 * tick;

  return base.map((rider, idx) => {
    const angle = baseAngle - idx * 0.04;
    const pos = advancePosition(
      rider.trackPosition.x,
      rider.trackPosition.y,
      angle,
    );

    // Jitter sectors deterministically per tick so colors flash but stay stable.
    const wobble = Math.sin((tick + idx) * 1.3) * 0.12;
    const s1 = parseTime(rider.sector1) + wobble;
    const s2 = parseTime(rider.sector2) - wobble * 0.5;
    const s3 = parseTime(rider.sector3) + wobble * 0.3;
    const lap = s1 + s2 + s3;

    const speedJitter = Math.round(Math.sin((tick + idx) * 0.9) * 4);

    return {
      ...rider,
      trackPosition: pos,
      sector1: s1.toFixed(3),
      sector2: s2.toFixed(3),
      sector3: s3.toFixed(3),
      lastLap: formatLap(lap),
      topSpeed: rider.topSpeed + speedJitter,
    };
  });
}

export interface LiveRace {
  field: LiveRiderState[];
  tick: number;
  currentLap: number;
  totalLaps: number;
}

const TOTAL_LAPS = 30;

export function useLiveRace(): LiveRace {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    intervalRef.current = setInterval(() => {
      setTick((t) => (t + 1) % SNAPSHOT_COUNT);
    }, TICK_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reduceMotion]);

  const field = useMemo(() => buildSnapshot(liveTelemetry, tick), [tick]);

  // Lap counter advances one lap per tick, looping near race end.
  const currentLap = 18 + (tick % (TOTAL_LAPS - 18 + 1));

  return { field, tick, currentLap, totalLaps: TOTAL_LAPS };
}
