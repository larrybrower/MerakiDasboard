import React, { useState } from 'react';
import useSWR from 'swr';
import { Settings, Filter } from 'lucide-react';
import { DeviceCard } from './components/DeviceCard';
import { NetworkStats } from './components/NetworkStats';
import { NetFlowChart } from './components/NetFlowChart';
import { NetFlowTable } from './components/NetFlowTable';
import type { NetworkDevice, WirelessStats, NetFlowData, ApplicationUsage } from './types/meraki';

// In a real app, these would be environment variables
const API_KEY = 'your-meraki-api-key';
const BASE_URL = 'https://api.meraki.com/api/v1';

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'X-Cisco-Meraki-API-Key': API_KEY,
    },
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

function App() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { data: devices, error: devicesError } = useSWR<NetworkDevice[]>(
    `${BASE_URL}/devices`,
    fetcher
  );

  const { data: stats, error: statsError } = useSWR<WirelessStats>(
    `${BASE_URL}/networks/your-network-id/wireless/stats`,
    fetcher
  );

  const { data: netflowData } = useSWR<NetFlowData[]>(
    selectedDevice
      ? `${BASE_URL}/networks/your-network-id/devices/${selectedDevice}/traffic`
      : selectedClient
      ? `${BASE_URL}/networks/your-network-id/clients/${selectedClient}/traffic`
      : null,
    fetcher
  );

  const processApplicationUsage = (data: NetFlowData[] | undefined): ApplicationUsage[] => {
    if (!data) return [];
    
    const appUsage = data.reduce((acc, curr) => {
      const total = curr.sent + curr.received;
      acc[curr.application] = (acc[curr.application] || 0) + total;
      return acc;
    }, {} as Record<string, number>);

    const totalUsage = Object.values(appUsage).reduce((a, b) => a + b, 0);

    return Object.entries(appUsage)
      .map(([application, usage]) => ({
        application,
        totalUsage: usage,
        percentage: (usage / totalUsage) * 100,
      }))
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, 5);
  };

  const isLoading = !devices && !devicesError && !stats && !statsError;
  const hasError = devicesError || statsError;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-blue-600" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                Meraki Network Dashboard
              </h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedDevice || ''}
                  onChange={(e) => {
                    setSelectedDevice(e.target.value || null);
                    setSelectedClient(null);
                  }}
                >
                  <option value="">All Devices</option>
                  {devices?.map((device) => (
                    <option key={device.serial} value={device.serial}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading network data...</p>
          </div>
        )}

        {hasError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Error loading network data. Please check your API key and try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {stats && <NetworkStats stats={stats} />}

        {netflowData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <NetFlowTable
                data={netflowData}
                title={selectedDevice ? 'AP Traffic' : 'Client Traffic'}
              />
            </div>
            <div>
              <NetFlowChart data={processApplicationUsage(netflowData)} />
            </div>
          </div>
        )}

        {devices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device) => (
              <DeviceCard
                key={device.serial}
                device={device}
                onClick={() => {
                  setSelectedDevice(device.serial);
                  setSelectedClient(null);
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;