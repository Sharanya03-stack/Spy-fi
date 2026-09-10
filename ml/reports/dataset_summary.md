# Dataset Summary & Telemetry Disclosures

This research ML pipeline evaluates unidirectionally captured IP network telemetry.

> **Dataset Provenance & Disclosures**:
> - National operational defense datasets (e.g. NTRO telemetry) are classified and non-public.
> - Official model evaluation is performed on **257,673 authentic flow records** from the **UNSW-NB15 Benchmark Dataset** (Australian Centre for Cyber Security / UNSW Canberra).
> - Public dataset records are used for research prototype evaluation and do not represent NTRO operational data.
> - Synthetic traffic is not used as evidence of model performance.

## Dataset Characteristics (UNSW-NB15)

- **Total Flow Records**: 257,673
- **UniGuard Taxonomy Distribution**:
  - `BENIGN`: 93,000 records (36.09%) — Normal traffic
  - `ANOMALY`: 134,333 records (52.13%) — Generic, Exploits, Fuzzers, Analysis, Backdoor, Shellcode, Worms
  - `DOS`: 16,353 records (6.35%) — Denial of Service volume floods
  - `PORT_SCAN`: 13,987 records (5.43%) — Reconnaissance & port probes

## Feature Space (Native UNSW-NB15 Clean Mapping)

- `flow_duration`: Stream duration in seconds (`dur`)
- `packet_count`: Ingress packet volume sent (`spkts`)
- `byte_count`: Ingress byte payload transmitted (`sbytes`)
- `packets_per_second`: Ingress packet velocity (`rate`)
- `bytes_per_second`: Source bandwidth throughput in B/s (`sload / 8`)
- `avg_packet_length`: Mean source packet payload size (`smean`)
- `destination_port`: Destination port (`dsport` if present, else 0)
- `source_port`: Originating port (`sport` if present, else 0)
- `protocol`: Transport layer protocol (`TCP`, `UDP`, `ICMP`)
