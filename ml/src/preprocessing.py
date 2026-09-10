"""
UniGuard AI - Leakage-Free Preprocessing Pipeline
Smart India Hackathon 2026 Problem Statement 145

Handles data cleaning, missing value imputation, infinite checks, and constructs
Scikit-Learn ColumnTransformer pipeline (StandardScaler + OneHotEncoder).
"""

import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from typing import Tuple, List, Dict, Any

from src.config import (
    NUMERIC_FEATURES,
    CATEGORICAL_FEATURES,
    ALL_FEATURES,
    TARGET_COLUMN,
)


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw network flow dataframe:
    - Converts infinity to NaN
    - Imputes missing numeric values with column medians
    - Imputes missing categorical values with mode
    - Clips invalid negative flow numbers
    - Removes exact duplicate records
    """
    df_clean = df.copy()

    # Replace infs
    df_clean = df_clean.replace([np.inf, -np.inf], np.nan)

    # Impute numeric NaNs
    for col in NUMERIC_FEATURES:
        if col in df_clean.columns:
            median_val = df_clean[col].median()
            df_clean[col] = df_clean[col].fillna(median_val if not pd.isna(median_val) else 0.0)
            # Clip non-negative
            df_clean[col] = df_clean[col].clip(lower=0.0)

    # Impute categorical NaNs
    for col in CATEGORICAL_FEATURES:
        if col in df_clean.columns:
            mode_val = df_clean[col].mode()[0] if not df_clean[col].mode().empty else "TCP"
            df_clean[col] = df_clean[col].fillna(mode_val)

    # Deduplicate
    df_clean = df_clean.drop_duplicates().reset_index(drop=True)
    return df_clean


def build_preprocessor() -> ColumnTransformer:
    """
    Constructs an un-fitted Scikit-Learn ColumnTransformer pipeline.
    - Numeric features: StandardScaler
    - Categorical features: OneHotEncoder (handle_unknown='ignore')
    """
    numeric_transformer = StandardScaler()
    categorical_transformer = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, NUMERIC_FEATURES),
            ("cat", categorical_transformer, CATEGORICAL_FEATURES),
        ],
        remainder="drop",
    )
    return preprocessor


def get_feature_names_from_preprocessor(preprocessor: ColumnTransformer) -> List[str]:
    """
    Extracts transformed feature column names from fitted ColumnTransformer.
    """
    feature_names = []

    for name, trans, cols in preprocessor.transformers_:
        if name == "num":
            feature_names.extend(cols)
        elif name == "cat":
            if hasattr(trans, "get_feature_names_out"):
                cats = trans.get_feature_names_out(cols)
                feature_names.extend(cats)
            else:
                feature_names.extend(cols)

    return feature_names
