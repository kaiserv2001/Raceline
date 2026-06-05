"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Zone, ZoneType } from "@/data/types";
import { zoneColor } from "@/lib/designTokens";

/**
 * TrackMarker — an SVG overlay pin for circuit maps. Renders as a <g> element
 * so it must be placed inside an <svg>. Marks braking / overtaking / speed
 * zones with a color-coded ring + glyph and an optional label.
 *
 * Display-only. Coordinates come from the zone fixture (SVG user units).
 */

interface TrackMarkerProps {
  zone: Zone;
  /** Marker radius in SVG units. */
  radius?: number;
  /** Optional label rendered beside the marker. */
  label?: string;
  active?: boolean;
  onSelect?: (zoneId: string) => void;
  className?: string;
}

/** Single-glyph icon per zone type, drawn in SVG (no font dependency). */
const glyph: Record<ZoneType, string> = {
  braking: "B",
  overtaking: "O",
  speed: "V",
};

export function TrackMarker({
  zone,
  radius = 9,
  label,
  active = false,
  onSelect,
  className = "",
}: TrackMarkerProps) {
  const color = zoneColor[zone.type];
  const interactive = typeof onSelect === "function";
  const shouldReduce = useReducedMotion();

  return (
    <motion.g
      transform={`translate(${zone.x}, ${zone.y})`}
      className={`${interactive ? "cursor-pointer" : ""} ${className}`}
      role={interactive ? "button" : "img"}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.(zone.id) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(zone.id);
              }
            }
          : undefined
      }
      whileHover={interactive && !shouldReduce ? { scale: 1.18 } : undefined}
      whileTap={interactive && !shouldReduce ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Active halo */}
      {active ? (
        <circle r={radius + 4} fill={color} opacity={0.2} />
      ) : null}

      {/* Outer ring */}
      <circle
        r={radius}
        fill="#0A0A0F"
        stroke={color}
        strokeWidth={active ? 2.5 : 1.5}
      />

      {/* Type glyph */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={radius * 1.1}
        fontWeight={700}
        fontFamily="var(--font-condensed), sans-serif"
        fill={color}
      >
        {glyph[zone.type]}
      </text>

      {/* Optional label */}
      {label ? (
        <text
          x={radius + 4}
          y={0}
          dominantBaseline="central"
          fontSize={radius * 0.95}
          fontFamily="var(--font-condensed), sans-serif"
          fill="#E8E8E0"
          style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}
        >
          {label}
        </text>
      ) : null}
    </motion.g>
  );
}
