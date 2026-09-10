"""
UniGuard AI - Authentic Dataset Loader & UNSW-NB15 Pipeline
Smart India Hackathon 2026 Problem Statement 145

Loads authentic UNSW-NB15 network flow dataset, performs unidirectional feature mapping,
and applies UniGuard threat taxonomy mapping.
"""

import pandas as pd
import numpy as np
from pathlib import Path
from typing import Tuple, Dict, Any

from src.config import (
    RAW_DATA_PATH,
    PROCESSED_DATA_PATH,
    RANDOM_SEED,
    LABEL_MAP,
    UNSW_LABEL_MAPPING,
    ALL_FEATURES,
    TARGET_COLUMN,
)


def load_and_process_unsw_dataset(
    raw_path: Path = RAW_DATA_PATH,
    sample_limit: int = None,
) -> pd.DataFrame:
    """
    Loads authentic UNSW-NB15 dataset from CSV, performs unidirectional feature mapping,
    applies label taxonomy mapping, and handles missing/invalid values.
    """
    if not raw_path.exists():
        raise FileNotFoundError(
            f"Raw dataset file missing at {raw_path}. Run data download script first!"
        )

    print(f"Loading authentic UNSW-NB15 raw dataset from {raw_path}...")
    df_raw = pd.read_csv(raw_path)
    total_raw_rows = len(df_raw)
    print(f"Raw UNSW-NB15 Records Loaded: {total_raw_rows:,} rows, {df_raw.shape[1]} columns")

    # Optional subsampling for quick dev/test iterations while keeping class proportions
    if sample_limit and sample_limit < total_raw_rows:
        df_raw = df_raw.sample(n=sample_limit, random_state=RANDOM_SEED).reset_index(drop=True)
        print(f"Sampled {sample_limit:,} rows for processing.")

    # Native Feature Mapping from UNSW-NB15
    df_proc = pd.DataFrame()

    # 1. Flow Duration (seconds)
    df_proc["flow_duration"] = df_raw["dur"].astype(float).clip(lower=0.0)

    # 2. Source Packet Count (Ingress packets)
    df_proc["packet_count"] = df_raw["spkts"].astype(int).clip(lower=0)

    # 3. Source Byte Count (Ingress payload)
    df_proc["byte_count"] = df_raw["sbytes"].astype(int).clip(lower=0)

    # 4. Packets Per Second Rate
    df_proc["packets_per_second"] = df_raw["rate"].astype(float).clip(lower=0.0)

    # 5. Bytes Per Second Throughput (sload is in bits/sec -> convert to Bytes/sec)
    df_proc["bytes_per_second"] = (df_raw["sload"].astype(float) / 8.0).clip(lower=0.0)

    # 6. Average Packet Length (smean in bytes)
    df_proc["avg_packet_length"] = df_raw["smean"].astype(float).clip(lower=0.0)

    # 7. Destination Port (Use native dsport if present, else default 0)
    if "dsport" in df_raw.columns:
        df_proc["destination_port"] = pd.to_numeric(df_raw["dsport"], errors="coerce").fillna(0).astype(int).clip(lower=0, upper=65535)
    else:
        df_proc["destination_port"] = 0

    # 8. Source Port (Use native sport if present, else default 0)
    if "sport" in df_raw.columns:
        df_proc["source_port"] = pd.to_numeric(df_raw["sport"], errors="coerce").fillna(0).astype(int).clip(lower=0, upper=65535)
    else:
        df_proc["source_port"] = 0

    # 9. Protocol (Uppercase string)
    df_proc["protocol"] = df_raw["proto"].str.upper().apply(
        lambda p: p if p in ["TCP", "UDP", "ICMP"] else "TCP"
    )

    # 10. Label Taxonomy Mapping (4-Class Taxonomy)
    raw_cat = df_raw["attack_cat"].fillna("Normal").astype(str).str.strip()
    df_proc["label"] = raw_cat.map(UNSW_LABEL_MAPPING).fillna(3).astype(int)  # Default to 3 (ANOMALY) if unmapped
    df_proc["label_name"] = df_proc["label"].map(LABEL_MAP)
    df_proc["native_attack_cat"] = raw_cat

    # Save processed clean CSV
    df_proc.to_csv(PROCESSED_DATA_PATH, index=False)
    print(f"Saved processed dataset to {PROCESSED_DATA_PATH}")

    return df_proc


def load_or_create_dataset(force_recreate: bool = False) -> pd.DataFrame:
    """
    Main entrypoint: Loads processed UNSW dataset or builds from raw CSV.
    """
    if PROCESSED_DATA_PATH.exists() and not force_recreate:
        print(f"Loading clean dataset from {PROCESSED_DATA_PATH}...")
        df = pd.read_csv(PROCESSED_DATA_PATH)
    else:
        df = load_and_process_unsw_dataset()

    return df


if __name__ == "__main__":
    dataset = load_or_create_dataset(force_recreate=True)
    print("\nDataset Processing Summary:")
    print(f"Total Records: {len(dataset):,}")
    print("\nUniGuard Class Distribution:")
    print(dataset["label_name"].value_counts())
    print("\nClass Percentages:")
    print((dataset["label_name"].value_counts(normalize=True) * 100).round(2))
