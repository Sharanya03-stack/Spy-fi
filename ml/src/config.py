"""
UniGuard AI - Real Dataset ML Configuration & Constant Definitions
Smart India Hackathon 2026 Problem Statement 145

Configured for authentic UNSW-NB15 network flow dataset training and evaluation.
"""

import os
from pathlib import Path

# Paths
SRC_DIR = Path(__file__).resolve().parent
ML_DIR = SRC_DIR.parent
DATA_DIR = ML_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
MODELS_DIR = ML_DIR / "models"
REPORTS_DIR = ML_DIR / "reports"
FIGURES_DIR = REPORTS_DIR / "figures"
METRICS_DIR = REPORTS_DIR / "metrics"

RAW_DATA_PATH = RAW_DATA_DIR / "unsw_nb15.csv"
PROCESSED_DATA_PATH = PROCESSED_DATA_DIR / "clean_flows.csv"
MODEL_PATH = MODELS_DIR / "model.joblib"
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"
METADATA_PATH = MODELS_DIR / "feature_metadata.json"

# Ensure directories exist
for path in [RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, FIGURES_DIR, METRICS_DIR]:
    path.mkdir(parents=True, exist_ok=True)

# Random Seed
RANDOM_SEED = 42

# UniGuard Threat Taxonomy Map (4-Class Taxonomy)
LABEL_MAP = {
    0: "BENIGN",
    1: "PORT_SCAN",
    2: "DOS",
    3: "ANOMALY",
}

REVERSE_LABEL_MAP = {v: k for k, v in LABEL_MAP.items()}

# UNSW-NB15 Native Category to UniGuard Taxonomy Mapping
UNSW_LABEL_MAPPING = {
    "Normal": 0,          # BENIGN
    "Reconnaissance": 1,  # PORT_SCAN
    "DoS": 2,             # DOS
    "Generic": 3,         # ANOMALY
    "Exploits": 3,        # ANOMALY
    "Fuzzers": 3,         # ANOMALY
    "Analysis": 3,        # ANOMALY
    "Backdoor": 3,        # ANOMALY
    "Shellcode": 3,       # ANOMALY
    "Worms": 3,           # ANOMALY
}

# Feature Definitions (Native UNSW-NB15 Clean Mapping)
NUMERIC_FEATURES = [
    "flow_duration",
    "packet_count",
    "byte_count",
    "packets_per_second",
    "bytes_per_second",
    "avg_packet_length",
    "destination_port",
    "source_port",
]

CATEGORICAL_FEATURES = ["protocol"]
ALL_FEATURES = NUMERIC_FEATURES + CATEGORICAL_FEATURES
TARGET_COLUMN = "label"

# SOC Analyst Recommended Actions Matrix
RECOMMENDED_ACTIONS = {
    "BENIGN": [
        "No intervention required. Traffic matches standard operational profile.",
        "Continue passive network telemetry logging.",
    ],
    "PORT_SCAN": [
        "Block initiating source IP address on perimeter firewalls.",
        "Rate-limit connection requests on affected destination ports.",
        "Isolate target IP and conduct port enumeration risk assessment.",
        "Notify SOC Tier-2 analyst for reconnaissance investigation.",
    ],
    "DOS": [
        "Activate automated DDoS mitigation and rate-limiting rules.",
        "Reroute inbound traffic through upstream scrubbing center.",
        "Restrict bandwidth allocation for high-volume protocol flows.",
        "Escalate to Network Operations Center (NOC) immediately.",
    ],
    "ANOMALY": [
        "Quarantine suspicious data stream for deep packet inspection.",
        "Correlate protocol parameters with baseline endpoint behavior profile.",
        "Initiate manual threat hunt on destination host logs.",
        "Flag flow record for supervised ML retraining.",
    ],
}
