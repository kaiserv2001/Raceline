import type { TireCompound, Weather } from "@/data/types";
import { compoundLabel, compoundStyles, weatherStyles } from "@/lib/designTokens";

/**
 * StatusBadge — a small pill that renders either a tire compound (S/M/H/W),
 * a weather condition, or a generic flag/status string. Display-only.
 */

type FlagVariant = "GREEN" | "YELLOW" | "RED" | "CHEQUERED" | "SC";

const flagStyles: Record<FlagVariant, string> = {
  GREEN: "bg-[#00220E] text-[#00CC44] border-[#00CC44]",
  YELLOW: "bg-[#2A1E00] text-[#FFD000] border-[#FFD000]",
  RED: "bg-[#2A0008] text-[#E8001C] border-[#E8001C]",
  CHEQUERED: "bg-[#1E1E2A] text-white border-[#444460]",
  SC: "bg-[#2A1E00] text-[#FFD000] border-[#FFD000]",
};

type StatusBadgeProps =
  | {
      variant: "compound";
      compound: TireCompound;
      /** Show the full word ("Soft") instead of the single letter. */
      showLabel?: boolean;
      size?: "sm" | "md";
      className?: string;
    }
  | {
      variant: "weather";
      weather: Weather;
      size?: "sm" | "md";
      className?: string;
    }
  | {
      variant: "flag";
      flag: FlagVariant;
      label?: string;
      size?: "sm" | "md";
      className?: string;
    };

const sizeStyles = {
  sm: "text-[10px] px-1.5 py-0.5 min-w-[1.25rem]",
  md: "text-xs px-2 py-0.5 min-w-[1.5rem]",
} as const;

export function StatusBadge(props: StatusBadgeProps) {
  const size = props.size ?? "md";
  const base = `inline-flex items-center justify-center rounded-sm border font-semibold font-[family-name:var(--font-condensed)] uppercase tracking-widest leading-none ${sizeStyles[size]} ${props.className ?? ""}`;

  if (props.variant === "compound") {
    return (
      <span className={`${base} ${compoundStyles[props.compound]}`}>
        {props.showLabel ? compoundLabel[props.compound] : props.compound}
      </span>
    );
  }

  if (props.variant === "weather") {
    return (
      <span className={`${base} ${weatherStyles[props.weather]}`}>
        {props.weather}
      </span>
    );
  }

  return (
    <span className={`${base} ${flagStyles[props.flag]}`}>
      {props.label ?? props.flag}
    </span>
  );
}
