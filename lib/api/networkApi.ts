import {
  MLInferencePayload,
  MLInferenceResponse,
  ThreatType,
  Severity,
} from '@/lib/types/network';

/**
 * Abstraction layer for Threat Inference API.
 * 
 * Current implementation uses simulated inference engine.
 * Future integration with Python FastAPI backend will replace the mock call
 * with: POST http://localhost:8000/api/v1/predict
 */
export async function analyzeTrafficPayload(
  payload: MLInferencePayload
): Promise<MLInferenceResponse> {
  // Simulated ML inference latency (50ms - 150ms)
  await new Promise((resolve) => setTimeout(resolve, 80));

  // Determine prediction based on packet rates and port counts
  let threatType: ThreatType = 'PORT_SCAN';
  let severity: Severity = 'HIGH';
  let confidence = 94.7;
  let anomalyScore = 87.5;
  let prediction = 'ANOMALOUS';
  let explanation = '';
  let recommendedAction = '';

  if (payload.destination_port_count > 20) {
    threatType = 'PORT_SCAN';
    severity = 'HIGH';
    confidence = Math.min(99.0, 90.0 + Math.random() * 8.0);
    anomalyScore = Math.min(95.0, 80.0 + Math.random() * 15.0);
    explanation = `${payload.packet_count} connection attempts across ${payload.destination_port_count} ports within ${payload.flow_duration.toFixed(1)}s interval from ${payload.source_ip}.`;
    recommendedAction = `Investigate source host ${payload.source_ip} and isolate flow on destination gateway ${payload.destination_ip}.`;
  } else if (payload.packet_rate > 30000) {
    threatType = 'DOS_DDOS';
    severity = 'CRITICAL';
    confidence = Math.min(99.5, 94.0 + Math.random() * 5.5);
    anomalyScore = Math.min(99.0, 90.0 + Math.random() * 9.0);
    explanation = `Volumetric traffic spike of ${payload.packet_rate.toLocaleString()} pkt/s detected from ${payload.source_ip}.`;
    recommendedAction = `Apply rate-limiting rule on ingress interfaces for ${payload.source_ip}.`;
  } else {
    threatType = 'TRAFFIC_ANOMALY';
    severity = 'MEDIUM';
    confidence = Math.min(93.0, 80.0 + Math.random() * 12.0);
    anomalyScore = Math.min(75.0, 50.0 + Math.random() * 25.0);
    explanation = `Traffic volume and packet size distribution from ${payload.source_ip} deviates from baseline models.`;
    recommendedAction = `Monitor flow telemetry for persistent anomaly signals.`;
  }

  return {
    prediction,
    threat_type: threatType,
    confidence: Number(confidence.toFixed(1)),
    anomaly_score: Number(anomalyScore.toFixed(1)),
    severity,
    explanation,
    recommended_action: recommendedAction,
  };
}
