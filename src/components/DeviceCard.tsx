import React from 'react';
import { Wifi, Signal, Users } from 'lucide-react';
import type { NetworkDevice } from '../types/meraki';

interface DeviceCardProps {
  device: NetworkDevice;
  onClick?: () => void;
}

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${
          device.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {device.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Signal className="w-5 h-5 mr-2" />
          <span>{device.model}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Wifi className="w-5 h-5 mr-2" />
          <span>{device.mac}</span>
        </div>
        
        {device.clients !== undefined && (
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>{device.clients} connected clients</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        Last seen: {new Date(device.lastReportedAt).toLocaleString()}
      </div>
    </div>
  );
}