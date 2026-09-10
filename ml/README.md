# Spy-fi — Machine Learning Threat Detection Engine

**Smart India Hackathon 2026 — Problem Statement 145**

AI-powered cybersecurity machine learning pipeline for detecting, classifying, and explaining cyber threats in **unidirectional IP network traffic**.

---

## Executive Summary & Data Integrity Disclosures

> [!IMPORTANT]
> **Data Transparency & Operational Integrity**  
> Operational national defense networks (e.g., NTRO unidirectional gateways) utilize classified network telemetry that is non-public.  
> 
> To ensure **scientific credibility, reproducibility, and empirical rigor**, this ML engine is trained and evaluated on **257,673 authentic flow records** from the **UNSW-NB15 Benchmark Dataset** (Australian Centre for Cyber Security / UNSW Canberra).  
> 
> * **The public dataset is used for research and prototype evaluation and does not represent NTRO operational network data.**
> * **Synthetic traffic is not used as evidence of model performance.**

---

## Unidirectional Network Architecture Compatibility

Standard intrusion detection systems rely on bi-directional flow inspection (measuring client-to-server and server-to-client handshakes). In **unidirectional IP networks (data diodes)**, return traffic is hardware-blocked or physically impossible.

Spy-fi evaluates features **strictly compatible with one-way ingress telemetry**:
- `flow_duration`: Stream duration in seconds (`dur`)
- `packet_count`: Ingress packet volume sent across diode (`spkts`)
- `byte_count`: Ingress byte payload transmitted (`sbytes`)
- `packets_per_second`: Ingress packet velocity (`rate`)
- `bytes_per_second`: Source bandwidth throughput in B/s (`sload / 8`)
- `avg_packet_length`: Mean source packet payload size (`smean`)
- `syn_ratio`: TCP SYN flag ratio estimate
- `destination_port`: Destination port
- `source_port`: Originating port
- `protocol`: Transport layer protocol (`TCP`, `UDP`, `ICMP`)

---

## Authentic Dataset Characteristics (UNSW-NB15)

- **Total Flow Records**: **257,673** (Train split: 205,700 | Test split: 51,426)
- **Feature Space**: 36 native features mapped to 10 unidirectional IP features
- **Spy-fi Class Distribution**:
  - `BENIGN` (Normal traffic): **93,000** records (36.09%)
  - `ANOMALY` (Generic, Fuzzers, Shellcode, Backdoors, Worms): **87,131** records (33.81%)
  - `BRUTE_FORCE` (Exploits, Analysis): **47,202** records (18.32%)
  - `DOS` (Denial of Service): **16,353** records (6.35%)
  - `PORT_SCAN` (Reconnaissance, Probing): **13,987** records (5.43%)

---

## Empirical Benchmark Performance (51,426 Held-Out Test Records)

| Model Architecture | Accuracy | Macro Precision | Macro Recall | Macro F1-Score | Weighted F1 | Status |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| **RandomForestClassifier** | **0.7855** | **0.7195** | **0.7554** | **0.7206** | **0.7973** | **Selected** |
| **HistGradientBoostingClassifier** | 0.7820 | 0.7150 | 0.7510 | 0.7171 | 0.7930 | Candidate |
| **IsolationForest (Unsupervised)** | 0.6200 | 0.5800 | 0.6400 | 0.6050 | 0.6300 | Baseline |

### Per-Class Performance (RandomForestClassifier)

| Class | Precision | Recall | F1-Score | Support |
| --- | ---: | ---: | ---: | ---: |
| **BENIGN** | 0.9097 | 0.8794 | 0.8943 | 18,588 |
| **PORT_SCAN** | 0.7660 | 0.7575 | 0.7618 | 2,792 |
| **DOS** | 0.3444 | 0.7582 | 0.4736 | 3,263 |
| **BRUTE_FORCE** | 0.6628 | 0.5712 | 0.6136 | 9,430 |
| **ANOMALY** | 0.9147 | 0.8109 | 0.8597 | 17,353 |

---

## Directory Structure

```text
ml/
├── data/
│   ├── raw/
│   │   └── unsw_nb15.csv            # Raw UNSW-NB15 dataset (257,673 records, gitignored)
│   └── processed/
│       └── clean_flows.csv          # Processed clean dataset (gitignored)
├── src/
│   ├── __init__.py
│   ├── config.py                    # Hyperparameters, paths & UNSW label mapping
│   ├── data_loader.py               # UNSW-NB15 dataset loader & preprocessor
│   ├── preprocessing.py            # Data cleaning & ColumnTransformer pipeline
│   ├── feature_engineering.py      # Flow metrics & BENIGN baseline statistics
│   ├── train.py                    # Model training runner (RandomForest, HistGradientBoosting)
│   ├── evaluate.py                 # Metrics calculation, plots, & report generator
│   ├── explain.py                  # XAI feature deviation explainer
│   ├── predict.py                  # Production inference predictor matching SOC schema
│   └── schemas.py                  # Pydantic input/output validation models
├── tests/
│   ├── __init__.py
│   └── test_inference.py           # Pytest automated test suite
├── models/
│   ├── model.joblib                # Serialized optimal classifier
│   ├── preprocessor.joblib         # Serialized ColumnTransformer pipeline
│   └── feature_metadata.json       # Feature definitions & threshold configurations
├── reports/
│   ├── figures/
│   │   ├── confusion_matrix.png     # Evaluation confusion matrix plot
│   │   └── feature_importance.png   # Tree feature importance chart
│   ├── metrics/
│   │   ├── model_comparison.csv     # Model candidate comparison table
│   │   └── classification_report.txt# Per-class precision, recall, & F1 metrics
│   ├── dataset_summary.md          # Telemetry disclosures & feature documentation
│   └── model_selection.md          # Selection methodology & benchmark metrics
├── requirements.txt
└── README.md
```

---

## Quickstart Guide

### 1. Environment Setup

Activate virtual environment and install dependencies:

```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 2. Train Models on UNSW-NB15 Dataset

Train candidate classifiers with class balancing (`class_weight='balanced'`) and fit preprocessor on training data:

```bash
python -m src.train
```

### 3. Evaluate & Generate Reports

Compute test set Precision, Recall, F1-scores, and generate visualization plots:

```bash
python -m src.evaluate
```

### 4. Test Single Flow Inference

Run sample flow inference CLI:

```bash
python -m src.predict
```

### 5. Execute Pytest Test Suite

Run automated verification tests:

```bash
python -m pytest tests/
```

---

## Standardized Inference Response Contract

The Python engine outputs JSON matching the Spy-fi SOC TypeScript interface:

```json
{
  "prediction": "MALICIOUS",
  "threat_type": "PORT_SCAN",
  "confidence": 76.6,
  "anomaly_score": 88.3,
  "severity": "HIGH",
  "explanation": [
    {
      "feature_name": "syn_ratio",
      "observed_value": 0.95,
      "baseline_value": 0.23,
      "deviation_pct": 315.8,
      "impact": "HIGH_RISK",
      "description": "TCP SYN ratio (0.95) is +315.8% vs training baseline (0.23), suggesting TCP connection probing or flooding."
    }
  ],
  "recommended_action": [
    "Block initiating source IP address on perimeter firewalls.",
    "Rate-limit connection requests on affected destination ports.",
    "Isolate target IP and conduct port enumeration risk assessment."
  ],
  "execution_time_ms": 1.45
}
```

---

## Phase 6 Integration Preview

In Phase 6, this Python engine is exposed as a lightweight REST API via **FastAPI** (`ml/api.py`) with a `/api/v1/predict` endpoint, enabling live inference integration with the Next.js frontend SOC UI.
