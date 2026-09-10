"""
UniGuard AI - Pytest Suite for FastAPI Service Endpoints
Smart India Hackathon 2026 Problem Statement 145

Tests /health, /api/v1/predict, Pydantic validation 422, CORS, and model status.
"""

import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add ml/ directory to path
ML_ROOT = Path(__file__).resolve().parent.parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from api import app


@pytest.fixture(scope="module")
def client():
    """
    TestClient fixture executing FastAPI startup lifespan.
    """
    with TestClient(app) as c:
        yield c


def test_health_endpoint(client):
    """
    Verifies GET /health returns 200 OK with model_loaded: True.
    """
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["model_loaded"] is True
    assert data["model_type"] in ["HistGradientBoostingClassifier", "RandomForestClassifier"]
    assert data["dataset"] == "UNSW-NB15"


def test_predict_endpoint_valid_payload(client):
    """
    Verifies POST /api/v1/predict processes valid payload and returns structured InferenceResponse.
    """
    payload = {
        "source_ip": "192.168.1.50",
        "destination_ip": "10.0.0.15",
        "source_port": 54321,
        "destination_port": 443,
        "protocol": "TCP",
        "flow_duration": 8.5,
        "packet_count": 50,
        "byte_count": 35000,
    }
    response = client.post("/api/v1/predict", json=payload)
    assert response.status_code == 200
    data = response.json()

    # Schema Validation
    assert "prediction" in data
    assert "threat_type" in data
    assert "confidence" in data
    assert "anomaly_score" in data
    assert "severity" in data
    assert "explanation" in data
    assert "recommended_action" in data

    # Value & Range Validation
    assert data["prediction"] in ["BENIGN", "MALICIOUS"]
    assert 0.0 <= data["confidence"] <= 100.0
    assert 0.0 <= data["anomaly_score"] <= 100.0
    assert data["severity"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert isinstance(data["explanation"], list)
    assert isinstance(data["recommended_action"], list)


def test_predict_endpoint_invalid_payload(client):
    """
    Verifies POST /api/v1/predict returns 422 Unprocessable Entity for invalid fields.
    """
    invalid_payload = {
        "flow_duration": -10.0,  # Invalid negative duration
        "packet_count": "NOT_AN_INT",  # Invalid type
        "protocol": "INVALID_PROTO",  # Invalid protocol
    }
    response = client.post("/api/v1/predict", json=invalid_payload)
    assert response.status_code == 422


def test_cors_headers(client):
    """
    Verifies CORS headers allow origin http://localhost:3000.
    """
    headers = {"Origin": "http://localhost:3000"}
    response = client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
