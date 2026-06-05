import type { LiveRiderState, Team } from "@/data/types";
import { StatusBadge } from "./StatusBadge";

/**
 * LeaderboardRow — a single line in the live timing tower: position, team-color
 * tab, rider name/number, gap, tire compound badge, and a mini speed-trap
 * readout. Display-only; pass resolved name + team alongside the live state.
 */

interface LeaderboardRowProps {
  state: LiveRiderState;
  riderName: string;
  riderNumber: number;
  team: Team;
  /** Fastest top speed in the field, used to scale the mini speed-trap bar. */
  maxTopSpeed?: number;
  active?: boolean;
  onSelect?: (riderId: string) => void;
  className?: string;
}

export function LeaderboardRow({
  state,
  riderName,
  riderNumber,
  team,
  maxTopSpeed,
  active = false,
  onSelect,
  className = "",
}: LeaderboardRowProps) {
  const interactive = typeof onSelect === "function";
  const isLeader = state.gap === "Leader";

  const speedRatio =
    maxTopSpeed && maxTopSpeed > 0
      ? Math.max(0, Math.min(1, state.topSpeed / maxTopSpeed))
      : 1;

  const stateClasses = active
    ? "border-l-[#E8001C] bg-[#1A0008]"
    : "border-l-transparent bg-[#0F0F14]";

  const hoverClasses = interactive
    ? "cursor-pointer hover:bg-[#141420] hover:border-l-[#E8001C]"
    : "";

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? () => onSelect?.(state.riderId) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(state.riderId);
              }
            }
          : undefined
      }
      className={`grid grid-cols-[2rem_0.25rem_1fr_auto_auto] items-center gap-3 border-l-2 border-b border-b-[#1E1E2A] px-3 py-2 transition-all duration-150 ${stateClasses} ${hoverClasses} ${className}`}
    >
      {/* Position */}
      <span className="text-center font-[family-name:var(--font-condensed)] text-xl font-bold tabular-nums text-[#E8E8E0]">
        {state.position}
      </span>

      {/* Team color tab */}
      <span
        className="h-6 w-1 rounded-sm"
        style={{ backgroundColor: team.color }}
        aria-hidden
      />

      {/* Rider + speed trap */}
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-[family-name:var(--font-condensed)] text-xs tabular-nums text-[#666680]">
            {riderNumber}
          </span>
          <span className="truncate font-[family-name:var(--font-condensed)] text-sm font-semibold uppercase tracking-wide text-[#E8E8E0]">
            {riderName}
          </span>
        </div>
        {/* Mini speed-trap */}
        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-1 w-16 overflow-hidden rounded-sm bg-[#1E1E2A]">
            <div
              className="h-full rounded-sm bg-[#00D2FF]"
              style={{ width: `${speedRatio * 100}%` }}
            />
          </div>
          <span className="font-[family-name:var(--font-condensed)] text-[10px] tabular-nums text-[#666680]">
            {state.topSpeed} km/h
          </span>
        </div>
      </div>

      {/* Gap */}
      <span
        className={`text-right font-[family-name:var(--font-condensed)] text-sm font-semibold tabular-nums ${
          isLeader ? "text-[#E8001C]" : "text-[#B0B0C0]"
        }`}
      >
        {state.gap}
      </span>

      {/* Tire compound */}
      <StatusBadge variant="compound" compound={state.tireCompound} size="sm" />
    </div>
  );
}
