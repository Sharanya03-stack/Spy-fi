"""
UniGuard AI - Model Training & Artifact Serialization Pipeline
Smart India Hackathon 2026 Problem Statement 145

Trains RandomForest, HistGradientBoosting, and IsolationForest models with class balancing,
selects optimal classifier, and serializes model artifacts to ml/models/.
"""

import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier, IsolationForest
from sklearn.metrics import f1_score
from typing import Dict, Any

from src.config import (
    MODEL_PATH,
    PREPROCESSOR_PATH,
    METADATA_PATH,
    RANDOM_SEED,
    ALL_FEATURES,
    TARGET_COLUMN,
    LABEL_MAP,
)
from src.data_loader import load_or_create_dataset
from src.preprocessing import clean_dataset, build_preprocessor, get_feature_names_from_preprocessor
from src.feature_engineering import extract_flow_features, compute_benign_baselines


def train_models() -> Dict[str, Any]:
    """
    Main training workflow:
    1. Ingest dataset
    2. Clean & engineer features
    3. Stratified train/test split
    4. Fit ColumnTransformer on X_train ONLY
    5. Train candidate models with class balancing
    6. Evaluate candidates on X_test and select best classifier
    7. Save serialized model artifacts to ml/models/
    """
    print("=" * 60)
    print("UniGuard AI ML Training Pipeline")
    print("=" * 60)

    # 1. Load data
    raw_df = load_or_create_dataset(force_recreate=True)
    cleaned_df = clean_dataset(raw_df)
    feat_df = extract_flow_features(cleaned_df)

    X = feat_df[ALL_FEATURES]
    y = feat_df[TARGET_COLUMN]

    # 2. Train-test split (Leakage-free)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=RANDOM_SEED, stratify=y
    )

    print(f"\nTraining set size: {len(X_train)} samples")
    print(f"Testing set size: {len(X_test)} samples")

    # 3. Fit preprocessor on X_train ONLY
    preprocessor = build_preprocessor()
    X_train_trans = preprocessor.fit_transform(X_train)
    X_test_trans = preprocessor.transform(X_test)

    feature_names = get_feature_names_from_preprocessor(preprocessor)

    # 4. Train Model A: Random Forest
    print("\nTraining Model A: RandomForestClassifier (class_weight='balanced')...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        class_weight="balanced",
        random_state=RANDOM_SEED,
        n_jobs=-1,
    )
    rf_model.fit(X_train_trans, y_train)
    rf_y_pred = rf_model.predict(X_test_trans)
    rf_f1 = f1_score(y_test, rf_y_pred, average="macro")
    print(f"--> RandomForest Macro F1-Score: {rf_f1:.4f}")

    # 5. Train Model B: HistGradientBoosting
    print("\nTraining Model B: HistGradientBoostingClassifier (class_weight='balanced')...")
    hgb_model = HistGradientBoostingClassifier(
        max_iter=100,
        class_weight="balanced",
        random_state=RANDOM_SEED,
    )
    hgb_model.fit(X_train_trans, y_train)
    hgb_y_pred = hgb_model.predict(X_test_trans)
    hgb_f1 = f1_score(y_test, hgb_y_pred, average="macro")
    print(f"--> HistGradientBoosting Macro F1-Score: {hgb_f1:.4f}")

    # 6. Train Model C: Isolation Forest (Anomaly Baseline)
    print("\nTraining Model C: IsolationForest (Unsupervised Baseline)...")
    iso_model = IsolationForest(
        n_estimators=100,
        contamination=0.20,
        random_state=RANDOM_SEED,
        n_jobs=-1,
    )
    iso_model.fit(X_train_trans)

    # Model selection
    if rf_f1 >= hgb_f1:
        best_model = rf_model
        best_model_name = "RandomForestClassifier"
        best_f1 = rf_f1
    else:
        best_model = hgb_model
        best_model_name = "HistGradientBoostingClassifier"
        best_f1 = hgb_f1

    print(f"\n--> Selected Optimal Model: {best_model_name} (Macro F1 = {best_f1:.4f})")

    # 7. Compute benign baselines from X_train for XAI
    benign_baselines = compute_benign_baselines(X_train, y_train)

    # 8. Save serialized artifacts
    print(f"\nSaving model artifact to {MODEL_PATH}...")
    joblib.dump(best_model, MODEL_PATH)

    print(f"Saving preprocessor artifact to {PREPROCESSOR_PATH}...")
    joblib.dump(preprocessor, PREPROCESSOR_PATH)

    metadata = {
        "model_name": best_model_name,
        "macro_f1_score": round(float(best_f1), 4),
        "random_seed": RANDOM_SEED,
        "all_features": ALL_FEATURES,
        "transformed_feature_names": feature_names,
        "label_map": LABEL_MAP,
        "benign_baselines": benign_baselines,
        "candidate_f1_scores": {
            "RandomForestClassifier": round(float(rf_f1), 4),
            "HistGradientBoostingClassifier": round(float(hgb_f1), 4),
        },
    }

    print(f"Saving feature metadata to {METADATA_PATH}...")
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)

    print("\nArtifact serialization complete!")
    return {
        "best_model_name": best_model_name,
        "best_f1": best_f1,
        "rf_f1": rf_f1,
        "hgb_f1": hgb_f1,
        "X_train": X_train,
        "X_test": X_test,
        "y_train": y_train,
        "y_test": y_test,
    }


if __name__ == "__main__":
    train_models()
