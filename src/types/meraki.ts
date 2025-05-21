export interface NetworkDevice {
  serial: string;
  mac: string;
  model: string;
  name: string;
  networkId: string;
  status: string;
  lastReportedAt: string;
  clients?: number;
}

export interface WirelessNetwork {
  id: string;
  name: string;
  timeZone: string;
  tags: string[];
  productTypes: string[];
}

export interface WirelessStats {
  networkId: string;
  totalClients: number;
  totalAPs: number;
  usage: {
    sent: number;
    received: number;
  };
}

export interface NetFlowData {
  application: string;
  protocol: string;
  destination: string;
  port: number;
  sent: number;
  received: number;
  clientMac?: string;
  deviceSerial?: string;
}

export interface ApplicationUsage {
  application: string;
  totalUsage: number;
  percentage: number;
}