import type { GarageSetup, SetupPreset, TireCompound } from "./types";
import { teams } from "./teams";

/**
 * 3 setup presets (SOFT / BALANCED / AGGRESSIVE) for each of the 10 teams = 30
 * GarageSetup objects. Values stay inside the documented ranges:
 *  - suspension preload 0-10, compression/rebound 0-20
 *  - aero downforce 1-10, brake balance 52-59, fuel 17.0-22.0 L
 *
 * The preset character is consistent across teams, then nudged per team so each
 * garage reads slightly differently:
 *  - SOFT       → softer springs, more downforce, conservative fuel, S tyre
 *  - BALANCED   → middle of the road, M tyre
 *  - AGGRESSIVE → stiffer, less downforce, lighter fuel, S tyre for attack
 */

interface PresetProfile {
  preset: SetupPreset;
  tireCompound: TireCompound;
  suspension: GarageSetup["suspension"];
  aero: GarageSetup["aero"];
  brakeBalance: number;
  fuelLoad: number;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

const baseProfiles: PresetProfile[] = [
  {
    preset: "SOFT",
    tireCompound: "S",
    suspension: {
      frontPreload: 3,
      frontCompression: 7,
      frontRebound: 8,
      rearPreload: 3,
      rearCompression: 8,
      rearRebound: 9,
    },
    aero: { frontDownforce: 8, rearDownforce: 9 },
    brakeBalance: 54,
    fuelLoad: 21.0,
  },
  {
    preset: "BALANCED",
    tireCompound: "M",
    suspension: {
      frontPreload: 5,
      frontCompression: 11,
      frontRebound: 11,
      rearPreload: 5,
      rearCompression: 12,
      rearRebound: 12,
    },
    aero: { frontDownforce: 6, rearDownforce: 6 },
    brakeBalance: 56,
    fuelLoad: 19.5,
  },
  {
    preset: "AGGRESSIVE",
    tireCompound: "S",
    suspension: {
      frontPreload: 8,
      frontCompression: 16,
      frontRebound: 15,
      rearPreload: 8,
      rearCompression: 17,
      rearRebound: 16,
    },
    aero: { frontDownforce: 4, rearDownforce: 3 },
    brakeBalance: 58,
    fuelLoad: 17.5,
  },
];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Per-team nudges so each garage's numbers vary slightly. */
const teamNudge = (teamIndex: number, profile: PresetProfile): GarageSetup => {
  const susBump = ((teamIndex % 3) - 1); // -1, 0, +1 across teams
  const aeroBump = (teamIndex % 2 === 0 ? 1 : 0);
  const brakeBump = ((teamIndex % 4) - 1) * 0.5; // -0.5 .. +1.0
  const fuelBump = ((teamIndex % 3) - 1) * 0.3;

  return {
    teamId: teams[teamIndex].id,
    preset: profile.preset,
    tireCompound: profile.tireCompound,
    suspension: {
      frontPreload: clamp(profile.suspension.frontPreload + susBump, 0, 10),
      frontCompression: clamp(profile.suspension.frontCompression + susBump, 0, 20),
      frontRebound: clamp(profile.suspension.frontRebound + susBump, 0, 20),
      rearPreload: clamp(profile.suspension.rearPreload + susBump, 0, 10),
      rearCompression: clamp(profile.suspension.rearCompression + susBump, 0, 20),
      rearRebound: clamp(profile.suspension.rearRebound + susBump, 0, 20),
    },
    aero: {
      frontDownforce: clamp(profile.aero.frontDownforce + aeroBump, 1, 10),
      rearDownforce: clamp(profile.aero.rearDownforce + aeroBump, 1, 10),
    },
    brakeBalance: clamp(Math.round(profile.brakeBalance + brakeBump), 52, 59),
    fuelLoad: round1(clamp(profile.fuelLoad + fuelBump, 17.0, 22.0)),
  };
};

/** 30 setups: 10 teams × 3 presets. */
export const garagePresets: GarageSetup[] = teams.flatMap((_, teamIndex) =>
  baseProfiles.map((profile) => teamNudge(teamIndex, profile)),
);

export const presetsForTeam = (teamId: string): GarageSetup[] =>
  garagePresets.filter((g) => g.teamId === teamId);

export const presetForTeam = (
  teamId: string,
  preset: SetupPreset,
): GarageSetup | undefined =>
  garagePresets.find((g) => g.teamId === teamId && g.preset === preset);
