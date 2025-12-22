"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useRippleSimulation(
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

    // Create UNL nodes in a circle
    const nodeCount = 8;
    const validators: Validator[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(0, 0, 0), // Position calculated in scene
      role: "unlNode" as const,
      vote: "none",
      active: true,
      name: `UNL ${i + 1}`,
    }));
    actions.setValidators(validators);

    let step = 0;
    const blocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Transactions submitted to network");
        const txs: Transaction[] = Array.from({ length: 6 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-5, (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 0, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(1, "📋 UNL nodes receive transactions");
        actions.setRoundNumber(1);
      } else if (step === 5) {
        actions.setStep(2, "Round 1: Nodes propose candidate sets");
        actions.setAgreementPercent(25);
        audio.playVote();
      } else if (step === 7) {
        actions.setStep(2, "Round 2: Voting on proposals...");
        actions.setAgreementPercent(45);
        actions.setRoundNumber(2);
      } else if (step === 9) {
        actions.setStep(2, "Round 3: Building agreement...");
        actions.setAgreementPercent(65);
        actions.setRoundNumber(3);
      } else if (step === 11) {
        actions.setStep(3, "Round 4: Approaching supermajority...");
        actions.setAgreementPercent(78);
        actions.setRoundNumber(4);
      } else if (step === 13) {
        actions.setStep(3, "🎯 80%+ threshold reached!");
        actions.setAgreementPercent(85);
        audio.playConfirm();
      } else if (step === 15) {
        actions.setStep(4, "✅ Consensus achieved - Ledger validated!");
        actions.setAgreementPercent(100);

        const block: ChainBlock = {
          id: `ledger-${blocks.length + 1}`,
          position: new THREE.Vector3(-3 + blocks.length * 1.5, -3, 0),
          status: "finalized",
          blockNumber: blocks.length + 1,
          branch: 0,
        };
        blocks.push(block);
        actions.setBlocks([...blocks]);
        audio.playFinalize();
      } else if (step === 17) {
        actions.setStep(4, "⚡ 3-5 second finality - No mining needed!");
      } else if (step === 20) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
