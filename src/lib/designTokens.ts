/**
 * Apex Grid — design tokens.
 * Central source for color values, compound styles, and texture helpers used
 * across the component library. Keeping these here avoids magic hex strings
 * scattered through every component and guarantees visual consistency.
 */

import type { CSSProperties } from "react";
import type { TireCompound, Weather } from "@/data/types";

/** Raw color palette — mirrors the @theme tokens in globals.css. */
export const colors = {
  carbonBlack: "#0A0A0F",
  panelDark: "#0F0F14",
  panelHover: "#141420",
  panelBorder: "#1E1E2A",
  offWhite: "#E8E8E0",
  body: "#B0B0C0",
  muted: "#666680",
  accentRed: "#E8001C",
  accentCyan: "#00D2FF",
  warningYellow: "#FFD000",
  sectorPurple: "#CC00FF",
  hardWhite: "#FFFFFF",
  wetBlue: "#0055FF",
  greenImprove: "#00CC44",
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Tailwind class fragments for tire-compound badges.
 * S = Soft, M = Medium, H = Hard, W = Wet.
 */
export const compoundStyles: Record<TireCompound, string> = {
  S: "bg-[#2A0008] text-[#E8001C] border-[#E8001C]",
  M: "bg-[#2A1E00] text-[#FFD000] border-[#FFD000]",
  H: "bg-[#1E1E2A] text-white border-[#444460]",
  W: "bg-[#001A3A] text-[#0055FF] border-[#0055FF]",
};

/** Human-readable label for each compound. */
export const compoundLabel: Record<TireCompound, string> = {
  S: "Soft",
  M: "Medium",
  H: "Hard",
  W: "Wet",
};

/** Dominant accent color for each compound (for dots / bars / fills). */
export const compoundColor: Record<TireCompound, string> = {
  S: colors.accentRed,
  M: colors.warningYellow,
  H: colors.hardWhite,
  W: colors.wetBlue,
};

/** Tailwind class fragments for weather pills. */
export const weatherStyles: Record<Weather, string> = {
  Dry: "bg-[#2A1E00] text-[#FFD000] border-[#FFD000]",
  Wet: "bg-[#001A3A] text-[#0055FF] border-[#0055FF]",
  Overcast: "bg-[#1E1E2A] text-[#B0B0C0] border-[#444460]",
};

/** Zone accent colors for SVG track markers. */
export const zoneColor = {
  braking: colors.accentRed,
  overtaking: colors.accentCyan,
  speed: colors.warningYellow,
} as const;

/** Broadcast-style sector timing colors. */
export const sectorColor = {
  /** Overall fastest (purple). */
  best: colors.sectorPurple,
  /** Personal best / improvement (green). */
  improve: colors.greenImprove,
  /** Slower than reference. */
  slower: colors.warningYellow,
  /** Neutral. */
  neutral: colors.offWhite,
} as const;

/** CSS-only carbon-fiber weave texture. Spread onto a panel's style prop. */
export const carbonFiber: CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(45deg, rgba(255,255,255,.03) 0px, rgba(255,255,255,.03) 1px, transparent 1px, transparent 50%),
    repeating-linear-gradient(-45deg, rgba(255,255,255,.03) 0px, rgba(255,255,255,.03) 1px, transparent 1px, transparent 50%)
  `,
  backgroundSize: "4px 4px",
};

/** CSS-only brushed-metal texture for garage panels. */
export const brushedMetal: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0px, rgba(255,255,255,.02) 1px, transparent 1px, transparent 4px)",
  backgroundSize: "4px 100%",
};

/** Shared Recharts dark-theme tokens. */
export const chartTheme = {
  backgroundColor: "transparent",
  textColor: colors.muted,
  gridColor: colors.panelBorder,
  tooltipBg: colors.panelDark,
  tooltipBorder: colors.panelBorder,
} as const;
