"use client";

import { useReducer, useMemo } from "react";
import type {
  ChainBlock,
  Validator,
  Transaction,
  MiningData,
  StakeData,
  Phase,
  DagVertex,
  RandaoData,
} from "@/types/consensus";

// ==========================================
// STATE TYPE
// ==========================================
export interface SimulationState {
  phase: Phase;
  currentStep: number;
  stepDescription: string;

  // Common state
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];

  // PoW specific
  forkLengths: number[];
  winningBranch: number;
  miningData: MiningData;

  // PoS specific
  currentSlot: number;
  currentEpoch: number;
  attestations: number;
  stakeData: StakeData;
  randaoData: RandaoData;

  // RAFT specific
  logEntries: number;
  replicatedCount: number;

  // QBFT specific
  currentBlock: ChainBlock | null;
  prepareCount: number;
  commitCount: number;
  byzantineNode: number; // -1 = none, otherwise validator id

  // Layer 2 (Optimistic/ZK) specific
  l2Blocks: ChainBlock[];
  l1Blocks: ChainBlock[];
  challengePeriod: number;
  fraudProofSubmitted: boolean;
  proofProgress: number;
  batchSize: number;
  proofGenerated: boolean;

  // Ripple specific
  agreementPercent: number;
  roundNumber: number;

  // Tendermint specific
  tendermintRound: number;
  tendermintHeight: number;
  prevoteCount: number;
  precommitCount: number;

  // Avalanche specific
  avalancheConfidence: number[];
  avalancheQueryRound: number;
  avalancheDecided: boolean[];
  networkConfidence: number;

  // Sui/Narwhal specific
  dagVertices: DagVertex[];
  dagRound: number;
  suiCertificates: number;
  anchorCommitted: boolean;
}

// ==========================================
// ACTION TYPES
// ==========================================
type SimulationAction =
  | { type: "SET_PHASE"; payload: Phase }
  | { type: "SET_STEP"; payload: { step: number; description: string } }
  | { type: "SET_BLOCKS"; payload: ChainBlock[] }
  | { type: "UPDATE_BLOCKS"; payload: (blocks: ChainBlock[]) => ChainBlock[] }
  | { type: "SET_VALIDATORS"; payload: Validator[] }
  | { type: "UPDATE_VALIDATORS"; payload: (validators: Validator[]) => Validator[] }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_FORK_LENGTHS"; payload: number[] }
  | { type: "SET_WINNING_BRANCH"; payload: number }
  | { type: "SET_MINING_DATA"; payload: MiningData }
  | { type: "UPDATE_MINING_DATA"; payload: Partial<MiningData> }
  | { type: "SET_CURRENT_SLOT"; payload: number }
  | { type: "SET_CURRENT_EPOCH"; payload: number }
  | { type: "SET_ATTESTATIONS"; payload: number }
  | { type: "SET_STAKE_DATA"; payload: StakeData }
  | { type: "UPDATE_STAKE_DATA"; payload: (data: StakeData) => StakeData }
  | { type: "SET_RANDAO_DATA"; payload: RandaoData }
  | { type: "SET_LOG_ENTRIES"; payload: number }
  | { type: "SET_REPLICATED_COUNT"; payload: number }
  | { type: "SET_CURRENT_BLOCK"; payload: ChainBlock | null }
  | { type: "SET_PREPARE_COUNT"; payload: number }
  | { type: "SET_COMMIT_COUNT"; payload: number }
  | { type: "SET_BYZANTINE_NODE"; payload: number }
  // Layer 2 actions
  | { type: "SET_L2_BLOCKS"; payload: ChainBlock[] }
  | { type: "SET_L1_BLOCKS"; payload: ChainBlock[] }
  | { type: "SET_CHALLENGE_PERIOD"; payload: number }
  | { type: "SET_FRAUD_PROOF_SUBMITTED"; payload: boolean }
  | { type: "SET_PROOF_PROGRESS"; payload: number }
  | { type: "SET_BATCH_SIZE"; payload: number }
  | { type: "SET_PROOF_GENERATED"; payload: boolean }
  // Ripple actions
  | { type: "SET_AGREEMENT_PERCENT"; payload: number }
  | { type: "SET_ROUND_NUMBER"; payload: number }
  // Tendermint actions
  | { type: "SET_TENDERMINT_ROUND"; payload: number }
  | { type: "SET_TENDERMINT_HEIGHT"; payload: number }
  | { type: "SET_PREVOTE_COUNT"; payload: number }
  | { type: "SET_PRECOMMIT_COUNT"; payload: number }
  // Avalanche actions
  | { type: "SET_AVALANCHE_CONFIDENCE"; payload: number[] }
  | { type: "SET_AVALANCHE_QUERY_ROUND"; payload: number }
  | { type: "SET_AVALANCHE_DECIDED"; payload: boolean[] }
  | { type: "SET_NETWORK_CONFIDENCE"; payload: number }
  // Sui/Narwhal actions
  | { type: "SET_DAG_VERTICES"; payload: DagVertex[] }
  | { type: "SET_DAG_ROUND"; payload: number }
  | { type: "SET_SUI_CERTIFICATES"; payload: number }
  | { type: "SET_ANCHOR_COMMITTED"; payload: boolean }
  | { type: "RESET" };

// ==========================================
// INITIAL STATE
// ==========================================
const initialState: SimulationState = {
  phase: "idle",
  currentStep: 0,
  stepDescription: "",
  blocks: [],
  validators: [],
  transactions: [],
  forkLengths: [0, 0, 0],
  winningBranch: -1,
  miningData: {
    nonce: [0, 0, 0],
    hash: ["", "", ""],
    mining: [false, false, false],
    found: -1,
  },
  currentSlot: 0,
  currentEpoch: 0,
  attestations: 0,
  stakeData: {
    stakes: [32, 64, 48, 96],
    totalStake: 240,
    selectedProposer: -1,
  },
  randaoData: {
    currentSeed: "0x0000",
    revealedValues: [],
    mixedHash: "",
  },
  logEntries: 0,
  replicatedCount: 0,
  currentBlock: null,
  prepareCount: 0,
  commitCount: 0,
  byzantineNode: -1,
  // Layer 2
  l2Blocks: [],
  l1Blocks: [],
  challengePeriod: 0,
  fraudProofSubmitted: false,
  proofProgress: 0,
  batchSize: 0,
  proofGenerated: false,
  // Ripple
  agreementPercent: 0,
  roundNumber: 0,
  // Tendermint
  tendermintRound: 0,
  tendermintHeight: 0,
  prevoteCount: 0,
  precommitCount: 0,
  // Avalanche
  avalancheConfidence: [],
  avalancheQueryRound: 0,
  avalancheDecided: [],
  networkConfidence: 0,
  // Sui/Narwhal
  dagVertices: [],
  dagRound: 0,
  suiCertificates: 0,
  anchorCommitted: false,
};

// ==========================================
// REDUCER
// ==========================================
function simulationReducer(
  state: SimulationState,
  action: SimulationAction
): SimulationState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.payload };

    case "SET_STEP":
      return {
        ...state,
        currentStep: action.payload.step,
        stepDescription: action.payload.description,
      };

    case "SET_BLOCKS":
      return { ...state, blocks: action.payload };

    case "UPDATE_BLOCKS":
      return { ...state, blocks: action.payload(state.blocks) };

    case "SET_VALIDATORS":
      return { ...state, validators: action.payload };

    case "UPDATE_VALIDATORS":
      return { ...state, validators: action.payload(state.validators) };

    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };

    case "SET_FORK_LENGTHS":
      return { ...state, forkLengths: action.payload };

    case "SET_WINNING_BRANCH":
      return { ...state, winningBranch: action.payload };

    case "SET_MINING_DATA":
      return { ...state, miningData: action.payload };

    case "UPDATE_MINING_DATA":
      return {
        ...state,
        miningData: { ...state.miningData, ...action.payload },
      };

    case "SET_CURRENT_SLOT":
      return { ...state, currentSlot: action.payload };

    case "SET_CURRENT_EPOCH":
      return { ...state, currentEpoch: action.payload };

    case "SET_ATTESTATIONS":
      return { ...state, attestations: action.payload };

    case "SET_STAKE_DATA":
      return { ...state, stakeData: action.payload };

    case "UPDATE_STAKE_DATA":
      return { ...state, stakeData: action.payload(state.stakeData) };

    case "SET_RANDAO_DATA":
      return { ...state, randaoData: action.payload };

    case "SET_LOG_ENTRIES":
      return { ...state, logEntries: action.payload };

    case "SET_REPLICATED_COUNT":
      return { ...state, replicatedCount: action.payload };

    case "SET_CURRENT_BLOCK":
      return { ...state, currentBlock: action.payload };

    case "SET_PREPARE_COUNT":
      return { ...state, prepareCount: action.payload };

    case "SET_COMMIT_COUNT":
      return { ...state, commitCount: action.payload };

    case "SET_BYZANTINE_NODE":
      return { ...state, byzantineNode: action.payload };

    // Layer 2 cases
    case "SET_L2_BLOCKS":
      return { ...state, l2Blocks: action.payload };

    case "SET_L1_BLOCKS":
      return { ...state, l1Blocks: action.payload };

    case "SET_CHALLENGE_PERIOD":
      return { ...state, challengePeriod: action.payload };

    case "SET_FRAUD_PROOF_SUBMITTED":
      return { ...state, fraudProofSubmitted: action.payload };

    case "SET_PROOF_PROGRESS":
      return { ...state, proofProgress: action.payload };

    case "SET_BATCH_SIZE":
      return { ...state, batchSize: action.payload };

    case "SET_PROOF_GENERATED":
      return { ...state, proofGenerated: action.payload };

    // Ripple cases
    case "SET_AGREEMENT_PERCENT":
      return { ...state, agreementPercent: action.payload };

    case "SET_ROUND_NUMBER":
      return { ...state, roundNumber: action.payload };

    // Tendermint cases
    case "SET_TENDERMINT_ROUND":
      return { ...state, tendermintRound: action.payload };

    case "SET_TENDERMINT_HEIGHT":
      return { ...state, tendermintHeight: action.payload };

    case "SET_PREVOTE_COUNT":
      return { ...state, prevoteCount: action.payload };

    case "SET_PRECOMMIT_COUNT":
      return { ...state, precommitCount: action.payload };

    // Avalanche cases
    case "SET_AVALANCHE_CONFIDENCE":
      return { ...state, avalancheConfidence: action.payload };

    case "SET_AVALANCHE_QUERY_ROUND":
      return { ...state, avalancheQueryRound: action.payload };

    case "SET_AVALANCHE_DECIDED":
      return { ...state, avalancheDecided: action.payload };

    case "SET_NETWORK_CONFIDENCE":
      return { ...state, networkConfidence: action.payload };

    // Sui/Narwhal cases
    case "SET_DAG_VERTICES":
      return { ...state, dagVertices: action.payload };

    case "SET_DAG_ROUND":
      return { ...state, dagRound: action.payload };

    case "SET_SUI_CERTIFICATES":
      return { ...state, suiCertificates: action.payload };

    case "SET_ANCHOR_COMMITTED":
      return { ...state, anchorCommitted: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ==========================================
// HOOK
// ==========================================
export function useSimulationState() {
  const [state, dispatch] = useReducer(simulationReducer, initialState);

  // Action creators
  const actions = useMemo(
    () => ({
      setPhase: (phase: Phase) => dispatch({ type: "SET_PHASE", payload: phase }),

      setStep: (step: number, description: string) =>
        dispatch({ type: "SET_STEP", payload: { step, description } }),

      setBlocks: (blocks: ChainBlock[]) =>
        dispatch({ type: "SET_BLOCKS", payload: blocks }),

      updateBlocks: (updater: (blocks: ChainBlock[]) => ChainBlock[]) =>
        dispatch({ type: "UPDATE_BLOCKS", payload: updater }),

      setValidators: (validators: Validator[]) =>
        dispatch({ type: "SET_VALIDATORS", payload: validators }),

      updateValidators: (updater: (validators: Validator[]) => Validator[]) =>
        dispatch({ type: "UPDATE_VALIDATORS", payload: updater }),

      setTransactions: (transactions: Transaction[]) =>
        dispatch({ type: "SET_TRANSACTIONS", payload: transactions }),

      setForkLengths: (lengths: number[]) =>
        dispatch({ type: "SET_FORK_LENGTHS", payload: lengths }),

      setWinningBranch: (branch: number) =>
        dispatch({ type: "SET_WINNING_BRANCH", payload: branch }),

      setMiningData: (data: MiningData) =>
        dispatch({ type: "SET_MINING_DATA", payload: data }),

      updateMiningData: (data: Partial<MiningData>) =>
        dispatch({ type: "UPDATE_MINING_DATA", payload: data }),

      setCurrentSlot: (slot: number) =>
        dispatch({ type: "SET_CURRENT_SLOT", payload: slot }),

      setCurrentEpoch: (epoch: number) =>
        dispatch({ type: "SET_CURRENT_EPOCH", payload: epoch }),

      setAttestations: (count: number) =>
        dispatch({ type: "SET_ATTESTATIONS", payload: count }),

      setStakeData: (data: StakeData) =>
        dispatch({ type: "SET_STAKE_DATA", payload: data }),

      updateStakeData: (updater: (data: StakeData) => StakeData) =>
        dispatch({ type: "UPDATE_STAKE_DATA", payload: updater }),

      setRandaoData: (data: RandaoData) =>
        dispatch({ type: "SET_RANDAO_DATA", payload: data }),

      setLogEntries: (count: number) =>
        dispatch({ type: "SET_LOG_ENTRIES", payload: count }),

      setReplicatedCount: (count: number) =>
        dispatch({ type: "SET_REPLICATED_COUNT", payload: count }),

      setCurrentBlock: (block: ChainBlock | null) =>
        dispatch({ type: "SET_CURRENT_BLOCK", payload: block }),

      setPrepareCount: (count: number) =>
        dispatch({ type: "SET_PREPARE_COUNT", payload: count }),

      setCommitCount: (count: number) =>
        dispatch({ type: "SET_COMMIT_COUNT", payload: count }),

      setByzantineNode: (nodeId: number) =>
        dispatch({ type: "SET_BYZANTINE_NODE", payload: nodeId }),

      // Layer 2 actions
      setL2Blocks: (blocks: ChainBlock[]) =>
        dispatch({ type: "SET_L2_BLOCKS", payload: blocks }),

      setL1Blocks: (blocks: ChainBlock[]) =>
        dispatch({ type: "SET_L1_BLOCKS", payload: blocks }),

      setChallengePeriod: (days: number) =>
        dispatch({ type: "SET_CHALLENGE_PERIOD", payload: days }),

      setFraudProofSubmitted: (submitted: boolean) =>
        dispatch({ type: "SET_FRAUD_PROOF_SUBMITTED", payload: submitted }),

      setProofProgress: (progress: number) =>
        dispatch({ type: "SET_PROOF_PROGRESS", payload: progress }),

      setBatchSize: (size: number) =>
        dispatch({ type: "SET_BATCH_SIZE", payload: size }),

      setProofGenerated: (generated: boolean) =>
        dispatch({ type: "SET_PROOF_GENERATED", payload: generated }),

      // Ripple actions
      setAgreementPercent: (percent: number) =>
        dispatch({ type: "SET_AGREEMENT_PERCENT", payload: percent }),

      setRoundNumber: (round: number) =>
        dispatch({ type: "SET_ROUND_NUMBER", payload: round }),

      // Tendermint actions
      setTendermintRound: (round: number) =>
        dispatch({ type: "SET_TENDERMINT_ROUND", payload: round }),

      setTendermintHeight: (height: number) =>
        dispatch({ type: "SET_TENDERMINT_HEIGHT", payload: height }),

      setPrevoteCount: (count: number) =>
        dispatch({ type: "SET_PREVOTE_COUNT", payload: count }),

      setPrecommitCount: (count: number) =>
        dispatch({ type: "SET_PRECOMMIT_COUNT", payload: count }),

      // Avalanche actions
      setAvalancheConfidence: (confidence: number[]) =>
        dispatch({ type: "SET_AVALANCHE_CONFIDENCE", payload: confidence }),

      setAvalancheQueryRound: (round: number) =>
        dispatch({ type: "SET_AVALANCHE_QUERY_ROUND", payload: round }),

      setAvalancheDecided: (decided: boolean[]) =>
        dispatch({ type: "SET_AVALANCHE_DECIDED", payload: decided }),

      setNetworkConfidence: (confidence: number) =>
        dispatch({ type: "SET_NETWORK_CONFIDENCE", payload: confidence }),

      // Sui/Narwhal actions
      setDagVertices: (vertices: DagVertex[]) =>
        dispatch({ type: "SET_DAG_VERTICES", payload: vertices }),

      setDagRound: (round: number) =>
        dispatch({ type: "SET_DAG_ROUND", payload: round }),

      setSuiCertificates: (count: number) =>
        dispatch({ type: "SET_SUI_CERTIFICATES", payload: count }),

      setAnchorCommitted: (committed: boolean) =>
        dispatch({ type: "SET_ANCHOR_COMMITTED", payload: committed }),

      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return { state, actions };
}

export type SimulationActions = ReturnType<typeof useSimulationState>["actions"];
