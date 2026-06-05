"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TyreDegData } from "@/data/types";
import { chartTheme, colors } from "@/lib/designTokens";

/**
 * TyreDegChart — soft/medium/hard tire-life lines over a stint. Rendered only
 * on the client (loaded via next/dynamic with ssr:false from the page) so
 * Recharts never runs during SSR.
 */

export default function TyreDegChart({ data }: { data: TyreDegData[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} />
        <XAxis
          dataKey="lap"
          stroke="#444460"
          tick={{ fill: colors.muted, fontSize: 10 }}
          tickLine={false}
        />
        <YAxis
          stroke="#444460"
          domain={[0, 100]}
          tick={{ fill: colors.muted, fontSize: 10 }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: chartTheme.tooltipBg,
            border: `1px solid ${chartTheme.tooltipBorder}`,
            borderRadius: 2,
            fontSize: 11,
          }}
          labelStyle={{ color: colors.offWhite }}
          formatter={(value, name) => [`${value}%`, name]}
          labelFormatter={(lap) => `Lap ${lap}`}
        />
        <Line dataKey="soft" name="Soft" stroke={colors.accentRed} strokeWidth={2} dot={false} />
        <Line dataKey="medium" name="Medium" stroke={colors.warningYellow} strokeWidth={2} dot={false} />
        <Line dataKey="hard" name="Hard" stroke="#888899" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
