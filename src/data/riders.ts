import type { Rider, RiderStats } from "./types";
import { resultsForRider } from "./raceResults";

/**
 * 20 fictional riders, two per team. Career `stats` are fictional;
 * `stats.points` is the current-season total after round 10 and matches the
 * cumulative points produced in raceResults.ts. `seasonResults` are wired from
 * the top-5 classifications, so non-scoring riders carry an empty array.
 */

const stats = (s: RiderStats): RiderStats => s;

interface RiderSeed {
  id: string;
  name: string;
  number: number;
  nationality: string;
  teamId: string;
  stats: RiderStats;
}

const seeds: RiderSeed[] = [
  {
    id: "1",
    name: "Marco Veltri",
    number: 1,
    nationality: "ITA",
    teamId: "vortex",
    stats: stats({ titles: 3, wins: 41, podiums: 96, poles: 33, fastestLaps: 38, points: 212, seasons: 9, avgFinish: 2.4 }),
  },
  {
    id: "2",
    name: "Kai Thorsmund",
    number: 37,
    nationality: "NOR",
    teamId: "azura",
    stats: stats({ titles: 1, wins: 18, podiums: 54, poles: 14, fastestLaps: 17, points: 164, seasons: 7, avgFinish: 4.1 }),
  },
  {
    id: "3",
    name: "Enzo Farrari",
    number: 99,
    nationality: "BRA",
    teamId: "helix",
    stats: stats({ titles: 0, wins: 4, podiums: 21, poles: 5, fastestLaps: 6, points: 11, seasons: 6, avgFinish: 8.7 }),
  },
  {
    id: "4",
    name: "Jaya Srinath",
    number: 12,
    nationality: "IND",
    teamId: "kodex",
    stats: stats({ titles: 0, wins: 0, podiums: 7, poles: 1, fastestLaps: 2, points: 0, seasons: 4, avgFinish: 11.5 }),
  },
  {
    id: "5",
    name: "Luca Mertens",
    number: 55,
    nationality: "BEL",
    teamId: "phantom",
    stats: stats({ titles: 2, wins: 33, podiums: 81, poles: 27, fastestLaps: 29, points: 200, seasons: 8, avgFinish: 2.9 }),
  },
  {
    id: "6",
    name: "Ryo Hashida",
    number: 44,
    nationality: "JPN",
    teamId: "ironfront",
    stats: stats({ titles: 0, wins: 6, podiums: 28, poles: 7, fastestLaps: 9, points: 50, seasons: 7, avgFinish: 7.2 }),
  },
  {
    id: "7",
    name: "Carlos Fuentes",
    number: 23,
    nationality: "MEX",
    teamId: "zenith",
    stats: stats({ titles: 0, wins: 2, podiums: 15, poles: 3, fastestLaps: 4, points: 13, seasons: 5, avgFinish: 9.4 }),
  },
  {
    id: "8",
    name: "Abi Nkosi",
    number: 7,
    nationality: "ZAF",
    teamId: "dune",
    stats: stats({ titles: 0, wins: 1, podiums: 9, poles: 2, fastestLaps: 3, points: 29, seasons: 4, avgFinish: 10.1 }),
  },
  {
    id: "9",
    name: "Petra Vanek",
    number: 88,
    nationality: "CZE",
    teamId: "celsius",
    stats: stats({ titles: 0, wins: 9, podiums: 37, poles: 11, fastestLaps: 12, points: 122, seasons: 6, avgFinish: 5.3 }),
  },
  {
    id: "10",
    name: "Sam Ardley",
    number: 19,
    nationality: "AUS",
    teamId: "nova",
    stats: stats({ titles: 0, wins: 0, podiums: 4, poles: 0, fastestLaps: 1, points: 0, seasons: 3, avgFinish: 12.8 }),
  },
  {
    id: "11",
    name: "Diego Salcedo",
    number: 21,
    nationality: "ESP",
    teamId: "vortex",
    stats: stats({ titles: 0, wins: 3, podiums: 19, poles: 4, fastestLaps: 5, points: 40, seasons: 5, avgFinish: 7.9 }),
  },
  {
    id: "12",
    name: "Tomasz Wojcik",
    number: 64,
    nationality: "POL",
    teamId: "azura",
    stats: stats({ titles: 0, wins: 1, podiums: 11, poles: 2, fastestLaps: 3, points: 11, seasons: 5, avgFinish: 9.0 }),
  },
  {
    id: "13",
    name: "Mateus Okafor",
    number: 5,
    nationality: "NGA",
    teamId: "helix",
    stats: stats({ titles: 0, wins: 0, podiums: 6, poles: 1, fastestLaps: 1, points: 0, seasons: 3, avgFinish: 11.9 }),
  },
  {
    id: "14",
    name: "Finn Halloran",
    number: 28,
    nationality: "IRL",
    teamId: "kodex",
    stats: stats({ titles: 0, wins: 0, podiums: 3, poles: 0, fastestLaps: 0, points: 0, seasons: 2, avgFinish: 13.4 }),
  },
  {
    id: "15",
    name: "Andrei Branco",
    number: 71,
    nationality: "ROU",
    teamId: "phantom",
    stats: stats({ titles: 0, wins: 0, podiums: 5, poles: 1, fastestLaps: 2, points: 0, seasons: 4, avgFinish: 12.1 }),
  },
  {
    id: "16",
    name: "Stefan Kohler",
    number: 33,
    nationality: "AUT",
    teamId: "ironfront",
    stats: stats({ titles: 0, wins: 0, podiums: 8, poles: 1, fastestLaps: 2, points: 0, seasons: 6, avgFinish: 10.6 }),
  },
  {
    id: "17",
    name: "Hugo Alvares",
    number: 46,
    nationality: "POR",
    teamId: "zenith",
    stats: stats({ titles: 0, wins: 0, podiums: 2, poles: 0, fastestLaps: 1, points: 0, seasons: 3, avgFinish: 13.0 }),
  },
  {
    id: "18",
    name: "Theo Bakker",
    number: 9,
    nationality: "NED",
    teamId: "dune",
    stats: stats({ titles: 0, wins: 0, podiums: 6, poles: 1, fastestLaps: 1, points: 0, seasons: 4, avgFinish: 11.2 }),
  },
  {
    id: "19",
    name: "Yusuf Demir",
    number: 53,
    nationality: "TUR",
    teamId: "celsius",
    stats: stats({ titles: 0, wins: 0, podiums: 4, poles: 0, fastestLaps: 1, points: 0, seasons: 3, avgFinish: 12.5 }),
  },
  {
    id: "20",
    name: "Riley Cassidy",
    number: 17,
    nationality: "NZL",
    teamId: "nova",
    stats: stats({ titles: 0, wins: 0, podiums: 1, poles: 0, fastestLaps: 0, points: 0, seasons: 2, avgFinish: 14.2 }),
  },
];

export const riders: Rider[] = seeds.map((seed) => ({
  ...seed,
  seasonResults: resultsForRider(seed.id),
}));

export const riderById = (id: string): Rider | undefined =>
  riders.find((r) => r.id === id);

export const ridersByTeam = (teamId: string): Rider[] =>
  riders.filter((r) => r.teamId === teamId);

/** Riders sorted by current-season points, highest first (championship order). */
export const championshipStandings: Rider[] = [...riders].sort(
  (a, b) => b.stats.points - a.stats.points,
);
