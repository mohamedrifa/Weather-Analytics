// src/components/charts/WindChart.jsx
import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts";

function degToCompass(num) {
  const val = Math.floor(num / 22.5 + 0.5);
  const arr = [
    "N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW"
  ];
  return arr[val % 16];
}

export default function WindChart({ data, units = "metric" }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-900/40 backdrop-blur-md border border-gray-700/60 shadow-xl rounded-2xl p-5 transition-transform hover:scale-[1.01]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xl font-semibold text-white tracking-wide flex items-center gap-2">
          💨 Wind Speed & Gusts
        </h4>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-800/60 p-4 rounded-xl shadow-inner border border-gray-700">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" opacity={0.4} />
            <XAxis
              dataKey="timeLabel"
              minTickGap={20}
              tick={{ fill: "#cbd5e1", fontSize: 12 }}
            />
            <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} />

            <Tooltip
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(val, name) => {
                if (name === "wind_speed" || name === "wind_gust") {
                  return [`${val} ${units === "metric" ? "m/s" : "mph"}`, name === "wind_speed" ? "Wind Speed" : "Wind Gust"];
                }
                if (name === "wind_deg") {
                  return [degToCompass(val), "Direction"];
                }
                return [val, name];
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
              dataKey="wind_speed"
              name="Wind Speed"
              barSize={12}
              radius={[6, 6, 0, 0]}
              fill="#4ade80"
              opacity={0.85}
            />

            <Line
              type="monotone"
              dataKey="wind_gust"
              name="Wind Gust"
              stroke="#facc15"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-300 mt-2 opacity-80">
        Wind direction appears in tooltip (N / NE / E / SE / S / SW / W / NW)
      </div>
    </div>
  );
}
