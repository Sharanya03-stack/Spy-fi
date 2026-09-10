import {
  NetworkTraffic,
  ThreatEvent,
  ThreatType,
  Severity,
  TrafficStatus,
} from '@/lib/types/network';

// Helper to pick random element from array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to generate random integer in range [min, max]
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to generate random float in range [min, max] rounded to decimals
function randomFloat(min: number, max: number, decimals: number = 1): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

// Generate unique stable Threat ID (e.g. THR-20260908-4821)
let threatIdCounter = 1000;
export function generateThreatId(): string {
  threatIdCounter += 1;
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randSuffix = randomInt(100, 999);
  return `THR-${dateStr}-${threatIdCounter}${randSuffix}`;
}

// Common Subnets
const SOURCE_IPS = [
  '192.168.1.25',
  '192.168.1.42',
  '192.168.1.108',
  '192.168.1.189',
  '172.16.4.12',
  '172.16.4.88',
  '10.200.1.15',
  '192.168.1.204',
];

const DESTINATION_IPS = [
  '10.0.0.12',
  '10.0.0.45',
  '10.0.0.88',
  '10.0.0.102',
  '10.0.0.210',
  '10.0.0.5',
];

const PROTOCOLS: ('TCP' | 'UDP' | 'ICMP')[] = ['TCP', 'TCP', 'TCP', 'UDP', 'ICMP'];
const COMMON_PORTS = [80, 443, 22, 53, 3389, 8080, 8443, 21, 25];

/**
 * Generate a single normal network traffic event
 */
export function generateNormalTraffic(): NetworkTraffic {
  const sourceIp = randomChoice(SOURCE_IPS);
  const destinationIp = randomChoice(DESTINATION_IPS);
  const protocol = randomChoice(PROTOCOLS);
  const packets = randomInt(40, 350);
  const avgPacketSize = randomInt(400, 1200);
  const bytes = packets * avgPacketSize;
  const flowDuration = randomFloat(0.5, 5.0, 1);
  const packetRate = Math.round(packets / flowDuration);

  return {
    id: `PKT-${Date.now()}-${randomInt(100, 999)}`,
    timestamp: new Date().toISOString(),
    sourceIp,
    destinationIp,
    protocol,
    sourcePort: randomInt(49152, 65535),
    destinationPort: randomChoice(COMMON_PORTS),
    packets,
    bytes,
    status: 'NORMAL',
    packetRate,
    flowDuration,
    avgPacketSize,
    tcpFlags: 'ACK, PSH',
    destinationPortCount: 1,
  };
}

/**
 * Generate a specific simulated ThreatEvent based on ThreatType
 * Using dynamic randomized ranges as requested by constraints.
 */
export function generateSimulatedThreat(
  type: ThreatType,
  overrideSourceIp?: string,
  overrideDestIp?: string
): ThreatEvent {
  const sourceIp = overrideSourceIp || randomChoice(SOURCE_IPS);
  const destinationIp = overrideDestIp || randomChoice(DESTINATION_IPS);
  const id = generateThreatId();
  const detectedAt = new Date().toISOString();

  switch (type) {
    case 'PORT_SCAN': {
      const attempts = randomInt(220, 520);
      const portsTargeted = randomInt(28, 85);
      const duration = randomFloat(6.2, 18.5, 1);
      const confidence = randomFloat(91.2, 97.9, 1);
      const riskScore = randomInt(81, 93);
      const severity: Severity = 'HIGH';

      return {
        id,
        threatType: 'PORT_SCAN',
        title: 'PORT SCAN DETECTED',
        severity,
        confidence,
        riskScore,
        sourceIp,
        destinationIp,
        protocol: 'TCP',
        destinationPortCount: portsTargeted,
        connectionAttempts: attempts,
        flowDuration: duration,
        detectedAt,
        status: 'NEW',
        summary: `Sequential SYN port scan from ${sourceIp} targeted ${portsTargeted} ports across protected subnet host ${destinationIp}.`,
        indicators: [
          `${attempts} connection attempts observed within ${duration}s interval`,
          `${portsTargeted} unique destination ports targeted in short window`,
          `Abnormal SYN flag ratio exceeding baseline by ${randomInt(300, 600)}%`,
          `Statistical flow distribution Z-score: ${randomFloat(3.8, 5.2, 1)}`,
        ],
        recommendedAction: `Investigate source host ${sourceIp} and review subsequent unidirectional traffic originating from the same source.`,
      };
    }

    case 'DOS_DDOS': {
      const pps = randomInt(42000, 88000);
      const duration = randomFloat(10.0, 45.0, 1);
      const confidence = randomFloat(95.0, 99.4, 1);
      const riskScore = randomInt(92, 99);
      const severity: Severity = 'CRITICAL';
      const attempts = Math.round(pps * duration);

      return {
        id,
        threatType: 'DOS_DDOS',
        title: 'VOLUMETRIC DOS ATTACK',
        severity,
        confidence,
        riskScore,
        sourceIp,
        destinationIp,
        protocol: 'TCP',
        destinationPortCount: randomInt(1, 4),
        connectionAttempts: attempts,
        flowDuration: duration,
        detectedAt,
        status: 'NEW',
        summary: `Volumetric flood attack detected from ${sourceIp} producing ${pps.toLocaleString()} pkt/s packet velocity.`,
        indicators: [
          `Extreme packet velocity spike of ${pps.toLocaleString()} pkt/s`,
          `High TCP SYN flood intensity targeted at host ${destinationIp}`,
          `Unidirectional receiving buffer capacity threshold exceeded by ${randomInt(140, 320)}%`,
          `Traffic intensity anomaly score: ${randomFloat(94.0, 99.5, 1)}`,
        ],
        recommendedAction: `Apply rate-limiting filter on ingress interface for ${sourceIp} and verify data diode buffer state.`,
      };
    }

    case 'BRUTE_FORCE': {
      const attempts = randomInt(75, 290);
      const targetPort = randomChoice([22, 3389, 443, 8443]);
      const duration = randomFloat(14.0, 65.0, 1);
      const confidence = randomFloat(88.0, 96.5, 1);
      const riskScore = randomInt(74, 89);
      const severity: Severity = randomChoice(['HIGH', 'HIGH', 'CRITICAL'] as Severity[]);

      return {
        id,
        threatType: 'BRUTE_FORCE',
        title: 'AUTHENTICATION BRUTE FORCE',
        severity,
        confidence,
        riskScore,
        sourceIp,
        destinationIp,
        protocol: 'TCP',
        destinationPortCount: 1,
        connectionAttempts: attempts,
        flowDuration: duration,
        detectedAt,
        status: 'NEW',
        summary: `Repetitive connection burst originating from ${sourceIp} targeting authentication port ${targetPort}.`,
        indicators: [
          `${attempts} rapid connection attempts to port ${targetPort} within ${duration}s`,
          `Short TCP session duration pattern typical of automated password spraying`,
          `Connection frequency exceeds baseline threshold by ${randomInt(250, 480)}%`,
          `Repeated handshake failures detected without payload transfer`,
        ],
        recommendedAction: `Review authentication logs for target service on port ${targetPort} and block source IP ${sourceIp}.`,
      };
    }

    case 'TRAFFIC_ANOMALY':
    default: {
      const zScore = randomFloat(3.1, 4.9, 1);
      const duration = randomFloat(8.0, 35.0, 1);
      const confidence = randomFloat(80.5, 93.5, 1);
      const riskScore = randomInt(55, 75);
      const severity: Severity = 'MEDIUM';
      const attempts = randomInt(40, 150);

      return {
        id,
        threatType: 'ANOMALY',
        title: 'PROTOCOL DEVIATION ANOMALY',
        severity,
        confidence,
        riskScore,
        sourceIp,
        destinationIp,
        protocol: randomChoice(['UDP', 'TCP', 'ICMP']),
        destinationPortCount: randomInt(2, 6),
        connectionAttempts: attempts,
        flowDuration: duration,
        detectedAt,
        status: 'NEW',
        summary: `Traffic telemetry from ${sourceIp} exhibits statistical deviation (Z-score ${zScore}) from learned baseline profile.`,
        indicators: [
          `Packet size distribution skewness (Z-score: ${zScore})`,
          `Off-hour unidirectional flow volume anomaly`,
          `Non-standard TCP option header combinations detected`,
          `Deviation score: ${randomFloat(65.0, 85.0, 1)} / 100`,
        ],
        recommendedAction: `Monitor flow telemetry for ${sourceIp} and review host behavior against standard operational profile.`,
      };
    }
  }
}
