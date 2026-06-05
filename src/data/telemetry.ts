import type { LiveRiderState, TireCompound, TrackPosition } from "./types";

/**
 * Live session snapshot — a current qualifying/race feed for all 20 riders.
 * The session is set at the upcoming round (Okuma Speedway), so `trackPosition`
 * coordinates sit along that circuit's SVG path.
 *
 * Lap times are derived from the three sector times so they always sum to the
 * lap time exactly (well within ±0.001s). Sectors are stored as strings to the
 * millisecond; the lap string is built by summing the parsed seconds.
 */

/** Format seconds (e.g. 88.442) as a lap time string "1:28.442". */
const toLapTime = (totalSeconds: number): string => {
  const rounded = Math.round(totalSeconds * 1000) / 1000;
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded - minutes * 60;
  const secStr = seconds.toFixed(3).padStart(6, "0");
  return `${minutes}:${secStr}`;
};

interface SnapshotSeed {
  riderId: string;
  position: number;
  gap: string;
  s1: number; // sector seconds
  s2: number;
  s3: number;
  tireCompound: TireCompound;
  tireAge: number;
  topSpeed: number;
  trackPosition: TrackPosition;
}

const seed = (s: SnapshotSeed): LiveRiderState => {
  const lapSeconds = s.s1 + s.s2 + s.s3;
  return {
    riderId: s.riderId,
    position: s.position,
    gap: s.gap,
    lastLap: toLapTime(lapSeconds),
    sector1: s.s1.toFixed(3),
    sector2: s.s2.toFixed(3),
    sector3: s.s3.toFixed(3),
    tireCompound: s.tireCompound,
    tireAge: s.tireAge,
    topSpeed: s.topSpeed,
    trackPosition: s.trackPosition,
  };
};

/** Order follows the live running order P1–P20. */
const seeds: SnapshotSeed[] = [
  { riderId: "1", position: 1, gap: "Leader", s1: 29.512, s2: 33.118, s3: 26.213, tireCompound: "S", tireAge: 4, topSpeed: 331, trackPosition: { x: 400, y: 100 } },
  { riderId: "5", position: 2, gap: "+0.214", s1: 29.601, s2: 33.090, s3: 26.236, tireCompound: "S", tireAge: 4, topSpeed: 329, trackPosition: { x: 520, y: 118 } },
  { riderId: "2", position: 3, gap: "+0.880", s1: 29.744, s2: 33.201, s3: 26.350, tireCompound: "M", tireAge: 3, topSpeed: 333, trackPosition: { x: 640, y: 180 } },
  { riderId: "9", position: 4, gap: "+1.553", s1: 29.820, s2: 33.260, s3: 26.401, tireCompound: "S", tireAge: 5, topSpeed: 327, trackPosition: { x: 700, y: 300 } },
  { riderId: "11", position: 5, gap: "+2.110", s1: 29.905, s2: 33.318, s3: 26.470, tireCompound: "S", tireAge: 4, topSpeed: 326, trackPosition: { x: 660, y: 410 } },
  { riderId: "6", position: 6, gap: "+2.998", s1: 29.988, s2: 33.377, s3: 26.512, tireCompound: "M", tireAge: 6, topSpeed: 330, trackPosition: { x: 520, y: 455 } },
  { riderId: "12", position: 7, gap: "+3.642", s1: 30.044, s2: 33.420, s3: 26.560, tireCompound: "M", tireAge: 5, topSpeed: 324, trackPosition: { x: 400, y: 455 } },
  { riderId: "7", position: 8, gap: "+4.331", s1: 30.110, s2: 33.488, s3: 26.601, tireCompound: "M", tireAge: 4, topSpeed: 322, trackPosition: { x: 320, y: 320 } },
  { riderId: "16", position: 9, gap: "+5.007", s1: 30.188, s2: 33.540, s3: 26.655, tireCompound: "H", tireAge: 7, topSpeed: 325, trackPosition: { x: 250, y: 270 } },
  { riderId: "8", position: 10, gap: "+5.770", s1: 30.255, s2: 33.602, s3: 26.700, tireCompound: "M", tireAge: 5, topSpeed: 321, trackPosition: { x: 180, y: 300 } },
  { riderId: "3", position: 11, gap: "+6.441", s1: 30.320, s2: 33.660, s3: 26.748, tireCompound: "S", tireAge: 8, topSpeed: 323, trackPosition: { x: 130, y: 220 } },
  { riderId: "18", position: 12, gap: "+7.118", s1: 30.388, s2: 33.711, s3: 26.790, tireCompound: "M", tireAge: 6, topSpeed: 319, trackPosition: { x: 160, y: 160 } },
  { riderId: "15", position: 13, gap: "+7.902", s1: 30.460, s2: 33.778, s3: 26.840, tireCompound: "M", tireAge: 5, topSpeed: 320, trackPosition: { x: 240, y: 110 } },
  { riderId: "13", position: 14, gap: "+8.551", s1: 30.521, s2: 33.830, s3: 26.882, tireCompound: "H", tireAge: 9, topSpeed: 318, trackPosition: { x: 320, y: 104 } },
  { riderId: "19", position: 15, gap: "+9.244", s1: 30.590, s2: 33.890, s3: 26.930, tireCompound: "M", tireAge: 6, topSpeed: 317, trackPosition: { x: 360, y: 130 } },
  { riderId: "17", position: 16, gap: "+10.003", s1: 30.660, s2: 33.951, s3: 26.978, tireCompound: "H", tireAge: 8, topSpeed: 316, trackPosition: { x: 440, y: 270 } },
  { riderId: "4", position: 17, gap: "+10.880", s1: 30.733, s2: 34.012, s3: 27.025, tireCompound: "M", tireAge: 7, topSpeed: 315, trackPosition: { x: 380, y: 300 } },
  { riderId: "14", position: 18, gap: "+11.770", s1: 30.808, s2: 34.080, s3: 27.078, tireCompound: "H", tireAge: 10, topSpeed: 314, trackPosition: { x: 300, y: 360 } },
  { riderId: "10", position: 19, gap: "+12.661", s1: 30.882, s2: 34.140, s3: 27.122, tireCompound: "M", tireAge: 8, topSpeed: 313, trackPosition: { x: 220, y: 400 } },
  { riderId: "20", position: 20, gap: "+13.998", s1: 30.960, s2: 34.210, s3: 27.180, tireCompound: "H", tireAge: 11, topSpeed: 312, trackPosition: { x: 200, y: 420 } },
];

/** Current live running order for all 20 riders. */
export const liveTelemetry: LiveRiderState[] = seeds.map(seed);

export const liveStateForRider = (riderId: string): LiveRiderState | undefined =>
  liveTelemetry.find((s) => s.riderId === riderId);

/** The circuit this live session is taking place at. */
export const liveSessionCircuitId = "okuma";
