export type ThreatType =
  | 'PORT_SCAN'
  | 'DOS_DDOS'
  | 'DOS'
  | 'BRUTE_FORCE'
  | 'ANOMALY'
  | 'TRAFFIC_ANOMALY'
  | 'SUSPICIOUS_TRAFFIC';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ThreatStatus = 'NEW' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';

export type TrafficStatus = 'NORMAL' | 'ANOMALOUS' | 'SUSPICIOUS';

export interface NetworkTraffic {
  id: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  sourcePort: number;
  destinationPort: number;
  packets: number;
  bytes: number;
  status: TrafficStatus;
  packetRate: number;
  flowDuration: number; // in seconds
  avgPacketSize: number;
  tcpFlags?: string;
  destinationPortCount?: number;
  threatId?: string;
}

export interface ThreatEvent {
  id: string;
  threatType: ThreatType;
  title: string;
  severity: Severity;
  confidence: number; // 0 to 100
  riskScore: number;  // 0 to 100
  sourceIp: string;
  destinationIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  destinationPortCount: number;
  connectionAttempts: number;
  flowDuration: number;
  detectedAt: string;
  status: ThreatStatus;
  summary: string;
  indicators: string[];
  recommendedAction: string;
  detectionSource?: 'simulation' | 'ml';
  explanationDetails?: Array<{
    feature_name: string;
    observed_value: number;
    baseline_value: number;
    deviation_pct: number;
    impact: string;
    description: string;
  }>;
  recommendedActionsList?: string[];
}

export interface IncidentTimelineStep {
  id: string;
  timestamp: string;
  description: string;
  type: 'CONNECTION' | 'PORT_HIT' | 'THRESHOLD' | 'AI_CLASSIFICATION' | 'ACTION';
  detail?: string;
}

export interface Incident {
  id: string;
  threatId: string;
  title: string;
  severity: Severity;
  status: ThreatStatus;
  createdAt: string;
  timeline: IncidentTimelineStep[];
  analystNotes: string[];
}

export interface TrafficMetrics {
  totalPacketsPerSec: number;
  activeFlows: number;
  threatsDetected: number;
  criticalAlerts: number;
  networkHealth: number; // e.g. 98.7
  byteRate: number;
  protocolBreakdown: {
    TCP: number;
    UDP: number;
    ICMP: number;
  };
}

export interface MLInferencePayload {
  source_ip: string;
  destination_ip: string;
  protocol: string;
  packet_count: number;
  byte_count: number;
  packet_rate: number;
  flow_duration: number;
  destination_port_count: number;
  tcp_flags: string;
}

export interface MLInferenceResponse {
  prediction: string;
  threat_type: ThreatType;
  confidence: number;
  anomaly_score: number;
  severity: Severity;
  explanation: string;
  recommended_action: string;
}
