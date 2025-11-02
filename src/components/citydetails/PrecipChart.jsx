// src/components/charts/PrecipChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PrecipChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700/60 shadow-xl rounded-2xl p-5 transition-transform hover:scale-[1.01]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          🌧️ Precipitation / Chance
        </h4>
      </div>

      {/* Chart Box */}
      <div className="bg-gray-800/60 p-4 rounded-xl shadow-inner border border-gray-700">
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.4} />
            <XAxis
              dataKey="timeLabel"
              minTickGap={20}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />

            <Tooltip
              formatter={(value, name) => {
                if (name === "pop") return [`${Math.round(value * 100)}%`, "Chance"];
                return [value, name];
              }}
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "10px",
                color: "#fff",
              }}
              labelStyle={{ color: "#f9fafb" }}
            />

            <Bar
              dataKey="rain_mm"
              name="Rain (mm)"
              barSize={16}
              radius={[6, 6, 0, 0]}
              fill="#3b82f6"
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
