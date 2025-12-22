"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useZkSimulation(
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

    // Create sequencer and prover
    const validators: Validator[] = [
      { id: 0, position: new THREE.Vector3(-5, 2, 0), role: "sequencer", vote: "none", active: true, name: "Sequencer" },
      { id: 1, position: new THREE.Vector3(0, 2, 0), role: "prover", vote: "none", active: true, name: "ZK Prover" },
    ];
    actions.setValidators(validators);

    let step = 0;
    const l2Blocks: ChainBlock[] = [];
    const l1Blocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Users submit transactions to L2");
        const txs: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-8, 2 + (i % 4 - 1.5) * 0.4, 0),
          status: "pending",
          target: new THREE.Vector3(-5, 2, 0),
        }));
        actions.setTransactions(txs);
        actions.setBatchSize(10);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(1, "Sequencer batches transactions");
      } else if (step === 5) {
        actions.setStep(2, "Executing transactions on L2...");
        const block: ChainBlock = {
          id: "l2-block-1",
          position: new THREE.Vector3(-2.5, 2, 0),
          status: "batched",
          blockNumber: 1,
          branch: 0,
          txCount: 10,
        };
        l2Blocks.push(block);
        actions.setL2Blocks([...l2Blocks]);
        audio.playMine();
      } else if (step === 7) {
        actions.setStep(2, "🔐 ZK Prover starts generating validity proof...");
        actions.setProofProgress(10);
      } else if (step === 8) {
        actions.setProofProgress(25);
        actions.setStep(2, "Computing witness values...");
      } else if (step === 9) {
        actions.setProofProgress(45);
        actions.setStep(2, "Building constraint system...");
      } else if (step === 10) {
        actions.setProofProgress(65);
        actions.setStep(2, "Generating SNARK proof...");
      } else if (step === 11) {
        actions.setProofProgress(85);
        actions.setStep(2, "Finalizing proof...");
      } else if (step === 12) {
        actions.setProofProgress(100);
        actions.setProofGenerated(true);
        actions.setStep(3, "✅ ZK Proof generated! Submitting to L1...");
        audio.playConfirm();
      } else if (step === 14) {
        l2Blocks.forEach(b => b.status = "proven");
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(3, "Proof + State Root submitted to Ethereum");

        const l1Block: ChainBlock = {
          id: "l1-block-1",
          position: new THREE.Vector3(0, -2.5, 0),
          status: "proposed",
          blockNumber: 1,
          branch: 0,
        };
        l1Blocks.push(l1Block);
        actions.setL1Blocks([...l1Blocks]);
      } else if (step === 16) {
        actions.setStep(4, "L1 contract verifies ZK proof (cheap on-chain computation)");
        audio.playVote();
      } else if (step === 18) {
        actions.setStep(5, "✅ Proof VALID - State immediately FINALIZED!");

        l2Blocks.forEach(b => b.status = "finalized");
        l1Blocks.forEach(b => b.status = "finalized");
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playFinalize();
      } else if (step === 20) {
        actions.setStep(5, "⚡ No challenge period needed - Math guarantees validity!");
      } else if (step === 23) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
