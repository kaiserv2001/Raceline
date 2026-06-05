/**
 * Apex Grid — shared TypeScript interfaces.
 * All data shapes consumed by screens and components live here.
 * Everything is fictional; no real motorsport trademarks are used.
 */

export type TireCompound = "S" | "M" | "H" | "W";

export type Weather = "Dry" | "Wet" | "Overcast";

export type TrackType = "Street" | "Permanent" | "Mixed";

export type EngineConfig = "V4" | "Inline-4";

export type SetupPreset = "SOFT" | "BALANCED" | "AGGRESSIVE";

export type ZoneType = "braking" | "overtaking" | "speed";

export interface Team {
  id: string;
  name: string;
  color: string; // hex
  engine: EngineConfig;
  country: string;
}

export interface RiderStats {
  titles: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  points: number; // current season
  seasons: number;
  avgFinish: number;
}

export interface RaceResult {
  circuitId: string;
  round: number;
  position: number | "DNF" | "DNS";
  gap: string; // e.g. "+4.832" or "Leader"
  points: number;
  cumulativePoints: number;
  tireStrategy: TireCompound[];
  fastestLap?: string; // "1:38.442"
}

export interface Rider {
  id: string;
  name: string;
  number: number;
  nationality: string; // ISO 3-letter e.g. "ITA"
  teamId: string;
  stats: RiderStats;
  seasonResults: RaceResult[];
}

export interface Race {
  id: string;
  round: number;
  circuitId: string;
  name: string;
  country: string;
  date: string; // ISO "2025-03-23"
  completed: boolean;
  weather: Weather;
  winner?: string; // rider id
  fastestLap?: string;
  trackType: TrackType;
}

export interface Zone {
  id: string;
  type: ZoneType;
  x: number; // SVG coordinate
  y: number;
  cornerId?: string;
}

export interface CornerDetail {
  id: string;
  number: number;
  name?: string;
  apexSpeed: number; // km/h
  brakingDistance: number; // meters
  gear: number; // 1-6
}

export interface TyreDegData {
  lap: number;
  soft: number; // 0-100 remaining %
  medium: number;
  hard: number;
}

export interface Circuit {
  id: string;
  name: string;
  country: string;
  city: string;
  laps: number;
  length: number; // km
  corners: number;
  drsZones: number;
  lapRecord: string; // "1:38.442"
  svgPath: string; // SVG path data string
  brakingZones: Zone[];
  overtakingZones: Zone[];
  speedZones: Zone[];
  cornerDetails: CornerDetail[];
  tyreDegradationData: TyreDegData[];
}

export interface GarageSetup {
  teamId: string;
  preset: SetupPreset;
  tireCompound: TireCompound;
  suspension: {
    frontPreload: number; // 0-10 clicks
    frontCompression: number; // 0-20
    frontRebound: number; // 0-20
    rearPreload: number;
    rearCompression: number;
    rearRebound: number;
  };
  aero: {
    frontDownforce: number; // 1-10
    rearDownforce: number;
  };
  brakeBalance: number; // 50-60 (front %)
  fuelLoad: number; // 17.0-22.0 L
}

export interface TrackPosition {
  x: number; // SVG coordinate
  y: number;
}

export interface LiveRiderState {
  riderId: string;
  position: number;
  gap: string;
  lastLap: string;
  sector1: string;
  sector2: string;
  sector3: string;
  tireCompound: TireCompound;
  tireAge: number; // laps on current tire
  topSpeed: number; // km/h
  trackPosition: TrackPosition;
}
