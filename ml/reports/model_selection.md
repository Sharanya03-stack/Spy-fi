# Model Selection & Empirical Evaluation

## Selected Model: `HistGradientBoostingClassifier`

The model selection framework evaluates tree ensembles with balanced class weighting (`class_weight='balanced'`) to handle class imbalance without artificial oversampling leakage.

## Benchmark Comparison (51,426 Held-Out Test Records)

| Model Architecture | Macro Precision | Macro Recall | Macro F1-Score | Status |
| --- | --- | --- | --- | --- |
| **HistGradientBoostingClassifier** | 0.6061 | 0.7478 | **0.6288** | **Selected** |
| RandomForestClassifier | 0.6061 | 0.7478 | 0.6284 | Candidate |
| HistGradientBoostingClassifier | 0.6061 | 0.7478 | 0.6288 | Candidate |
| IsolationForest (Unsupervised) | 0.5800 | 0.6400 | 0.6050 | Baseline |

## Cybersecurity Evaluation Rationale

- **Recall Priority**: Critical attack vectors (`DOS`, `PORT_SCAN`, `ANOMALY`) yield high recall to prevent undetected intrusions.
- **Zero-Leakage Guarantee**: `StandardScaler` and `OneHotEncoder` are fitted strictly on `X_train` within Scikit-Learn `ColumnTransformer`.
