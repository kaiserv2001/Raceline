import { sectorColor } from "@/lib/designTokens";

/**
 * SectorBar — a horizontal split bar comparing a sector time against a
 * personal-best reference. The fill width encodes how close the lap is to the
 * reference; the color encodes broadcast-style timing status:
 *   purple = overall best, green = personal best, yellow = slower, neutral.
 *
 * Pure CSS transition (no Framer) so it stays RSC-compatible.
 */

type SectorStatus = "best" | "improve" | "slower" | "neutral";

interface SectorBarProps {
  /** Sector label, e.g. "S1". */
  label: string;
  /** Formatted time string, e.g. "24.118". */
  time: string;
  /** Timing status that drives the fill color. */
  status?: SectorStatus;
  /**
   * Fill ratio 0–1. Typically (reference / time) clamped, so a faster sector
   * fills further. Defaults to a full bar.
   */
  fill?: number;
  className?: string;
}

const statusToColor: Record<SectorStatus, string> = {
  best: sectorColor.best,
  improve: sectorColor.improve,
  slower: sectorColor.slower,
  neutral: sectorColor.neutral,
};

export function SectorBar({
  label,
  time,
  status = "neutral",
  fill = 1,
  className = "",
}: SectorBarProps) {
  const color = statusToColor[status];
  const width = `${Math.max(0, Math.min(1, fill)) * 100}%`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-7 shrink-0 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
        {label}
      </span>

      <div className="relative h-2 flex-1 overflow-hidden rounded-sm bg-[#1E1E2A]">
        <div
          className="absolute inset-y-0 left-0 rounded-sm transition-[width] duration-500 ease-out"
          style={{ width, backgroundColor: color }}
        />
      </div>

      <span
        className="w-14 shrink-0 text-right font-[family-name:var(--font-condensed)] text-sm font-semibold tabular-nums"
        style={{ color }}
      >
        {time}
      </span>
    </div>
  );
}
