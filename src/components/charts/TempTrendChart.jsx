// src/components/charts/TempTrendChart.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Brush
} from 'recharts';

export default function TempTrendChart({ data, units = 'metric' }) {
  // data: [{ dt: 167..., temp: 30, pop: 0.1, timeLabel: '09:00' }, ...]
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2">Hourly Temperature</h4>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" minTickGap={20} />
            <YAxis unit={units === 'metric' ? '°C' : '°F'} />
            <Tooltip labelFormatter={(label) => `Time: ${label}`} />
            <Line type="monotone" dataKey="temp" stroke="#ff7300" dot={false} />
            <Brush dataKey="timeLabel" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
