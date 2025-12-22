"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useOptimisticSimulation(
  actions: SimulationActions,
  audio: AudioActions
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const run = useCallback(() => {
    cleanup();
    actions.reset();
    actions.setPhase("running");

    // Create sequencer
    const validators: Validator[] = [
      { id: 0, position: new THREE.Vector3(-4, 2, 0), role: "sequencer", vote: "none", active: true, name: "Sequencer" },
    ];
    actions.setValidators(validators);

    let step = 0;
    const l2Blocks: ChainBlock[] = [];
    const l1Blocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Users submit transactions to L2 Sequencer");
        const txs: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-7, 2 + (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(-4, 2, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(1, "Sequencer collects transactions into batches");
      } else if (step === 5) {
        actions.setStep(2, "Sequencer executes transactions on L2");
        const block: ChainBlock = {
          id: "l2-block-1",
          position: new THREE.Vector3(-1, 2, 0),
          status: "batched",
          blockNumber: 1,
          branch: 0,
          txCount: 8,
        };
        l2Blocks.push(block);
        actions.setL2Blocks([...l2Blocks]);
        audio.playMine();
      } else if (step === 7) {
        actions.setStep(2, "More transactions batched into L2 blocks");
        const block2: ChainBlock = {
          id: "l2-block-2",
          position: new THREE.Vector3(1, 2, 0),
          status: "batched",
          blockNumber: 2,
          branch: 0,
          txCount: 12,
        };
        l2Blocks.push(block2);
        actions.setL2Blocks([...l2Blocks]);
        audio.playMine();
      } else if (step === 9) {
        actions.setStep(3, "Submit State Root to L1 (Ethereum)");
        // Update L2 blocks to submitted status
        l2Blocks.forEach(b => b.status = "submitted");
        actions.setL2Blocks([...l2Blocks]);

        // Create L1 block
        const l1Block: ChainBlock = {
          id: "l1-block-1",
          position: new THREE.Vector3(0, -2, 0),
          status: "proposed",
          blockNumber: 1,
          branch: 0,
        };
        l1Blocks.push(l1Block);
        actions.setL1Blocks([...l1Blocks]);
        audio.playConfirm();
      } else if (step === 11) {
        actions.setStep(3, "⏳ Challenge Period begins (7 days in real, simulated)");
        actions.setChallengePeriod(7);
      } else if (step === 13) {
        actions.setChallengePeriod(5);
        actions.setStep(3, "Waiting for potential fraud proofs...");
      } else if (step === 15) {
        actions.setChallengePeriod(3);
        actions.setStep(3, "Anyone can submit fraud proof if state is invalid");
      } else if (step === 17) {
        actions.setChallengePeriod(1);
        actions.setStep(4, "Almost finalized... No challenges received");
      } else if (step === 19) {
        actions.setChallengePeriod(0);
        actions.setStep(5, "✅ Challenge period ended - State FINALIZED on L1!");

        // Finalize all blocks
        l2Blocks.forEach(b => b.status = "finalized");
        l1Blocks.forEach(b => b.status = "finalized");
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playFinalize();
      } else if (step === 22) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
