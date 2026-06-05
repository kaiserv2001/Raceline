"use client";

import { useId } from "react";

/**
 * SetupSlider — a labeled range slider with motorsport-panel styling for the
 * garage setup screen. Controlled component: the parent owns the value.
 *
 * Uses a native <input type="range"> styled via accent-color for cross-browser
 * theming, with a custom track readout above it. "use client" because it wires
 * an onChange handler / interactive control.
 */

interface SetupSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  /** Optional unit suffix shown next to the value, e.g. "L", "clicks". */
  unit?: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function SetupSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  disabled = false,
  className = "",
}: SetupSliderProps) {
  const id = useId();
  const ratio = max > min ? (value - min) / (max - min) : 0;

  return (
    <div
      className={`rounded-sm border border-[#1E1E2A] bg-[#0F0F14] p-3 transition-colors duration-150 hover:border-[#2A2A3A] ${className}`}
    >
      <div className="mb-2 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]"
        >
          {label}
        </label>
        <span className="font-[family-name:var(--font-condensed)] text-lg font-bold tabular-nums text-[#E8E8E0]">
          {value}
          {unit ? (
            <span className="ml-1 text-xs font-normal text-[#666680]">{unit}</span>
          ) : null}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        aria-valuetext={unit ? `${value} ${unit}` : String(value)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-sm bg-[#1E1E2A] accent-[#E8001C] disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          background: `linear-gradient(to right, #E8001C 0%, #E8001C ${ratio * 100}%, #1E1E2A ${ratio * 100}%, #1E1E2A 100%)`,
        }}
      />

      <div className="mt-1 flex justify-between font-[family-name:var(--font-condensed)] text-[10px] tabular-nums text-[#666680]">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
