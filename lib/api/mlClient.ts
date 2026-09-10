/**
 * UniGuard AI - FastAPI ML Client Library
 * Smart India Hackathon 2026 Problem Statement 145
 *
 * Dedicated client module managing HTTP communications with Python FastAPI ML Threat Service.
 */

export interface MlHealthStatus {
  status: string;
  model_loaded: boolean;
  model_type?: string;
  dataset?: string;
  macro_f1?: number;
  detail?: string;
}

export interface MlInputPayload {
  source_ip?: string;
  destination_ip?: string;
  source_port: number;
  destination_port: number;
  protocol: string;
  flow_duration: number;
  packet_count: number;
  byte_count: number;
  packets_per_second?: number;
  bytes_per_second?: number;
  avg_packet_length?: number;
}

export interface FeatureExplanationItem {
  feature_name: string;
  observed_value: number;
  baseline_value: number;
  deviation_pct: number;
  impact: string;
  description: string;
}

export interface MlPredictionResponse {
  prediction: 'BENIGN' | 'MALICIOUS';
  threat_type: string;
  confidence: number;
  anomaly_score: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: FeatureExplanationItem[];
  recommended_action: string[];
  execution_time_ms: number;
}

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ML_API_URL) {
    return process.env.NEXT_PUBLIC_ML_API_URL;
  }
  return process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:8000';
};

/**
 * Checks the availability and health status of the FastAPI ML inference service.
 */
export async function checkMlHealth(): Promise<MlHealthStatus> {
  const baseUrl = getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        status: 'error',
        model_loaded: false,
        detail: errorData.detail || `HTTP Error ${res.status}: ${res.statusText}`,
      };
    }

    const data: MlHealthStatus = await res.json();
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      status: 'offline',
      model_loaded: false,
      detail: err.name === 'AbortError'
        ? 'ML API Health Check Timed Out (3s)'
        : 'Cannot connect to Python FastAPI ML Service (http://localhost:8000)',
    };
  }
}

/**
 * Sends IP flow telemetry payload to FastAPI /api/v1/predict for real ML inference.
 */
export async function predictTelemetry(payload: MlInputPayload): Promise<MlPredictionResponse> {
  const baseUrl = getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${baseUrl}/api/v1/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `ML API Error ${res.status}: ${res.statusText}`);
    }

    const data: MlPredictionResponse = await res.json();
    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(
      err.name === 'AbortError'
        ? 'ML Prediction Request Timed Out (5s)'
        : err.message || 'Failed to connect to FastAPI ML Inference Service'
    );
  }
}
