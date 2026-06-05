"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "framer-motion";
import { StatTile } from "@/components/StatTile";

/**
 * StatsGrid — client wrapper around the rider career stat tiles. Adds a
 * staggered entrance and animates each numeric value up from 0 on mount
 * (MP-01 + MP-06). String values (e.g. avg finish "12.4") render as-is.
 * Honors prefers-reduced-motion.
 */

export interface StatItem {
  label: string;
  value: number | string;
  accent?: boolean;
  /** Decimal places to render when the value is numeric. */
  decimals?: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const shouldReduce = useReducedMotion();
  const motionValue = useMotionValue(shouldReduce ? value : 0);
  const display = useTransform(motionValue, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString(),
  );

  useEffect(() => {
    if (shouldReduce) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, decimals, motionValue, shouldReduce]);

  return <motion.span>{display}</motion.span>;
}

export function StatsGrid({ tiles }: { tiles: StatItem[] }) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      variants={shouldReduce ? undefined : containerVariants}
      initial={shouldReduce ? false : "hidden"}
      animate={shouldReduce ? undefined : "visible"}
    >
      {tiles.map((s) => (
        <motion.div key={s.label} variants={shouldReduce ? undefined : itemVariants}>
          <StatTile
            label={s.label}
            accent={s.accent}
            value={
              typeof s.value === "number" ? (
                <AnimatedNumber value={s.value} decimals={s.decimals} />
              ) : (
                s.value
              )
            }
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
