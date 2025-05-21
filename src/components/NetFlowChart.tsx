import React from 'react';
import type { ApplicationUsage } from '../types/meraki';

interface NetFlowChartProps {
  data: ApplicationUsage[];
}

export function NetFlowChart({ data }: NetFlowChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Usage</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.application} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">{item.application}</span>
              <span className="text-gray-500">{item.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}