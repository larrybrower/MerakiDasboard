import React from 'react';
import { WifiIcon, Activity, Server } from 'lucide-react';
import type { WirelessStats } from '../types/meraki';

interface NetworkStatsProps {
  stats: WirelessStats;
}

export function NetworkStats({ stats }: NetworkStatsProps) {
  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <Server className="w-8 h-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total APs</p>
            <p className="text-2xl font-semibold">{stats.totalAPs}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <WifiIcon className="w-8 h-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Connected Clients</p>
            <p className="text-2xl font-semibold">{stats.totalClients}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          <Activity className="w-8 h-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm text-gray-600">Total Traffic</p>
            <p className="text-2xl font-semibold">
              {formatBytes(stats.usage.sent + stats.usage.received)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}