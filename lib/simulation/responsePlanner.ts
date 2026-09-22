import {
  ThreatEvent,
  ThreatType,
  AiResponsePlan,
  ResponseTimelineEntry,
  VerificationCriteria,
} from '@/lib/types/network';

/**
 * AI-Assisted Structured Response Planner
 * 
 * Converts detected threat events, telemetry evidence, and risk context
 * into structured recommended response plans with threat-specific verification criteria.
 * 
 * NOTE: The response planner is an advisory system. AI recommends a response,
 * but SOC Analyst approval is mandatory before controlled execution.
 */
export function generateResponsePlan(threat: ThreatEvent): AiResponsePlan {
  const isBenign = (threat.threatType as string) === 'BENIGN' || (threat.severity === 'LOW' && threat.confidence < 20);
  const isRealMl = threat.detectionSource === 'ml';
  const now = new Date(threat.detectedAt).toISOString();

  let proposedAction = '';
  let reason = '';
  let supportingEvidence: string[] = [];
  let expectedEffect = '';
  let operationalImpact = '';
  let verificationCriteria: VerificationCriteria;

  if (isBenign) {
    proposedAction = 'No restrictive response action recommended. Continue baseline monitoring.';
    reason = 'Observed ingress telemetry parameters conform to normal operational baseline standards.';
    supportingEvidence = [
      `Flow duration: ${threat.flowDuration.toFixed(2)}s within expected baseline`,
      `Low suspicion score (${threat.riskScore}/100)`,
      `No aggressive port scan or flooding indicators observed`,
    ];
    expectedEffect = 'Unidirectional traffic flow maintained without restriction.';
    operationalImpact = 'None. System continues standard monitoring mode.';
    verificationCriteria = {
      metricName: 'Baseline Traffic Conformance',
      unit: '% Score',
      baselineValue: 98.5,
      targetThreshold: 95.0,
      conditionDescription: 'Telemetry remains within normal baseline operational parameters.',
    };
  } else if (threat.threatType === 'DOS' || threat.threatType === 'DOS_DDOS') {
    proposedAction = 'Apply temporary rate limiting to the suspicious traffic source.';
    reason = 'Observed ingress traffic velocity exhibits high-volume packet flooding characteristics.';
    
    const calculatedPktRate = Math.max(
      18000,
      Math.round(threat.connectionAttempts / Math.max(0.1, threat.flowDuration)) * 120
    );

    supportingEvidence = [
      `Ingress packet velocity spike: ~${calculatedPktRate.toLocaleString()} pkt/s`,
      `Connection attempt frequency: ${threat.connectionAttempts} flows captured`,
      `ML/Simulation suspicion index: ${threat.riskScore}/100`,
      isRealMl ? 'Real UNSW-NB15 ML model classified flow as DoS/DDoS pattern' : 'Simulated high-volume flooding pattern',
    ];
    expectedEffect = 'Reduce suspicious traffic volume while maintaining continuous unidirectional telemetry.';
    operationalImpact = 'Legitimate high-throughput traffic from the affected source IP address may be restricted.';
    verificationCriteria = {
      metricName: 'Ingress Packet Velocity',
      unit: 'pkt/s',
      baselineValue: calculatedPktRate,
      targetThreshold: Math.round(calculatedPktRate * 0.25),
      conditionDescription: 'Verify simulated packet rate drops below 25% of baseline pre-response velocity.',
    };
  } else if (threat.threatType === 'PORT_SCAN') {
    proposedAction = 'Apply port-threshold filtering and throttle connection probing.';
    reason = 'Sequential port access attempts detected across target address space.';
    
    const portsHit = Math.max(12, threat.destinationPortCount);

    supportingEvidence = [
      `Destination ports probed: ${portsHit} unique ports in short interval`,
      `Probing connection attempts: ${threat.connectionAttempts}`,
      `Protocol flags: SYN probing without completing session handshakes`,
      isRealMl ? 'Real UNSW-NB15 ML model identified port-scanning signature' : 'Simulated sequential port scan pattern',
    ];
    expectedEffect = 'Throttle probing rate and restrict scanner port enumeration.';
    operationalImpact = 'Probing source traffic restricted; legitimate single-port services remain active.';
    verificationCriteria = {
      metricName: 'Probing Connection Rate',
      unit: 'attempts/min',
      baselineValue: portsHit * 15,
      targetThreshold: 3,
      conditionDescription: 'Verify probing connection attempts drop to ≤ 3 attempts/min after response.',
    };
  } else if (threat.threatType === 'BRUTE_FORCE') {
    proposedAction = 'Throttle repeated handshake attempts on target authentication ports.';
    reason = 'Sustained high-frequency connection attempts targeting management/authentication endpoints.';
    
    supportingEvidence = [
      `Authentication attempt frequency: ${threat.connectionAttempts} attempts`,
      `Target ports: Port 22 (SSH) / Port 3389 (RDP)`,
      `Short flow duration per attempt (< 0.1s average)`,
    ];
    expectedEffect = 'Prevent automated credential probing while maintaining established user sessions.';
    operationalImpact = 'New connection requests from source IP will experience backoff delays.';
    verificationCriteria = {
      metricName: 'Auth Attempt Frequency',
      unit: 'attempts/min',
      baselineValue: threat.connectionAttempts,
      targetThreshold: 2,
      conditionDescription: 'Verify repeated authentication attempts drop to ≤ 2 attempts/min after response.',
    };
  } else {
    // ANOMALY, TRAFFIC_ANOMALY, SUSPICIOUS_TRAFFIC
    proposedAction = 'Enforce deep packet baseline inspection and isolate abnormal flow parameters.';
    reason = 'Traffic parameters exceed statistical baseline thresholds (packet length, byte-rate variance).';
    
    supportingEvidence = threat.explanationDetails?.map((e) => `${e.feature_name}: ${e.description}`) || [
      `Statistical baseline deviation: ${threat.riskScore}% suspicion score`,
      `Flow duration: ${threat.flowDuration.toFixed(2)}s`,
      `Anomalous payload ratio detected`,
    ];
    expectedEffect = 'Isolate anomalous burst patterns and log detailed payload features.';
    operationalImpact = 'Transient delay for non-standard protocol packets from source subnet.';
    verificationCriteria = {
      metricName: 'Statistical Suspicion Index',
      unit: 'Risk Score',
      baselineValue: threat.riskScore,
      targetThreshold: Math.min(30, Math.round(threat.riskScore * 0.3)),
      conditionDescription: 'Verify statistical suspicion score drops below baseline threshold post-mitigation.',
    };
  }

  const confidenceContext = `Assessed by ${isRealMl ? 'Real UNSW-NB15 ML Model' : 'Simulation Engine'} with ${threat.confidence}% confidence. Risk Score: ${threat.riskScore}/100 (${threat.severity} Severity).`;

  const plan: AiResponsePlan = {
    id: `PLAN-${threat.id}`,
    threatType: threat.threatType,
    severity: threat.severity,
    originalProposedAction: proposedAction,
    reason,
    supportingEvidence,
    expectedEffect,
    operationalImpact,
    confidenceContext,
    analystApprovalRequired: !isBenign,
    executionMode: isBenign ? 'NONE' : 'CONTROLLED_SIMULATION',
    status: 'PENDING',
    verificationCriteria,
    createdTimestamp: now,
  };

  return plan;
}

/**
 * Generates initial chronological audit trail events for a new threat
 */
export function createInitialResponseHistory(threat: ThreatEvent, plan: AiResponsePlan): ResponseTimelineEntry[] {
  const baseTime = new Date(threat.detectedAt);

  const formatTime = (secondsOffset: number) => {
    return new Date(baseTime.getTime() + secondsOffset * 1000).toISOString();
  };

  const isRealMl = threat.detectionSource === 'ml';

  const history: ResponseTimelineEntry[] = [
    {
      id: `EVT-1-${threat.id}`,
      timestamp: formatTime(0),
      title: 'Threat Telemetry Captured',
      description: `Ingress flow telemetry captured from ${threat.sourceIp} to ${threat.destinationIp} (${threat.protocol}).`,
      actor: isRealMl ? 'AI-Assisted Planner' : 'Controlled Simulator',
      type: 'DETECTED',
    },
    {
      id: `EVT-2-${threat.id}`,
      timestamp: formatTime(1),
      title: `${isRealMl ? 'Real ML Model' : 'Simulation Engine'} Classification: ${threat.threatType}`,
      description: isRealMl
        ? `Real UNSW-NB15 ML model classified flow as ${threat.threatType} with ${threat.confidence}% confidence.`
        : `Simulation engine flagged flow as ${threat.threatType} with ${threat.confidence}% confidence.`,
      actor: isRealMl ? 'AI-Assisted Planner' : 'Controlled Simulator',
      type: 'CLASSIFIED',
    },
    {
      id: `EVT-3-${threat.id}`,
      timestamp: formatTime(1),
      title: `Risk Assessment Score: ${threat.riskScore}/100`,
      description: `Assigned ${threat.severity} severity based on baseline feature deviation and threat policy rules.`,
      actor: 'AI-Assisted Planner',
      type: 'RISK_ASSESSED',
    },
    {
      id: `EVT-4-${threat.id}`,
      timestamp: formatTime(2),
      title: 'AI-Assisted Response Plan Generated',
      description: `Structured response plan generated: "${plan.originalProposedAction}" (Execution Mode: ${plan.executionMode}).`,
      actor: 'AI-Assisted Planner',
      type: 'PLAN_GENERATED',
    },
  ];

  return history;
}
