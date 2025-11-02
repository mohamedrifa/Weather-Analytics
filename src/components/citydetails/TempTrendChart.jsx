// src/components/charts/TempTrendChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
} from "recharts";

export default function TempTrendChart({ data, units = "metric" }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700/60 shadow-xl rounded-2xl p-5 transition-transform hover:scale-[1.01]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          🌡️ Hourly Temperature
        </h4>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-800/60 p-4 rounded-xl shadow-inner border border-gray-700">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.4} />
            <XAxis
              dataKey="timeLabel"
              minTickGap={20}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <YAxis
              unit={units === "metric" ? "°C" : "°F"}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "10px",
                color: "#fff",
              }}
              labelStyle={{ color: "#f9fafb" }}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#fbbf24"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Brush
              dataKey="timeLabel"
              height={30}
              stroke="#8b5cf6"
              travellerWidth={12}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
