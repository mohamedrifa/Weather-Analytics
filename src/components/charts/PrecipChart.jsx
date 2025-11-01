// src/components/charts/PrecipChart.jsx
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

export default function PrecipChart({ data }) {
  // data: [{ timeLabel, pop (0..1), rain_mm }]
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2">Precipitation / Chance</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" minTickGap={20} />
            <YAxis />
            <Tooltip formatter={(value, name) => {
              if (name === 'pop') return [`${Math.round(value * 100)}%`, 'Chance'];
              return [value, name];
            }} />
            <Bar dataKey="rain_mm" name="Rain (mm)" barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
