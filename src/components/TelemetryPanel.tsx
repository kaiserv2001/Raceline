import type { LiveRiderState } from "@/data/types";
import { sectorColor } from "@/lib/designTokens";
import { StatusBadge } from "./StatusBadge";

/**
 * TelemetryPanel — a multi-row data grid for a single rider's live state:
 * last lap, the three sector splits with broadcast-style diff highlights, top
 * speed, and tire info. Display-only; pass in the live snapshot.
 *
 * Per-sector status (best/improve/slower) is optional — when omitted, sectors
 * render neutral. The caller computes these against session bests.
 */

type SectorStatus = "best" | "improve" | "slower" | "neutral";

interface TelemetryPanelProps {
  state: LiveRiderState;
  /** Optional rider display name for the header. */
  riderName?: string;
  /** Status per sector index [s1, s2, s3]. */
  sectorStatus?: [SectorStatus, SectorStatus, SectorStatus];
  className?: string;
}

const statusColor: Record<SectorStatus, string> = {
  best: sectorColor.best,
  improve: sectorColor.improve,
  slower: sectorColor.slower,
  neutral: sectorColor.neutral,
};

function SectorRow({
  label,
  time,
  status,
}: {
  label: string;
  time: string;
  status: SectorStatus;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#1E1E2A] px-4 py-2 last:border-b-0">
      <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
        {label}
      </span>
      <span
        className="font-[family-name:var(--font-condensed)] text-base font-semibold tabular-nums"
        style={{ color: statusColor[status] }}
      >
        {time}
      </span>
    </div>
  );
}

export function TelemetryPanel({
  state,
  riderName,
  sectorStatus = ["neutral", "neutral", "neutral"],
  className = "",
}: TelemetryPanelProps) {
  return (
    <div
      className={`overflow-hidden rounded-sm border border-[#1E1E2A] bg-[#0F0F14] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E1E2A] bg-[#141420] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-condensed)] text-sm font-bold tabular-nums text-[#E8001C]">
            P{state.position}
          </span>
          <span className="font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase tracking-wide text-[#E8E8E0]">
            {riderName ?? `Rider ${state.riderId}`}
          </span>
        </div>
        <StatusBadge variant="compound" compound={state.tireCompound} size="sm" />
      </div>

      {/* Last lap headline */}
      <div className="flex items-baseline justify-between border-b border-[#1E1E2A] px-4 py-3">
        <span className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          Last Lap
        </span>
        <span className="font-[family-name:var(--font-condensed)] text-2xl font-bold tabular-nums text-[#E8E8E0]">
          {state.lastLap}
        </span>
      </div>

      {/* Sector splits */}
      <SectorRow label="Sector 1" time={state.sector1} status={sectorStatus[0]} />
      <SectorRow label="Sector 2" time={state.sector2} status={sectorStatus[1]} />
      <SectorRow label="Sector 3" time={state.sector3} status={sectorStatus[2]} />

      {/* Footer metrics */}
      <div className="grid grid-cols-3 divide-x divide-[#1E1E2A] border-t border-[#1E1E2A]">
        <div className="px-4 py-2">
          <p className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            Top Speed
          </p>
          <p className="font-[family-name:var(--font-condensed)] text-base font-semibold tabular-nums text-[#E8E8E0]">
            {state.topSpeed}
            <span className="ml-1 text-[10px] text-[#666680]">km/h</span>
          </p>
        </div>
        <div className="px-4 py-2">
          <p className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            Gap
          </p>
          <p className="font-[family-name:var(--font-condensed)] text-base font-semibold tabular-nums text-[#00D2FF]">
            {state.gap}
          </p>
        </div>
        <div className="px-4 py-2">
          <p className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            Tire Age
          </p>
          <p className="font-[family-name:var(--font-condensed)] text-base font-semibold tabular-nums text-[#E8E8E0]">
            {state.tireAge}
            <span className="ml-1 text-[10px] text-[#666680]">laps</span>
          </p>
        </div>
      </div>
    </div>
  );
}
