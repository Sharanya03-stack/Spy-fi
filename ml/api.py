"""
UniGuard AI - FastAPI Threat Detection REST Service
Smart India Hackathon 2026 Problem Statement 145

Exposes real UNSW-NB15 trained Machine Learning Threat Engine via REST API endpoints.
"""

import os
import sys
import uuid
import time
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure ml directory is on path
ML_ROOT = Path(__file__).resolve().parent
if str(ML_ROOT) not in sys.path:
    sys.path.insert(0, str(ML_ROOT))

from src.config import MODEL_PATH, PREPROCESSOR_PATH, METADATA_PATH
from src.schemas import NetworkFlowPayload, InferenceResponse
from src.predict import ThreatPredictor

# Configure Structured Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("uniguard_api")

# Global Predictor Instance (Loaded ONCE at startup)
predictor_instance: Optional[ThreatPredictor] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup & Shutdown Lifespan Event Handler.
    Loads trained model artifacts ONCE at startup.
    """
    global predictor_instance
    logger.info("Initializing UniGuard AI FastAPI Service...")
    logger.info(f"Checking for model artifacts at {MODEL_PATH} and {PREPROCESSOR_PATH}...")

    if not MODEL_PATH.exists() or not PREPROCESSOR_PATH.exists():
        logger.error(
            f"CRITICAL: Model artifacts missing! "
            f"Expected: {MODEL_PATH} and {PREPROCESSOR_PATH}. "
            f"Run 'python ml/src/train.py' first!"
        )
        predictor_instance = None
    else:
        try:
            predictor_instance = ThreatPredictor(
                model_path=MODEL_PATH,
                preprocessor_path=PREPROCESSOR_PATH,
                metadata_path=METADATA_PATH,
            )
            logger.info(
                f"SUCCESS: Model '{predictor_instance.metadata.get('model_name')}' loaded successfully! "
                f"Macro F1 = {predictor_instance.metadata.get('macro_f1_score', 'N/A')}"
            )
        except Exception as e:
            logger.error(f"FAILED to load model artifacts: {str(e)}")
            predictor_instance = None

    yield

    logger.info("Shutting down UniGuard AI FastAPI Service...")


app = FastAPI(
    title="UniGuard AI - Threat Detection ML API",
    description="Real-time Machine Learning Threat Detection API for Unidirectional IP Network Telemetry (UNSW-NB15 Trained Model)",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler preventing stack trace exposure.
    """
    req_id = getattr(request.state, "request_id", str(uuid.uuid4()))
    logger.error(f"Uncaught Server Exception [ReqID: {req_id}]: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred during threat inference.",
            "request_id": req_id,
        },
    )


@app.get("/", include_in_schema=False)
async def root():
    return {
        "service": "UniGuard AI Threat Detection Engine",
        "docs": "/docs",
        "health": "/health",
        "predict": "/api/v1/predict",
    }


@app.get("/health", summary="Service Health & Model Status")
async def health_check():
    """
    Returns service health status and loaded model details.
    """
    if predictor_instance is None or predictor_instance.model is None:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "error",
                "model_loaded": False,
                "detail": "ML model artifacts unavailable. Run 'python ml/src/train.py'.",
            },
        )

    return {
        "status": "ok",
        "model_loaded": True,
        "model_type": predictor_instance.metadata.get("model_name", "RandomForestClassifier"),
        "dataset": "UNSW-NB15",
        "macro_f1": predictor_instance.metadata.get("macro_f1_score", 0.7206),
    }


@app.post(
    "/api/v1/predict",
    response_model=InferenceResponse,
    summary="Predict Cyber Threat from IP Telemetry Payload",
    response_description="Structured Threat Prediction, Anomaly Score, Severity, and XAI Explanations",
)
async def predict_threat(payload: NetworkFlowPayload, request: Request):
    """
    Ingests IP flow telemetry payload, transforms features, executes UNSW-NB15 model inference,
    computes Z-score XAI explanations, and returns structured SOC prediction response.
    """
    req_id = str(uuid.uuid4())
    request.state.request_id = req_id

    if predictor_instance is None or predictor_instance.model is None:
        logger.warning(f"Inference request rejected [ReqID: {req_id}]: Model artifacts uninitialized.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="ML inference engine unavailable: Model artifacts uninitialized.",
        )

    try:
        start_time = time.perf_counter()
        result = predictor_instance.predict(payload)
        exec_time = round((time.perf_counter() - start_time) * 1000.0, 2)

        # Structured Logging
        logger.info(
            f"[ReqID: {req_id}] Prediction: {result.prediction} | Threat: {result.threat_type} | "
            f"Confidence: {result.confidence}% | Anomaly Score: {result.anomaly_score} | "
            f"Severity: {result.severity} | Latency: {exec_time}ms"
        )

        return result

    except Exception as e:
        logger.error(f"Prediction Failure [ReqID: {req_id}]: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to execute threat prediction model.",
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
