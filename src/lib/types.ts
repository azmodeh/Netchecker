
export type NodeInfo = {
  name: string;
  lat: number;
  lon: number;
};

export type AppConfig = {
  defaultNodes: string[];
  nodes: Record<string, NodeInfo>;
};

export type DnsRecord = {
  type: 'A' | 'AAAA';
  value: string;
};

export type IpInfo = {
  ip: string;
  city: string;
  region: string;
  country: string;
  org: string;
  loc: string; // "lat,lon"
};

export type CheckNodeResult = {
  node: string;
  status: 'success' | 'error';
  latency: number; // in ms
  nodeInfo: NodeInfo;
};

export type CheckResult = {
  ip: string;
  dnsRecords: DnsRecord[];
  ipInfo: IpInfo;
  checkNodeResults: CheckNodeResult[];
};

export type FormState = {
  result?: CheckResult;
  error?: string;
  timestamp?: number;
};
