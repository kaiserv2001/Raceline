"use client";

import type { GarageSetup, TireCompound } from "@/data/types";
import { compoundLabel } from "@/lib/designTokens";

/**
 * BikeSchematic — a simplified SVG side-view of a race bike with labeled callout
 * lines pointing to the active setup zones. Reads the live garage setup so the
 * callout values update as the engineer tweaks sliders.
 *
 * Pure presentation; coordinates are hand-placed in the 0 0 420 260 viewBox.
 */

interface BikeSchematicProps {
  setup: GarageSetup;
  teamColor: string;
  tireCompound: TireCompound;
}

interface Callout {
  /** Anchor point on the bike. */
  ax: number;
  ay: number;
  /** Label end point. */
  lx: number;
  ly: number;
  /** Text anchor side. */
  side: "start" | "end";
  title: string;
  value: string;
}

export function BikeSchematic({ setup, teamColor, tireCompound }: BikeSchematicProps) {
  const callouts: Callout[] = [
    {
      ax: 96,
      ay: 150,
      lx: 30,
      ly: 70,
      side: "start",
      title: "FRONT SUSP",
      value: `${setup.suspension.frontCompression}/${setup.suspension.frontRebound}`,
    },
    {
      ax: 324,
      ay: 150,
      lx: 392,
      ly: 70,
      side: "end",
      title: "REAR SUSP",
      value: `${setup.suspension.rearCompression}/${setup.suspension.rearRebound}`,
    },
    {
      ax: 210,
      ay: 96,
      lx: 210,
      ly: 28,
      side: "start",
      title: "AERO F/R",
      value: `${setup.aero.frontDownforce}/${setup.aero.rearDownforce}`,
    },
    {
      ax: 96,
      ay: 196,
      lx: 60,
      ly: 244,
      side: "start",
      title: "BRAKE BAL",
      value: `${setup.brakeBalance}%`,
    },
    {
      ax: 324,
      ay: 196,
      lx: 360,
      ly: 244,
      side: "end",
      title: "TIRE",
      value: compoundLabel[tireCompound],
    },
  ];

  return (
    <svg viewBox="0 0 420 260" className="h-auto w-full">
      {/* Ground line */}
      <line x1="40" y1="210" x2="380" y2="210" stroke="#1E1E2A" strokeWidth="1" strokeDasharray="4 4" />

      {/* Wheels */}
      <circle cx="96" cy="196" r="34" fill="#080810" stroke="#444460" strokeWidth="2" />
      <circle cx="96" cy="196" r="12" fill="none" stroke="#2A2A3A" strokeWidth="1.5" />
      <circle cx="324" cy="196" r="34" fill="#080810" stroke="#444460" strokeWidth="2" />
      <circle cx="324" cy="196" r="12" fill="none" stroke="#2A2A3A" strokeWidth="1.5" />

      {/* Tire compound ring tint on rear wheel */}
      <circle cx="324" cy="196" r="34" fill="none" stroke={teamColor} strokeWidth="2" opacity="0.35" />

      {/* Forks / front suspension */}
      <line x1="96" y1="196" x2="120" y2="120" stroke="#666680" strokeWidth="3" strokeLinecap="round" />
      {/* Swingarm / rear suspension */}
      <line x1="324" y1="196" x2="250" y2="150" stroke="#666680" strokeWidth="3" strokeLinecap="round" />

      {/* Body / tank / seat — stylized fairing */}
      <path
        d="M 120 120 C 150 96, 210 92, 250 100 C 280 106, 300 120, 250 150 L 160 150 C 130 150, 110 138, 120 120 Z"
        fill={teamColor}
        opacity="0.18"
        stroke={teamColor}
        strokeWidth="1.5"
      />
      {/* Seat hump */}
      <path d="M 250 100 C 280 96, 300 104, 300 124 L 264 130 C 256 116, 250 108, 250 100 Z" fill="#0F0F14" stroke="#444460" strokeWidth="1.2" />
      {/* Front nose */}
      <path d="M 120 120 L 96 138 L 110 150 L 150 150 Z" fill="#0F0F14" stroke="#444460" strokeWidth="1.2" />

      {/* Callout lines + labels */}
      {callouts.map((c) => (
        <g key={c.title}>
          <line x1={c.ax} y1={c.ay} x2={c.lx} y2={c.ly} stroke="#2A2A3A" strokeWidth="1" />
          <circle cx={c.ax} cy={c.ay} r="2.5" fill={teamColor} />
          <text
            x={c.lx}
            y={c.ly - 6}
            textAnchor={c.side}
            fontSize="9"
            fontFamily="var(--font-condensed), sans-serif"
            fill="#666680"
            style={{ letterSpacing: "0.12em" }}
          >
            {c.title}
          </text>
          <text
            x={c.lx}
            y={c.ly + 6}
            textAnchor={c.side}
            fontSize="13"
            fontWeight={700}
            fontFamily="var(--font-condensed), sans-serif"
            fill="#E8E8E0"
          >
            {c.value}
          </text>
        </g>
      ))}
    </svg>
  );
}
