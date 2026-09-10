"""
UniGuard AI - Explainable AI (XAI) Feature Deviation Engine
Smart India Hackathon 2026 Problem Statement 145

Generates feature-vs-baseline XAI breakdowns and natural language analyst explanations based on training data baselines.
"""

from typing import List, Dict, Any
import numpy as np

from src.config import NUMERIC_FEATURES
from src.schemas import FeatureExplanation, NetworkFlowPayload


class FeatureDeviationExplainer:
    """
    Computes explainable feature deviations against BENIGN baseline statistics derived from training data.
    """

    def __init__(self, baselines: Dict[str, Dict[str, float]] = None):
        self.baselines = baselines if baselines else {}

    def explain_flow(self, payload: NetworkFlowPayload) -> List[FeatureExplanation]:
        """
        Calculates feature deviations and returns ranked top anomalous features.
        """
        explanations = []

        flow_data = {
            "flow_duration": payload.flow_duration,
            "packet_count": float(payload.packet_count),
            "byte_count": float(payload.byte_count),
            "packets_per_second": payload.packets_per_second,
            "bytes_per_second": payload.bytes_per_second,
            "avg_packet_length": payload.avg_packet_length,
            "destination_port": float(payload.destination_port),
            "source_port": float(payload.source_port),
        }

        for feat_name, obs_val in flow_data.items():
            if feat_name not in self.baselines or obs_val is None:
                continue

            base = self.baselines[feat_name]
            base_mean = base["mean"]
            base_std = base["std"] if base["std"] > 1e-4 else 1.0

            # Calculate z-score and % deviation
            diff = obs_val - base_mean
            dev_pct = (diff / (base_mean if abs(base_mean) > 1e-4 else 1.0)) * 100.0
            z_score = abs(diff) / base_std

            # Determine impact
            if z_score >= 3.0:
                impact = "HIGH_RISK"
            elif z_score >= 1.5:
                impact = "ELEVATED"
            else:
                impact = "NORMAL"

            # Create SOC analyst description
            desc = self._format_description(feat_name, obs_val, base_mean, dev_pct, z_score)

            explanations.append(
                FeatureExplanation(
                    feature_name=feat_name,
                    observed_value=round(float(obs_val), 2),
                    baseline_value=round(float(base_mean), 2),
                    deviation_pct=round(float(dev_pct), 1),
                    impact=impact,
                    description=desc,
                )
            )

        # Sort explanations by absolute z-score / deviation severity
        explanations.sort(
            key=lambda x: (
                2 if x.impact == "HIGH_RISK" else (1 if x.impact == "ELEVATED" else 0),
                abs(x.deviation_pct),
            ),
            reverse=True,
        )

        return explanations[:4]

    def _format_description(
        self, feat_name: str, obs_val: float, base_mean: float, dev_pct: float, z_score: float
    ) -> str:
        sign = "+" if dev_pct >= 0 else ""

        if feat_name == "packets_per_second":
            return f"Packet rate ({obs_val:.1f} pps) is {sign}{dev_pct:.1f}% vs training baseline ({base_mean:.1f} pps), indicating high-frequency stream burst."
        elif feat_name == "bytes_per_second":
            return f"Bandwidth throughput ({obs_val:.1f} B/s) is {sign}{dev_pct:.1f}% vs normal benign training baseline ({base_mean:.1f} B/s)."
        elif feat_name == "avg_packet_length":
            return f"Average packet payload ({obs_val:.1f} bytes) deviates by {sign}{dev_pct:.1f}% from standard benign traffic size ({base_mean:.1f} bytes)."
        elif feat_name == "flow_duration":
            return f"Flow duration ({obs_val:.2f}s) is {sign}{dev_pct:.1f}% relative to standard flow training baseline ({base_mean:.2f}s)."
        elif feat_name == "destination_port":
            return f"Target destination port ({int(obs_val)}) exhibits non-standard port activity profile."
        else:
            return f"Feature '{feat_name}' observed value ({obs_val:.2f}) deviates by {sign}{dev_pct:.1f}% from training baseline profile."
