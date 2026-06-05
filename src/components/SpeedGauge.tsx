import { colors } from "@/lib/designTokens";

/**
 * SpeedGauge — a radial arc gauge for a top-speed readout. Pure SVG with a
 * stroke-dasharray fill, so it animates via CSS and stays RSC-compatible.
 *
 * The arc sweeps 270° (from 135° at lower-left, clockwise to 45° at
 * lower-right), leaving a gap at the bottom for the numeric readout.
 */

interface SpeedGaugeProps {
  /** Current value, e.g. measured top speed in km/h. */
  value: number;
  /** Scale bounds. */
  min?: number;
  max?: number;
  unit?: string;
  label?: string;
  /** Diameter in px. */
  size?: number;
  /** Arc color; defaults to accent cyan. */
  color?: string;
  className?: string;
}

const START_ANGLE = 135; // degrees
const SWEEP = 270; // degrees of total travel

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Build an SVG arc path from startAngle sweeping `sweep` degrees clockwise. */
function arcPath(cx: number, cy: number, r: number, sweep: number) {
  const start = polar(cx, cy, r, START_ANGLE);
  const end = polar(cx, cy, r, START_ANGLE + sweep);
  const largeArc = sweep > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export function SpeedGauge({
  value,
  min = 0,
  max = 360,
  unit = "km/h",
  label = "Top Speed",
  size = 160,
  color = colors.accentCyan,
  className = "",
}: SpeedGaugeProps) {
  const ratio = max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0;
  const stroke = 10;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - stroke) / 2;

  const trackPath = arcPath(cx, cy, r, SWEEP);
  const valuePath = arcPath(cx, cy, r, SWEEP * ratio);

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${value} ${unit}`}
        >
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke={colors.panelBorder}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Value arc */}
          {ratio > 0 ? (
            <path
              d={valuePath}
              fill="none"
              stroke={color}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        {/* Center readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-[family-name:var(--font-condensed)] text-3xl font-black leading-none tabular-nums"
            style={{ color }}
          >
            {value}
          </span>
          <span className="font-[family-name:var(--font-condensed)] text-[10px] uppercase tracking-widest text-[#666680]">
            {unit}
          </span>
        </div>
      </div>

      {label ? (
        <span className="mt-1 font-[family-name:var(--font-condensed)] text-xs uppercase tracking-widest text-[#666680]">
          {label}
        </span>
      ) : null}
    </div>
  );
}
