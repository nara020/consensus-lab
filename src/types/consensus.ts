import * as THREE from "three";

// ==========================================
// CONSENSUS MODE TYPES
// ==========================================
export type ConsensusMode = "pow" | "pos" | "raft" | "qbft" | "optimistic" | "zk" | "ripple";
export type ConsensusCategory = "layer1" | "layer2" | "alternative";
export type Phase = "idle" | "running" | "complete";

// ==========================================
// BLOCK TYPES
// ==========================================
export type BlockStatus =
  | "mining"
  | "mined"
  | "confirmed"
  | "finalized"
  | "orphaned"
  | "proposed"
  | "justified"
  | "committed"
  | "batched"      // Layer 2: transactions batched
  | "submitted"    // Layer 2: submitted to L1
  | "challenged"   // Optimistic: in challenge period
  | "proven"       // ZK: proof generated
  | "validated";   // Ripple: validated by UNL

export interface ChainBlock {
  id: string;
  position: THREE.Vector3;
  status: BlockStatus;
  blockNumber: number;
  branch: number;
  txCount?: number;
}

// ==========================================
// VALIDATOR/NODE TYPES
// ==========================================
export type ValidatorRole = "leader" | "follower" | "proposer" | "validator" | "miner" | "sequencer" | "prover" | "unlNode";
export type VoteType = "none" | "prepare" | "commit" | "attest";

export interface Validator {
  id: number;
  position: THREE.Vector3;
  role: ValidatorRole;
  vote: VoteType;
  active: boolean;
  name?: string;
}

// ==========================================
// TRANSACTION TYPES
// ==========================================
export type TransactionStatus = "pending" | "processing" | "included";

export interface Transaction {
  id: string;
  position: THREE.Vector3;
  status: TransactionStatus;
  target?: THREE.Vector3;
}

// ==========================================
// CONSENSUS INFO TYPES
// ==========================================
export interface ConsensusInfo {
  name: string;
  chain: string;
  icon: string;
  subtitle: string;
  description: string[];
  color: string;
}

// ==========================================
// POW SPECIFIC TYPES
// ==========================================
export interface MiningData {
  nonce: number[];
  hash: string[];
  mining: boolean[];
  found: number; // which miner found it (-1 = none)
}

export interface RegionInfo {
  name: string;
  color: string;
  yOffset: number;
}

// ==========================================
// POS SPECIFIC TYPES
// ==========================================
export interface StakeData {
  stakes: number[];
  totalStake: number;
  selectedProposer: number;
}

// ==========================================
// SIMULATION STATE TYPES
// ==========================================
export interface SimulationState {
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  currentStep: number;
  stepDescription: string;
}

export interface PoWState extends SimulationState {
  forkLengths: number[];
  winningBranch: number;
  miningData: MiningData;
}

export interface PoSState extends SimulationState {
  currentSlot: number;
  currentEpoch: number;
  attestations: number;
  stakeData: StakeData;
}

export interface RaftState extends SimulationState {
  logEntries: number;
  replicatedCount: number;
}

export interface QbftState extends SimulationState {
  currentBlock: ChainBlock | null;
  prepareCount: number;
  commitCount: number;
}

// ==========================================
// LAYER 2 SPECIFIC TYPES
// ==========================================
export interface OptimisticState extends SimulationState {
  l2Blocks: ChainBlock[];
  l1Blocks: ChainBlock[];
  challengePeriod: number; // 7 days in real, simulated
  fraudProofSubmitted: boolean;
  sequencerAddress: string;
}

export interface ZkState extends SimulationState {
  l2Blocks: ChainBlock[];
  l1Blocks: ChainBlock[];
  proofProgress: number; // 0-100%
  batchSize: number;
  proofGenerated: boolean;
}

// ==========================================
// RIPPLE SPECIFIC TYPES
// ==========================================
export interface RippleState extends SimulationState {
  unlNodes: Validator[]; // Unique Node List
  agreementPercent: number; // Need 80%+
  roundNumber: number;
  proposalCount: number;
}

// ==========================================
// AUDIO HOOK TYPES
// ==========================================
export interface AudioActions {
  playTx: () => void;
  playMine: () => void;
  playConfirm: () => void;
  playOrphan: () => void;
  playVote: () => void;
  playFinalize: () => void;
}
