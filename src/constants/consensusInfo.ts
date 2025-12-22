import type { ConsensusMode, ConsensusInfo, RegionInfo, ConsensusCategory } from "@/types/consensus";

// ==========================================
// CONSENSUS MODE CATEGORIES
// ==========================================
export const MODE_CATEGORIES: Record<ConsensusMode, ConsensusCategory> = {
  pow: "layer1",
  pos: "layer1",
  raft: "layer1",
  qbft: "layer1",
  optimistic: "layer2",
  zk: "layer2",
  ripple: "alternative",
};

export const CATEGORY_INFO: Record<ConsensusCategory, { name: string; color: string }> = {
  layer1: { name: "Layer 1", color: "#22c55e" },
  layer2: { name: "Layer 2", color: "#f97316" },
  alternative: { name: "Alternative", color: "#8b5cf6" },
};

// ==========================================
// CONSENSUS MECHANISM INFORMATION
// ==========================================
export const CONSENSUS_INFO: Record<ConsensusMode, ConsensusInfo> = {
  pow: {
    name: "Proof of Work",
    chain: "Bitcoin",
    icon: "₿",
    subtitle: "Nakamoto Consensus",
    color: "#f7931a",
    description: [
      "⛏️ SHA-256 해시 → Target 이하 찾기",
      "🌐 네트워크 지연(~10s)으로 Fork 발생",
      "⚡ Most Accumulated Work 체인 = Main",
      "💀 Orphan Block → Coinbase TX 무효",
      "📊 6 confirmations ≈ 0.02% reorg 확률",
    ],
  },
  pos: {
    name: "Proof of Stake",
    chain: "Ethereum",
    icon: "◆",
    subtitle: "Casper FFG + LMD GHOST",
    color: "#627eea",
    description: [
      "🎰 Stake 비례 확률로 Proposer 선정",
      "⏱️ 1 Slot = 12s, 1 Epoch = 32 slots",
      "🗳️ Committee가 Attestation 투표",
      "✅ 2/3+ 투표 → Justified → Finalized",
      "🔒 Revert 시 1/3 stake Slashing ($26B+)",
    ],
  },
  raft: {
    name: "RAFT Consensus",
    chain: "Hyperledger Fabric",
    icon: "🔷",
    subtitle: "CFT (Crash Fault Tolerant)",
    color: "#2c9ed4",
    description: [
      "👑 Leader Election (Term 기반)",
      "📝 Log Entry Append → Follower 복제",
      "✅ 과반수(>50%) ACK → Committed",
      "💓 Heartbeat 150ms로 Leader 확인",
      "⚠️ Byzantine(악의적) 노드 불허",
    ],
  },
  qbft: {
    name: "IBFT 2.0",
    chain: "Hyperledger Besu",
    icon: "🛡️",
    subtitle: "BFT (Byzantine Fault Tolerant)",
    color: "#3c3c3d",
    description: [
      "🔄 PRE-PREPARE → PREPARE → COMMIT",
      "📐 N ≥ 3f+1, Quorum = 2f+1",
      "🛡️ 33% Byzantine 노드까지 허용",
      "⚡ Commit 즉시 Finality (No Fork)",
      "🔁 Round-Robin Proposer 로테이션",
    ],
  },
  // ==========================================
  // LAYER 2 SOLUTIONS
  // ==========================================
  optimistic: {
    name: "Optimistic Rollup",
    chain: "Arbitrum/Optimism",
    icon: "🔴",
    subtitle: "Fraud Proof Based",
    color: "#ff0420",
    description: [
      "📦 L2에서 TX 배치(Batch) 처리",
      "📤 State Root를 L1에 제출",
      "⏳ 7일 Challenge Period (Fraud Proof)",
      "🚨 잘못된 상태 → 누구나 챌린지 가능",
      "✅ 챌린지 없으면 Finalized",
    ],
  },
  zk: {
    name: "ZK Rollup",
    chain: "zkSync/StarkNet",
    icon: "🟣",
    subtitle: "Validity Proof Based",
    color: "#8b5cf6",
    description: [
      "📦 L2에서 TX 배치 처리",
      "🔐 ZK-SNARK/STARK 증명 생성",
      "📤 증명 + State Root를 L1에 제출",
      "✅ 수학적 검증 → 즉시 Finality",
      "⚡ Fraud Proof 대기 불필요",
    ],
  },
  // ==========================================
  // ALTERNATIVE CONSENSUS
  // ==========================================
  ripple: {
    name: "Ripple Protocol",
    chain: "XRP Ledger",
    icon: "💧",
    subtitle: "RPCA (Federated BFT)",
    color: "#23292f",
    description: [
      "📋 UNL (Unique Node List) 기반",
      "🗳️ 각 노드가 신뢰 목록 유지",
      "✅ 80%+ 합의 → 블록 확정",
      "⚡ 3-5초 내 Finality",
      "🏦 은행/결제 네트워크 최적화",
    ],
  },
};

// ==========================================
// POW REGIONS (Mining Pools)
// ==========================================
export const REGIONS: RegionInfo[] = [
  { name: "🌎 North America", color: "#22c55e", yOffset: 1.8 },
  { name: "🌍 Europe", color: "#3b82f6", yOffset: 0 },
  { name: "🌏 Asia", color: "#f59e0b", yOffset: -1.8 },
];

// ==========================================
// BLOCK STATUS COLORS
// ==========================================
export const BLOCK_STATUS_COLORS: Record<string, string> = {
  mining: "#fbbf24",
  mined: "#6b7280",
  confirmed: "#22d3ee",
  finalized: "#a855f7",
  orphaned: "#ef4444",
  proposed: "#3b82f6",
  justified: "#8b5cf6",
  committed: "#22c55e",
  // Layer 2 statuses
  batched: "#f97316",
  submitted: "#3b82f6",
  challenged: "#ef4444",
  proven: "#8b5cf6",
  validated: "#22c55e",
};

// ==========================================
// VALIDATOR ROLE COLORS
// ==========================================
export const ROLE_COLORS: Record<string, string> = {
  leader: "#f7931a",
  proposer: "#627eea",
  follower: "#2c9ed4",
  validator: "#8b5cf6",
  miner: "#f7931a",
  // Layer 2 & Alternative roles
  sequencer: "#ff0420",
  prover: "#8b5cf6",
  unlNode: "#23292f",
};

// ==========================================
// VOTE TYPE COLORS
// ==========================================
export const VOTE_COLORS: Record<string, string | null> = {
  none: null,
  prepare: "#3b82f6",
  commit: "#22c55e",
  attest: "#8b5cf6",
};

// ==========================================
// SIMULATION CONSTANTS
// ==========================================
export const SIMULATION_INTERVAL_MS = 350;
export const QBFT_INTERVAL_MS = 400;
export const COMPLETE_DELAY_MS = 2500;

// ==========================================
// POS CONSTANTS
// ==========================================
export const DEFAULT_STAKES = [32, 64, 48, 96];
export const SLOTS_PER_EPOCH = 32;
export const SLOT_DURATION_SECONDS = 12;
