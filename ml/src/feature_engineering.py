"""
UniGuard AI - Feature Engineering & Baseline Statistics Extractor
Smart India Hackathon 2026 Problem Statement 145

Computes flow metrics and extracts normal baseline statistical reference metrics from training data.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any

from src.config import NUMERIC_FEATURES


def extract_flow_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Ensures all derived flow metric features exist in dataframe.
    """
    df_feat = df.copy()

    if "packets_per_second" not in df_feat.columns:
        duration = df_feat["flow_duration"].replace(0, 0.001)
        df_feat["packets_per_second"] = df_feat["packet_count"] / duration

    if "bytes_per_second" not in df_feat.columns:
        duration = df_feat["flow_duration"].replace(0, 0.001)
        df_feat["bytes_per_second"] = df_feat["byte_count"] / duration

    if "avg_packet_length" not in df_feat.columns:
        packets = df_feat["packet_count"].replace(0, 1)
        df_feat["avg_packet_length"] = df_feat["byte_count"] / packets

    return df_feat


def compute_benign_baselines(X_train: pd.DataFrame, y_train: pd.Series) -> Dict[str, Dict[str, float]]:
    """
    Computes baseline mean and std dev statistics for BENIGN (label == 0) traffic
    from training data ONLY. Used by XAI explainer.
    """
    benign_mask = y_train == 0
    X_benign = X_train[benign_mask]

    baselines = {}
    for feature in NUMERIC_FEATURES:
        if feature in X_benign.columns:
            mean_val = float(X_benign[feature].mean())
            std_val = float(X_benign[feature].std())
            baselines[feature] = {
                "mean": round(mean_val, 4),
                "std": round(std_val if std_val > 1e-6 else 1.0, 4),
            }

    return baselines
