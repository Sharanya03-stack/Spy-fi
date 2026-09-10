"""
UniGuard AI - Automated Pytest Suite for Real-Dataset Trained Model
Smart India Hackathon 2026 Problem Statement 145

Tests schema validation, range bounds, inference determinism, payload derivation,
and held-out real UNSW-NB15 dataset flow processing.
"""

import pytest
import sys
from pathlib import Path

# Add ml/ directory to path
ML_ROOT = Path(__file__).resolve().parent.parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from src.schemas import NetworkFlowPayload, InferenceResponse
from src.predict import ThreatPredictor
from src.data_loader import load_or_create_dataset
from src.config import TARGET_COLUMN, ALL_FEATURES


@pytest.fixture(scope="module")
def predictor():
    """
    Module fixture initializing ThreatPredictor with real UNSW-NB15 trained model.
    """
    from src.config import MODEL_PATH
    from src.train import train_models

    if not MODEL_PATH.exists():
        print("\n[PyTest Fixture] Training UNSW-NB15 model before test execution...")
        train_models()

    return ThreatPredictor()


def test_schema_and_range_validation(predictor):
    """
    Verifies inference output strictly adheres to InferenceResponse schema and range bounds.
    """
    payload = {
        "flow_duration": 1.5,
        "packet_count": 25,
        "byte_count": 3500,
        "destination_port": 443,
        "protocol": "TCP",
    }
    res = predictor.predict(payload)

    # Schema Validation
    assert isinstance(res, InferenceResponse)
    assert hasattr(res, "prediction")
    assert hasattr(res, "threat_type")
    assert hasattr(res, "confidence")
    assert hasattr(res, "anomaly_score")
    assert hasattr(res, "severity")
    assert hasattr(res, "explanation")
    assert hasattr(res, "recommended_action")

    # Range Validation
    assert 0.0 <= res.confidence <= 100.0
    assert 0.0 <= res.anomaly_score <= 100.0
    assert res.prediction in ["BENIGN", "MALICIOUS"]
    assert res.severity in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert len(res.explanation) > 0
    assert len(res.recommended_action) > 0


def test_inference_determinism(predictor):
    """
    Verifies same input payload produces identical predictions, confidence, and anomaly scores.
    """
    payload = {
        "flow_duration": 5.0,
        "packet_count": 80,
        "byte_count": 12000,
        "destination_port": 80,
        "protocol": "TCP",
    }

    res1 = predictor.predict(payload)
    res2 = predictor.predict(payload)

    assert res1.prediction == res2.prediction
    assert res1.threat_type == res2.threat_type
    assert res1.confidence == res2.confidence
    assert res1.anomaly_score == res2.anomaly_score
    assert res1.severity == res2.severity


def test_invalid_protocol_validation():
    """
    Verifies Pydantic raises ValueError for unsupported IP protocols.
    """
    raw_input = {
        "flow_duration": 1.0,
        "packet_count": 10,
        "byte_count": 500,
        "protocol": "INVALID_PROTO",
    }
    with pytest.raises(ValueError):
        NetworkFlowPayload(**raw_input)


def test_payload_derived_metrics():
    """
    Verifies missing rate metrics (pps, bps, avg_packet_length) are auto-derived.
    """
    raw_input = {
        "flow_duration": 10.0,
        "packet_count": 100,
        "byte_count": 50000,
        "protocol": "TCP",
    }
    payload = NetworkFlowPayload(**raw_input)

    assert payload.protocol == "TCP"
    assert payload.packets_per_second == 10.0
    assert payload.bytes_per_second == 5000.0
    assert payload.avg_packet_length == 500.0


def test_real_unsw_test_set_inference(predictor):
    """
    Verifies model inference pipeline succeeds on real held-out samples from UNSW-NB15 dataset.
    """
    df = load_or_create_dataset()
    sample_rows = df.sample(n=10, random_state=42)

    for _, row in sample_rows.iterrows():
        sample_payload = {
            "flow_duration": float(row["flow_duration"]),
            "packet_count": int(row["packet_count"]),
            "byte_count": int(row["byte_count"]),
            "packets_per_second": float(row["packets_per_second"]),
            "bytes_per_second": float(row["bytes_per_second"]),
            "avg_packet_length": float(row["avg_packet_length"]),
            "destination_port": int(row["destination_port"]),
            "source_port": int(row["source_port"]),
            "protocol": str(row["protocol"]),
        }

        res = predictor.predict(sample_payload)
        assert isinstance(res, InferenceResponse)
        assert 0.0 <= res.confidence <= 100.0
        assert 0.0 <= res.anomaly_score <= 100.0
