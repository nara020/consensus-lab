"use client";

import { useReducer, useCallback, useMemo } from "react";
import * as THREE from "three";
import type {
  ChainBlock,
  Validator,
  Transaction,
  MiningData,
  StakeData,
  Phase,
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

  // RAFT specific
  logEntries: number;
  replicatedCount: number;

  // QBFT specific
  currentBlock: ChainBlock | null;
  prepareCount: number;
  commitCount: number;
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
  | { type: "SET_LOG_ENTRIES"; payload: number }
  | { type: "SET_REPLICATED_COUNT"; payload: number }
  | { type: "SET_CURRENT_BLOCK"; payload: ChainBlock | null }
  | { type: "SET_PREPARE_COUNT"; payload: number }
  | { type: "SET_COMMIT_COUNT"; payload: number }
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
  logEntries: 0,
  replicatedCount: 0,
  currentBlock: null,
  prepareCount: 0,
  commitCount: 0,
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

      reset: () => dispatch({ type: "RESET" }),
    }),
    []
  );

  return { state, actions };
}

export type SimulationActions = ReturnType<typeof useSimulationState>["actions"];
