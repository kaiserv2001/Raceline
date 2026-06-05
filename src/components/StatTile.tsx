import type { ReactNode } from "react";

/**
 * StatTile — single metric box: uppercase label, large value, optional unit
 * and delta indicator. Used across profile and dashboard stat grids.
 */

interface StatTileProps {
  label: string;
  value: ReactNode;
  /** Small muted unit shown next to the value, e.g. "pts", "km/h". */
  unit?: string;
  /**
   * Signed delta vs a reference. Positive renders green/up, negative
   * red/down. Pass a string to control formatting (e.g. "+0.142").
   */
  delta?: number | string;
  /** Force the delta sentiment when a string delta is supplied. */
  deltaDirection?: "up" | "down" | "neutral";
  /** Optional leading icon (e.g. lucide-react node). */
  icon?: ReactNode;
  /** Left accent bar in the accent-red treatment for key metrics. */
  accent?: boolean;
  className?: string;
}

function resolveDelta(
  delta: StatTileProps["delta"],
  forced: StatTileProps["deltaDirection"]
): { text: string; direction: "up" | "down" | "neutral" } | null {
  if (delta === undefined) return null;

  if (typeof delta === "number") {
    const direction = delta > 0 ? "up" : delta < 0 ? "down" : "neutral";
    const sign = delta > 0 ? "+" : "";
    return { text: `${sign}${delta}`, direction: forced ?? direction };
  }

  return { text: delta, direction: forced ?? "neutral" };
}

const deltaColor = {
  up: "text-[#00CC44]",
  down: "text-[#E8001C]",
  neutral: "text-[#666680]",
} as const;

const deltaArrow = { up: "▲", down: "▼", neutral: "" } as const;

export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaDirection,
  icon,
  accent = false,
  className = "",
}: StatTileProps) {
  const resolved = resolveDelta(delta, deltaDirection);

  return (
    <div
      className={`rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-4 ${
        accent ? "border-l-2 border-l-[#E8001C]" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-1.5">
        {icon ? <span className="text-[#666680]">{icon}</span> : null}
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {label}
        </span>
      </div>

      <div className="mt-1 flex items-baseline gap-1.5">
        <span className="font-[family-name:var(--font-condensed)] text-3xl font-bold leading-none tabular-nums text-[#E8E8E0]">
          {value}
        </span>
        {unit ? (
          <span className="font-[family-name:var(--font-condensed)] text-sm uppercase tracking-wide text-[#666680]">
            {unit}
          </span>
        ) : null}

        {resolved ? (
          <span
            className={`ml-auto font-[family-name:var(--font-condensed)] text-sm font-semibold tabular-nums ${deltaColor[resolved.direction]}`}
          >
            {deltaArrow[resolved.direction]} {resolved.text}
          </span>
        ) : null}
      </div>
    </div>
  );
}
