"""
UniGuard AI - Production Inference Engine
Smart India Hackathon 2026 Problem Statement 145

Exposes standardized ThreatPredictor class providing realtime threat classification,
calibrated anomaly scoring, severity mapping, and XAI feature explanations.
"""

import time
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Union

from src.config import (
    MODEL_PATH,
    PREPROCESSOR_PATH,
    METADATA_PATH,
    LABEL_MAP,
    ALL_FEATURES,
    RECOMMENDED_ACTIONS,
)
from src.schemas import NetworkFlowPayload, InferenceResponse, FeatureExplanation
from src.explain import FeatureDeviationExplainer


class ThreatPredictor:
    """
    Standardized inference predictor for UniGuard AI threat detection.
    """

    def __init__(
        self,
        model_path=MODEL_PATH,
        preprocessor_path=PREPROCESSOR_PATH,
        metadata_path=METADATA_PATH,
    ):
        print("Initializing UniGuard AI ThreatPredictor...")

        if not model_path.exists() or not preprocessor_path.exists():
            raise FileNotFoundError(
                f"Model artifacts missing! Ensure you ran python ml/src/train.py. "
                f"Expected: {model_path} and {preprocessor_path}"
            )

        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)

        with open(metadata_path, "r") as f:
            self.metadata = json.load(f)

        baselines = self.metadata.get("benign_baselines", {})
        self.explainer = FeatureDeviationExplainer(baselines=baselines)
        print(f"Predictor ready! Active Model: {self.metadata.get('model_name', 'Classifier')}")

    def predict(self, payload_input: Union[Dict[str, Any], NetworkFlowPayload]) -> InferenceResponse:
        """
        Runs threat prediction pipeline on single flow payload.
        Returns validated InferenceResponse adhering strictly to UniGuard AI SOC contract.
        """
        start_time = time.perf_counter()

        # 1. Validate Input Payload
        if isinstance(payload_input, dict):
            payload = NetworkFlowPayload(**payload_input)
        else:
            payload = payload_input

        # 2. Format single-row DataFrame
        df_input = pd.DataFrame(
            [
                {
                    "flow_duration": payload.flow_duration,
                    "packet_count": payload.packet_count,
                    "byte_count": payload.byte_count,
                    "packets_per_second": payload.packets_per_second,
                    "bytes_per_second": payload.bytes_per_second,
                    "avg_packet_length": payload.avg_packet_length,
                    "destination_port": payload.destination_port,
                    "source_port": payload.source_port,
                    "protocol": payload.protocol,
                }
            ]
        )

        # 3. Transform features
        X_trans = self.preprocessor.transform(df_input)

        # 4. Predict probabilities
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(X_trans)[0]
            pred_idx = int(np.argmax(probs))
            confidence_val = float(probs[pred_idx]) * 100.0
        else:
            pred_idx = int(self.model.predict(X_trans)[0])
            confidence_val = 90.0
            probs = [0.0] * len(LABEL_MAP)
            probs[pred_idx] = 0.90

        # 5. Extract Threat Category
        threat_type = LABEL_MAP.get(pred_idx, "ANOMALY")
        is_benign = pred_idx == 0
        prediction_str = "BENIGN" if is_benign else "MALICIOUS"

        # 6. Calibrated Anomaly Score (0.0 to 100.0)
        benign_prob = float(probs[0]) if len(probs) > 0 else (1.0 if is_benign else 0.0)
        malicious_prob = 1.0 - benign_prob

        if is_benign:
            anomaly_score = float(np.clip(malicious_prob * 60.0, 0.0, 35.0))
        else:
            anomaly_score = float(np.clip(50.0 + (malicious_prob * 50.0), 50.0, 100.0))

        # 7. Severity Assignment
        if is_benign:
            severity = "LOW"
        elif anomaly_score >= 85.0 or threat_type in ["DOS"]:
            severity = "CRITICAL"
        elif anomaly_score >= 65.0 or threat_type in ["PORT_SCAN"]:
            severity = "HIGH"
        else:
            severity = "MEDIUM"

        # 8. XAI Explanation & Recommended Actions
        explanations = self.explainer.explain_flow(payload)
        actions = RECOMMENDED_ACTIONS.get(threat_type, RECOMMENDED_ACTIONS["ANOMALY"])

        # 9. Execution Latency
        end_time = time.perf_counter()
        exec_ms = round((end_time - start_time) * 1000.0, 2)

        return InferenceResponse(
            prediction=prediction_str,
            threat_type=threat_type,
            confidence=round(confidence_val, 1),
            anomaly_score=round(anomaly_score, 1),
            severity=severity,
            explanation=explanations,
            recommended_action=actions,
            execution_time_ms=exec_ms,
        )


if __name__ == "__main__":
    predictor = ThreatPredictor()

    print("\n--- Test 1: BENIGN Flow ---")
    benign_sample = {
        "flow_duration": 15.0,
        "packet_count": 40,
        "byte_count": 25000,
        "destination_port": 443,
        "protocol": "TCP",
    }
    resp1 = predictor.predict(benign_sample)
    print(resp1.model_dump_json(indent=2))

    print("\n--- Test 2: PORT SCAN Flow ---")
    scan_sample = {
        "flow_duration": 0.05,
        "packet_count": 2,
        "byte_count": 120,
        "destination_port": 2222,
        "protocol": "TCP",
    }
    resp2 = predictor.predict(scan_sample)
    print(resp2.model_dump_json(indent=2))
