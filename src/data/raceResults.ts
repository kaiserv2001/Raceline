import type { RaceResult, TireCompound } from "./types";

/**
 * Final top-5 finishing order for each of the 10 completed rounds.
 * Keyed by round number. Lap-by-lap data is not modelled — only final
 * classification (position, gap, points, tyre strategy, fastest lap).
 *
 * Points: 25-20-16-13-11 for positions 1–5 (standard top-5 scale).
 * `cumulativePoints` is the rider's running championship total *after* that race.
 */

interface ResultRow {
  riderId: string;
  result: RaceResult;
}

const POINTS: Record<number, number> = { 1: 25, 2: 20, 3: 16, 4: 13, 5: 11 };

const row = (
  riderId: string,
  circuitId: string,
  round: number,
  position: number,
  gap: string,
  cumulativePoints: number,
  tireStrategy: TireCompound[],
  fastestLap?: string,
): ResultRow => ({
  riderId,
  result: {
    circuitId,
    round,
    position,
    gap,
    points: POINTS[position] ?? 0,
    cumulativePoints,
    tireStrategy,
    fastestLap,
  },
});

/** Top-5 classification per completed round. */
export const raceResultsByRound: Record<number, ResultRow[]> = {
  1: [
    row("1", "sandara", 1, 1, "Leader", 25, ["M", "M"], "1:48.940"),
    row("5", "sandara", 1, 2, "+2.118", 20, ["M", "S"]),
    row("2", "sandara", 1, 3, "+5.643", 16, ["M", "M"]),
    row("6", "sandara", 1, 4, "+8.991", 13, ["H", "M"]),
    row("9", "sandara", 1, 5, "+11.204", 11, ["M", "S"]),
  ],
  2: [
    row("5", "veloria", 2, 1, "Leader", 45, ["S", "M"], "1:38.512"),
    row("1", "veloria", 2, 2, "+1.332", 45, ["M", "M"]),
    row("9", "veloria", 2, 3, "+4.870", 27, ["S", "S"]),
    row("2", "veloria", 2, 4, "+6.215", 29, ["M", "M"]),
    row("11", "veloria", 2, 5, "+9.880", 11, ["M", "S"]),
  ],
  3: [
    row("1", "calderon", 3, 1, "Leader", 70, ["M", "M"], "1:36.420"),
    row("2", "calderon", 3, 2, "+0.842", 49, ["M", "S"]),
    row("5", "calderon", 3, 3, "+3.119", 61, ["S", "M"]),
    row("7", "calderon", 3, 4, "+7.554", 13, ["M", "M"]),
    row("6", "calderon", 3, 5, "+10.002", 24, ["H", "M"]),
  ],
  4: [
    row("2", "soltera", 4, 1, "Leader", 74, ["M", "S"], "1:30.221"),
    row("1", "soltera", 4, 2, "+2.760", 90, ["M", "M"]),
    row("11", "soltera", 4, 3, "+4.488", 27, ["S", "M"]),
    row("5", "soltera", 4, 4, "+6.913", 74, ["S", "S"]),
    row("3", "soltera", 4, 5, "+9.225", 11, ["M", "M"]),
  ],
  5: [
    row("5", "rivenna", 5, 1, "Leader", 99, ["W", "W"], "1:51.330"),
    row("9", "rivenna", 5, 2, "+6.204", 47, ["W", "W"]),
    row("1", "rivenna", 5, 3, "+9.881", 106, ["W", "W"]),
    row("8", "rivenna", 5, 4, "+14.330", 13, ["W", "W"]),
    row("2", "rivenna", 5, 5, "+18.772", 85, ["W", "W"]),
  ],
  6: [
    row("1", "tessaro", 6, 1, "Leader", 131, ["S", "S"], "1:25.774"),
    row("5", "tessaro", 6, 2, "+1.005", 119, ["S", "M"]),
    row("2", "tessaro", 6, 3, "+3.442", 101, ["M", "S"]),
    row("9", "tessaro", 6, 4, "+5.870", 60, ["S", "S"]),
    row("12", "tessaro", 6, 5, "+8.119", 11, ["M", "M"]),
  ],
  7: [
    row("9", "kestrel", 7, 1, "Leader", 85, ["M", "M"], "1:42.660"),
    row("1", "kestrel", 7, 2, "+0.512", 151, ["M", "S"]),
    row("5", "kestrel", 7, 3, "+2.998", 135, ["S", "M"]),
    row("6", "kestrel", 7, 4, "+5.661", 37, ["H", "M"]),
    row("2", "kestrel", 7, 5, "+7.440", 112, ["M", "M"]),
  ],
  8: [
    row("2", "amberlin", 8, 1, "Leader", 137, ["M", "S"], "1:33.918"),
    row("5", "amberlin", 8, 2, "+1.876", 155, ["S", "M"]),
    row("1", "amberlin", 8, 3, "+3.204", 167, ["M", "M"]),
    row("11", "amberlin", 8, 4, "+6.715", 40, ["S", "M"]),
    row("9", "amberlin", 8, 5, "+9.330", 96, ["M", "S"]),
  ],
  9: [
    row("5", "nordhaven", 9, 1, "Leader", 180, ["W", "W"], "1:53.045"),
    row("1", "nordhaven", 9, 2, "+4.118", 187, ["W", "W"]),
    row("8", "nordhaven", 9, 3, "+8.992", 29, ["W", "W"]),
    row("9", "nordhaven", 9, 4, "+12.554", 109, ["W", "W"]),
    row("2", "nordhaven", 9, 5, "+15.880", 148, ["W", "W"]),
  ],
  10: [
    row("1", "dawnport", 10, 1, "Leader", 212, ["S", "M"], "1:28.839"),
    row("5", "dawnport", 10, 2, "+0.998", 200, ["S", "S"]),
    row("2", "dawnport", 10, 3, "+2.443", 164, ["M", "S"]),
    row("9", "dawnport", 10, 4, "+5.110", 122, ["S", "M"]),
    row("6", "dawnport", 10, 5, "+7.880", 50, ["M", "M"]),
  ],
};

/** Flat list of every top-5 result across all completed rounds. */
export const allRaceResults: ResultRow[] = Object.values(raceResultsByRound).flat();

/** All top-5 results for a given rider, ordered by round. */
export const resultsForRider = (riderId: string): RaceResult[] =>
  allRaceResults
    .filter((r) => r.riderId === riderId)
    .map((r) => r.result)
    .sort((a, b) => a.round - b.round);
