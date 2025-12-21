"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS, DEFAULT_STAKES } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function usePoSSimulation(
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

    // Create validators in a row at top
    const vals: Validator[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(-3 + i * 2, 2.2, 0),
      role: i === 0 ? "proposer" : "validator",
      vote: "none",
      active: true,
      name: `V${i}`,
    }));
    actions.setValidators(vals);

    let step = 0;
    let slot = 0;
    let epoch = 0;
    const chainBlocks: ChainBlock[] = [];

    // Set stake data for visualization
    const stakes = DEFAULT_STAKES;
    const totalStake = stakes.reduce((a, b) => a + b, 0);
    actions.setStakeData({ stakes, totalStake, selectedProposer: -1 });

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Checking each Validator's stake amount...");
        actions.setStakeData({ stakes, totalStake, selectedProposer: -1 });
      } else if (step === 2) {
        actions.setStep(1, "Selecting Proposer based on stake ratio...");
        audio.playVote();
      } else if (step === 3) {
        actions.setStakeData({ stakes, totalStake, selectedProposer: 0 });
        actions.setStep(1, "V0 selected! (32 ETH = 13% probability)");
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 0 ? "proposer" : "validator",
          }))
        );
        audio.playVote();
      } else if (step === 4) {
        actions.setStep(1, "Transactions delivered to current Proposer");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-6, 2.2, 0),
          status: "pending",
          target: new THREE.Vector3(-3, 2.2, 0),
        }]);
        audio.playTx();
      } else if (step === 6) {
        actions.setTransactions([]);
        actions.setStep(2, "Proposer proposes new block (Slot 0)");

        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.setCurrentSlot(slot);
        audio.playVote();
      } else if (step >= 7 && step <= 21) {
        const phase = (step - 7) % 5;

        if (phase === 0) {
          actions.setStep(3, "Validators casting Attestation votes...");
          actions.updateValidators((validators) =>
            validators.map((v, i) => (i > 0 ? { ...v, vote: "attest" as const } : v))
          );
          actions.setAttestations(3);
          audio.playVote();
        } else if (phase === 2) {
          slot++;
          actions.setCurrentSlot(slot);
          const newEpoch = Math.floor(slot / 2);

          if (newEpoch > epoch) {
            epoch = newEpoch;
            actions.setCurrentEpoch(epoch);
            actions.setStep(epoch > 1 ? 5 : 4, epoch > 1 ? "2 Epochs complete → Finalized!" : "1 Epoch complete → Justified");
            audio.playFinalize();

            actions.updateBlocks((blocks) =>
              blocks.map((b, i) => {
                if (epoch > 1 && i < blocks.length - 2) return { ...b, status: "finalized" };
                if (epoch >= 1 && i < blocks.length - 1) return { ...b, status: "justified" };
                return b;
              })
            );
          }

          // Rotate proposer
          const nextProposer = slot % 4;
          actions.updateStakeData((prev) => ({ ...prev, selectedProposer: nextProposer }));
          actions.updateValidators((validators) =>
            validators.map((v, i) => ({
              ...v,
              role: i === nextProposer ? "proposer" : "validator",
              vote: "none",
            }))
          );

          // Add new block
          if (slot < 6) {
            const newBlock: ChainBlock = {
              id: `block-${slot}`,
              position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
              status: "proposed",
              blockNumber: slot,
              branch: 0,
            };
            chainBlocks.push(newBlock);
            actions.setBlocks([...chainBlocks]);
          }
          actions.setAttestations(0);
        }
      } else if (step === 23) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
