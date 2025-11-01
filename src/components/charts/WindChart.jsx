// src/components/charts/WindChart.jsx
import React from 'react';
import {
  ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Line, ResponsiveContainer
} from 'recharts';

function degToCompass(num) {
  const val = Math.floor((num / 22.5) + 0.5);
  const arr = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return arr[(val % 16)];
}

export default function WindChart({ data, units = 'metric' }) {
  // data: [{ timeLabel, wind_speed, wind_gust, wind_deg }]
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-gray-800 p-4 rounded">
      <h4 className="text-lg font-semibold mb-2">Wind Speed & Gusts</h4>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" minTickGap={20} />
            <YAxis />
            <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(val, name, item) => {
              if (name === 'wind_speed' || name === 'wind_gust') {
                return [`${val} ${units === 'metric' ? 'm/s' : 'mph'}`, name];
              }
              if (name === 'wind_deg') {
                return [degToCompass(val), 'Direction'];
              }
              return [val, name];
            }} />
            <Bar dataKey="wind_speed" name="Wind speed" barSize={12} />
            <Line type="monotone" dataKey="wind_gust" name="Gust" stroke="#ff7300" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-300 mt-2">Direction shown in tooltip (e.g. N, NE)</div>
    </div>
  );
}
