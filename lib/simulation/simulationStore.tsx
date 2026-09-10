'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  NetworkTraffic,
  ThreatEvent,
  ThreatType,
  TrafficMetrics,
  ThreatStatus,
  Severity,
} from '@/lib/types/network';
import {
  generateNormalTraffic,
  generateSimulatedThreat,
} from './simulationEngine';
import {
  checkMlHealth,
  predictTelemetry,
  MlHealthStatus,
  MlInputPayload,
  MlPredictionResponse,
} from '@/lib/api/mlClient';

export interface ToastAlert {
  id: string;
  threatId: string;
  title: string;
  severity: Severity;
  sourceIp: string;
  threatType: ThreatType;
  message: string;
  confidence: number;
}

export interface SimulationContextType {
  trafficHistory: NetworkTraffic[];
  threats: ThreatEvent[];
  isPaused: boolean;
  activeToast: ToastAlert | null;
  metrics: TrafficMetrics;
  threatDistribution: Record<ThreatType, number>;
  trafficChartData: { time: string; packetRate: number; byteRate: number }[];
  threatChartData: { time: string; critical: number; high: number; medium: number; low: number }[];
  detectionMode: 'simulation' | 'ml';
  mlHealth: MlHealthStatus | null;
  isMlConnecting: boolean;
  setDetectionMode: (mode: 'simulation' | 'ml') => Promise<void>;
  checkHealth: () => Promise<MlHealthStatus>;
  simulateThreat: (type: ThreatType) => ThreatEvent;
  togglePause: () => void;
  resetDemo: () => void;
  dismissToast: () => void;
  updateThreatStatus: (id: string, status: ThreatStatus) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

const MAX_TRAFFIC_POINTS = 60;
const MAX_THREATS_COUNT = 50;

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createSeedThreats(): ThreatEvent[] {
  return [
    { ...generateSimulatedThreat('PORT_SCAN', '192.168.1.25', '10.0.0.12'), detectionSource: 'simulation' },
    { ...generateSimulatedThreat('TRAFFIC_ANOMALY', '10.0.0.42', '10.0.0.5'), detectionSource: 'simulation' },
    { ...generateSimulatedThreat('DOS_DDOS', '172.16.4.12', '10.0.0.88'), detectionSource: 'simulation' },
    { ...generateSimulatedThreat('BRUTE_FORCE', '192.168.1.108', '10.0.0.45'), detectionSource: 'simulation' },
  ];
}

function createSeedTraffic(): NetworkTraffic[] {
  const list: NetworkTraffic[] = [];
  const now = Date.now();
  for (let i = 30; i >= 0; i--) {
    const item = generateNormalTraffic();
    item.timestamp = new Date(now - i * 1000).toISOString();
    list.push(item);
  }
  return list;
}

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trafficHistory, setTrafficHistory] = useState<NetworkTraffic[]>(createSeedTraffic);
  const [threats, setThreats] = useState<ThreatEvent[]>(createSeedThreats);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);

  // Real ML Mode State
  const [detectionMode, setDetectionModeState] = useState<'simulation' | 'ml'>('simulation');
  const [mlHealth, setMlHealth] = useState<MlHealthStatus | null>(null);
  const [isMlConnecting, setIsMlConnecting] = useState<boolean>(false);

  // Check ML Health
  const checkHealth = useCallback(async (): Promise<MlHealthStatus> => {
    setIsMlConnecting(true);
    const health = await checkMlHealth();
    setMlHealth(health);
    setIsMlConnecting(false);
    return health;
  }, []);

  // Set Detection Mode Switcher
  const setDetectionMode = useCallback(async (mode: 'simulation' | 'ml') => {
    if (mode === 'ml') {
      setIsMlConnecting(true);
      const health = await checkMlHealth();
      setMlHealth(health);
      setIsMlConnecting(false);

      if (health.model_loaded) {
        setDetectionModeState('ml');
      } else {
        setDetectionModeState('simulation');
        setActiveToast({
          id: `TOAST-ML-ERR-${Date.now()}`,
          threatId: '',
          title: 'Real ML Service Unavailable',
          severity: 'HIGH',
          sourceIp: '127.0.0.1',
          threatType: 'ANOMALY',
          message: health.detail || 'FastAPI ML server is offline. Run `uvicorn api:app --port 8000` in ml/ directory.',
          confidence: 0,
        });
      }
    } else {
      setDetectionModeState('simulation');
    }
  }, []);

  // Initial & Periodic Centralized Health Check on Mount (Every 10s)
  useEffect(() => {
    checkHealth();
    const interval = setInterval(() => {
      checkHealth();
    }, 10000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  // Derived Single Source of Truth Metrics
  const metrics = useMemo<TrafficMetrics>(() => {
    const latestTraffic = trafficHistory[trafficHistory.length - 1];
    const basePktRate = 12482 + Math.floor(Math.sin(Date.now() / 2000) * 450);
    const activeFlows = 1842 + Math.floor(Math.cos(Date.now() / 3000) * 35);
    
    const threatsCount = threats.length;
    const criticalAlertsCount = threats.filter(
      (t) => (t.severity === 'HIGH' || t.severity === 'CRITICAL') && t.status !== 'RESOLVED'
    ).length;

    const healthPenalty = criticalAlertsCount * 1.8;
    const networkHealth = Number(Math.max(88.5, Math.min(99.4, 98.7 - healthPenalty)).toFixed(1));

    return {
      totalPacketsPerSec: latestTraffic ? latestTraffic.packetRate + basePktRate : basePktRate,
      activeFlows,
      threatsDetected: threatsCount,
      criticalAlerts: criticalAlertsCount,
      networkHealth,
      byteRate: (latestTraffic ? latestTraffic.bytes : 84000) * 12,
      protocolBreakdown: {
        TCP: 78,
        UDP: 18,
        ICMP: 4,
      },
    };
  }, [trafficHistory, threats]);

  // Derived Threat Distribution map
  const threatDistribution = useMemo<Record<ThreatType, number>>(() => {
    const dist: Record<ThreatType, number> = {
      PORT_SCAN: 0,
      DOS_DDOS: 0,
      DOS: 0,
      BRUTE_FORCE: 0,
      ANOMALY: 0,
      TRAFFIC_ANOMALY: 0,
      SUSPICIOUS_TRAFFIC: 0,
    };
    threats.forEach((t) => {
      if (dist[t.threatType] !== undefined) {
        dist[t.threatType] += 1;
      }
    });
    return dist;
  }, [threats]);

  // Derived Traffic Chart Data (rolling 60 points)
  const trafficChartData = useMemo(() => {
    return trafficHistory.map((t) => {
      const timeStr = new Date(t.timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return {
        time: timeStr,
        packetRate: t.packetRate + 12000 + Math.floor(Math.random() * 800),
        byteRate: Math.round((t.bytes * 10) / 1024),
      };
    });
  }, [trafficHistory]);

  // Derived Threat Chart Data
  const threatChartData = useMemo(() => {
    const result: { time: string; critical: number; high: number; medium: number; low: number }[] = [];
    const now = Date.now();
    for (let i = 9; i >= 0; i--) {
      const timeStr = new Date(now - i * 15000).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
      result.push({
        time: timeStr,
        critical: threats.filter((t) => t.severity === 'CRITICAL').length > 0 ? Math.floor(i / 3) : 0,
        high: threats.filter((t) => t.severity === 'HIGH').length,
        medium: threats.filter((t) => t.severity === 'MEDIUM').length,
        low: threats.filter((t) => t.severity === 'LOW').length,
      });
    }
    return result;
  }, [threats]);

  // Action: Trigger Manual Threat Simulation
  const simulateThreat = useCallback((type: ThreatType): ThreatEvent => {
    const newThreat: ThreatEvent = {
      ...generateSimulatedThreat(type),
      detectionSource: 'simulation',
    };
    
    setThreats((prev) => [newThreat, ...prev].slice(0, MAX_THREATS_COUNT));

    const trafficEvent: NetworkTraffic = {
      id: `PKT-THREAT-${Date.now()}`,
      timestamp: newThreat.detectedAt,
      sourceIp: newThreat.sourceIp,
      destinationIp: newThreat.destinationIp,
      protocol: newThreat.protocol,
      sourcePort: randomChoice([49231, 51042, 60124]),
      destinationPort: newThreat.destinationPortCount > 1 ? 443 : 22,
      packets: newThreat.connectionAttempts,
      bytes: newThreat.connectionAttempts * 512,
      status: 'ANOMALOUS',
      packetRate: Math.round(newThreat.connectionAttempts / Math.max(1, newThreat.flowDuration)),
      flowDuration: newThreat.flowDuration,
      avgPacketSize: 512,
      tcpFlags: 'SYN',
      destinationPortCount: newThreat.destinationPortCount,
    };

    setTrafficHistory((prev) => [...prev.slice(1), trafficEvent]);

    if (newThreat.severity === 'HIGH' || newThreat.severity === 'CRITICAL') {
      setActiveToast({
        id: `TOAST-${Date.now()}`,
        threatId: newThreat.id,
        title: `${newThreat.severity} Severity Threat Detected`,
        severity: newThreat.severity,
        sourceIp: newThreat.sourceIp,
        threatType: newThreat.threatType,
        message: `${newThreat.title} from ${newThreat.sourceIp} (${newThreat.confidence}% confidence)`,
        confidence: newThreat.confidence,
      });
    }

    return newThreat;
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetDemo = useCallback(() => {
    setTrafficHistory(createSeedTraffic());
    setThreats(createSeedThreats());
    setActiveToast(null);
    setIsPaused(false);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const updateThreatStatus = useCallback((id: string, status: ThreatStatus) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  // Background Stream Generator (Supports BOTH Simulation & Real ML Inference Modes)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      const pkt = generateNormalTraffic();

      if (detectionMode === 'ml' && mlHealth?.model_loaded) {
        // REAL ML MODE INFERENCE PATH
        const isTestAnomaly = Math.random() < 0.12;
        const payload: MlInputPayload = {
          source_ip: pkt.sourceIp,
          destination_ip: pkt.destinationIp,
          source_port: pkt.sourcePort,
          destination_port: isTestAnomaly ? randomChoice([8080, 2222, 31337]) : pkt.destinationPort,
          protocol: pkt.protocol,
          flow_duration: isTestAnomaly ? 0.05 : pkt.flowDuration,
          packet_count: isTestAnomaly ? 2 : pkt.packets,
          byte_count: isTestAnomaly ? 120 : pkt.bytes,
          packets_per_second: isTestAnomaly ? 40.0 : pkt.packetRate,
          bytes_per_second: isTestAnomaly ? 2400.0 : (pkt.flowDuration > 0 ? pkt.bytes / pkt.flowDuration : pkt.bytes),
          avg_packet_length: isTestAnomaly ? 60.0 : pkt.avgPacketSize,
        };

        try {
          const mlRes = await predictTelemetry(payload);

          if (mlRes.prediction === 'MALICIOUS') {
            const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
            const hexId = Math.floor(1000 + Math.random() * 9000);
            
            // Map threat type string to valid ThreatType
            let mappedType: ThreatType = 'ANOMALY';
            if (mlRes.threat_type === 'PORT_SCAN') mappedType = 'PORT_SCAN';
            else if (mlRes.threat_type === 'DOS') mappedType = 'DOS_DDOS';
            else if (mlRes.threat_type === 'BRUTE_FORCE') mappedType = 'BRUTE_FORCE';

            const mlThreat: ThreatEvent = {
              id: `THR-${dateStr}-${hexId}`,
              threatType: mappedType,
              title: `Real ML Alert: ${mlRes.threat_type}`,
              severity: mlRes.severity,
              confidence: mlRes.confidence,
              riskScore: mlRes.anomaly_score,
              sourceIp: payload.source_ip || '192.168.1.50',
              destinationIp: payload.destination_ip || '10.0.0.15',
              protocol: payload.protocol as any,
              destinationPortCount: payload.destination_port === 8080 ? 41 : 1,
              connectionAttempts: payload.packet_count,
              flowDuration: payload.flow_duration,
              detectedAt: new Date().toISOString(),
              status: 'NEW',
              summary: mlRes.explanation[0]?.description || `Real UNSW-NB15 ML model classified flow as ${mlRes.threat_type}`,
              indicators: mlRes.explanation.map((e) => e.description),
              recommendedAction: mlRes.recommended_action[0] || 'Execute perimeter firewall policy.',
              detectionSource: 'ml',
              explanationDetails: mlRes.explanation,
              recommendedActionsList: mlRes.recommended_action,
            };

            setThreats((prev) => [mlThreat, ...prev].slice(0, MAX_THREATS_COUNT));

            if (mlThreat.severity === 'CRITICAL' || mlThreat.severity === 'HIGH') {
              setActiveToast({
                id: `TOAST-${Date.now()}`,
                threatId: mlThreat.id,
                title: `Real ML Alert: ${mlThreat.title}`,
                severity: mlThreat.severity,
                sourceIp: mlThreat.sourceIp,
                threatType: mlThreat.threatType,
                message: mlThreat.summary,
                confidence: mlThreat.confidence,
              });
            }
          }
        } catch (err) {
          console.warn('Real ML Inference stream failed:', err);
        }

        setTrafficHistory((prev) => {
          const updated = [...prev, pkt];
          return updated.length > MAX_TRAFFIC_POINTS ? updated.slice(updated.length - MAX_TRAFFIC_POINTS) : updated;
        });

      } else {
        // DEMO SIMULATION MODE INFERENCE PATH
        const isRandomAnomaly = Math.random() < 0.05;
        
        if (isRandomAnomaly) {
          const types: ThreatType[] = ['PORT_SCAN', 'TRAFFIC_ANOMALY', 'BRUTE_FORCE'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const threat = {
            ...generateSimulatedThreat(randomType),
            detectionSource: 'simulation' as const,
          };
          
          setThreats((prev) => [threat, ...prev].slice(0, MAX_THREATS_COUNT));
          
          if (threat.severity === 'CRITICAL' || threat.severity === 'HIGH') {
            setActiveToast({
              id: `TOAST-${Date.now()}`,
              threatId: threat.id,
              title: `${threat.severity} Alert: ${threat.title}`,
              severity: threat.severity,
              sourceIp: threat.sourceIp,
              threatType: threat.threatType,
              message: `${threat.summary}`,
              confidence: threat.confidence,
            });
          }
        } else {
          setTrafficHistory((prev) => {
            const updated = [...prev, pkt];
            return updated.length > MAX_TRAFFIC_POINTS ? updated.slice(updated.length - MAX_TRAFFIC_POINTS) : updated;
          });
        }
      }
    }, 1800);

    return () => clearInterval(interval);
  }, [isPaused, detectionMode, mlHealth]);

  return (
    <SimulationContext.Provider
      value={{
        trafficHistory,
        threats,
        isPaused,
        activeToast,
        metrics,
        threatDistribution,
        trafficChartData,
        threatChartData,
        detectionMode,
        mlHealth,
        isMlConnecting,
        setDetectionMode,
        checkHealth,
        simulateThreat,
        togglePause,
        resetDemo,
        dismissToast,
        updateThreatStatus,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
