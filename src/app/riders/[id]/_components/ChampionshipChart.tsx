"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/**
 * ChampionshipChart — client-only Recharts AreaChart showing a rider's
 * cumulative championship points across all 18 rounds. Rendered via a
 * dynamic import with `ssr: false` from the (server) profile page.
 */

export interface ChampionshipPoint {
  round: number;
  cumulativePoints: number;
}

export default function ChampionshipChart({
  data,
}: {
  data: ChampionshipPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="pointsGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8001C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E8001C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2A" />
        <XAxis
          dataKey="round"
          stroke="#444460"
          tick={{ fill: "#666680", fontSize: 10 }}
          tickFormatter={(v) => `R${v}`}
        />
        <YAxis
          stroke="#444460"
          tick={{ fill: "#666680", fontSize: 10 }}
          width={36}
        />
        <Tooltip
          cursor={{ stroke: "#444460", strokeDasharray: "3 3" }}
          contentStyle={{
            backgroundColor: "#0F0F14",
            border: "1px solid #1E1E2A",
            borderRadius: 2,
            fontSize: 12,
          }}
          labelStyle={{ color: "#666680" }}
          itemStyle={{ color: "#E8E8E0" }}
          labelFormatter={(v) => `ROUND ${v}`}
          formatter={(value) => [`${value} pts`, "Championship"]}
        />
        <Area
          type="monotone"
          dataKey="cumulativePoints"
          stroke="#E8001C"
          fill="url(#pointsGrad)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
