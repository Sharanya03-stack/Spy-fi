"""
UniGuard AI - Pydantic Data Schemas for Inference Validation
Smart India Hackathon 2026 Problem Statement 145
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, field_validator, model_validator


class NetworkFlowPayload(BaseModel):
    """
    Standardized payload representation of an IP network flow record.
    Used as input interface for threat prediction models.
    """

    source_ip: Optional[str] = Field(default="192.168.1.100", description="Source IP Address")
    destination_ip: Optional[str] = Field(default="10.0.0.50", description="Destination IP Address")
    source_port: int = Field(default=54321, ge=0, le=65535, description="Source Port")
    destination_port: int = Field(default=443, ge=0, le=65535, description="Destination Port")
    protocol: str = Field(default="TCP", description="IP Protocol (TCP, UDP, ICMP)")
    flow_duration: float = Field(default=10.0, ge=0.0, description="Flow duration in seconds")
    packet_count: int = Field(default=20, ge=0, description="Total packet count in flow")
    byte_count: int = Field(default=5000, ge=0, description="Total byte count in flow")
    packets_per_second: Optional[float] = Field(default=None, ge=0.0, description="Packets per second rate")
    bytes_per_second: Optional[float] = Field(default=None, ge=0.0, description="Bytes per second rate")
    avg_packet_length: Optional[float] = Field(default=None, ge=0.0, description="Average packet size in bytes")

    @field_validator("protocol")
    @classmethod
    def validate_protocol(cls, v: str) -> str:
        upper_v = v.upper()
        if upper_v not in ["TCP", "UDP", "ICMP"]:
            raise ValueError(f"Unsupported protocol: {v}. Must be TCP, UDP, or ICMP.")
        return upper_v

    @model_validator(mode="after")
    def compute_derived_metrics(self) -> "NetworkFlowPayload":
        duration = self.flow_duration if self.flow_duration > 0 else 0.001
        packets = self.packet_count
        bytes_cnt = self.byte_count

        if self.packets_per_second is None:
            self.packets_per_second = float(packets) / duration
        if self.bytes_per_second is None:
            self.bytes_per_second = float(bytes_cnt) / duration
        if self.avg_packet_length is None:
            self.avg_packet_length = float(bytes_cnt) / (packets if packets > 0 else 1)

        return self


class FeatureExplanation(BaseModel):
    """
    Explainable AI (XAI) feature breakdown comparing observed telemetry to normal baseline.
    """

    feature_name: str = Field(description="Name of network telemetry feature")
    observed_value: float = Field(description="Observed value in target flow")
    baseline_value: float = Field(description="Normal baseline mean value")
    deviation_pct: float = Field(description="Percentage deviation from baseline (+/- %)")
    impact: str = Field(description="Impact classification: HIGH_RISK, ELEVATED, NORMAL")
    description: str = Field(description="Human-readable SOC analysis note")


class InferenceResponse(BaseModel):
    """
    Standardized inference response schema adhering strictly to UniGuard AI SOC requirements.
    """

    prediction: str = Field(description="Classification result: BENIGN or MALICIOUS")
    threat_type: str = Field(description="Specific threat category: BENIGN, PORT_SCAN, DOS, ANOMALY")
    confidence: float = Field(ge=0.0, le=100.0, description="Model prediction confidence percentage")
    anomaly_score: float = Field(ge=0.0, le=100.0, description="Calibrated anomaly score (0 to 100)")
    severity: str = Field(description="Risk severity level: LOW, MEDIUM, HIGH, CRITICAL")
    explanation: List[FeatureExplanation] = Field(description="XAI feature deviation analysis list")
    recommended_action: List[str] = Field(description="Actionable mitigation recommendations for SOC analyst")
    execution_time_ms: float = Field(description="Inference pipeline execution latency in milliseconds")
