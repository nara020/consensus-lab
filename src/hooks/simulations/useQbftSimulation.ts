"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { QBFT_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useQbftSimulation(
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

    const vals: Validator[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      vals.push({
        id: i,
        position: new THREE.Vector3(Math.cos(angle) * 2.5, Math.sin(angle) * 1.8, 0),
        role: i === 0 ? "proposer" : "validator",
        vote: "none",
        active: true,
        name: `V${i}`,
      });
    }
    actions.setValidators(vals);

    let step = 0;
    const chainBlocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Transaction arrives at Proposer");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[0].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(2, "PRE-PREPARE: Proposer proposes block");
        actions.setCurrentBlock({
          id: "proposed-block",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 5) {
        actions.setStep(3, "PREPARE: Validators voting for agreement...");
        actions.setPrepareCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 1 ? { ...v, vote: "prepare" as const } : v))
        );
        audio.playVote();
      } else if (step === 6) {
        actions.setPrepareCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "prepare" as const } : v))
        );
        audio.playVote();
      } else if (step === 7) {
        actions.setPrepareCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        actions.setStep(3, "PREPARE complete: 3/4 (2/3+ achieved!)");
        audio.playVote();
      } else if (step === 9) {
        actions.setStep(4, "COMMIT: Finalization voting started...");
        actions.setCommitCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 0 ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 10) {
        actions.setCommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 11) {
        actions.setCommitCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "commit" as const } : v))
        );
        actions.setStep(4, "COMMIT complete: 3/4 (2/3+ achieved!)");
        audio.playVote();
      } else if (step === 13) {
        actions.setStep(5, "Block #1 Finalized! Instant confirmation");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrepareCount(0);
        actions.setCommitCount(0);
      } else if (step === 15) {
        // Second block - Rotate proposer
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 1 ? "proposer" : "validator",
            vote: "none",
          }))
        );
        actions.setStep(2, "Next round: Proposer rotation");
      } else if (step === 16) {
        actions.setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[1].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 17) {
        actions.setTransactions([]);
        actions.setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        actions.setStep(2, "PRE-PREPARE: Block #2 proposed");
        audio.playVote();
      } else if (step === 18) {
        actions.setPrepareCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 1 ? { ...v, vote: "prepare" as const } : v))
        );
        audio.playVote();
      } else if (step === 19) {
        actions.setPrepareCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        actions.setStep(3, "PREPARE complete (2/3+)");
        audio.playVote();
      } else if (step === 20) {
        actions.setCommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 21) {
        actions.setCommitCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "commit" as const })));
        actions.setStep(4, "COMMIT complete (2/3+)");
        audio.playVote();
      } else if (step === 22) {
        actions.setStep(5, "Block #2 Finalized! Instant confirmation (Instant Finality)");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrepareCount(0);
        actions.setCommitCount(0);
      } else if (step === 24) {
        // Third block - Rotate proposer to V2
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 2 ? "proposer" : "validator",
            vote: "none",
          }))
        );
        actions.setStep(2, "Round-Robin: V2 becomes Proposer");
      } else if (step === 25) {
        actions.setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[2].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 26) {
        actions.setTransactions([]);
        actions.setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        actions.setStep(2, "PRE-PREPARE: Block #3 proposed");
        audio.playVote();
      } else if (step === 27) {
        actions.setPrepareCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        actions.setStep(3, "PREPARE complete (2f+1 = 3/4)");
        audio.playVote();
      } else if (step === 28) {
        actions.setCommitCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "commit" as const })));
        actions.setStep(4, "COMMIT complete (2f+1 = 3/4)");
        audio.playVote();
      } else if (step === 29) {
        actions.setStep(5, "Block #3 Finalized! No Fork Possible (BFT)");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-3 + chainBlocks.length * 1.5, -2.5, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
      } else if (step === 32) {
        cleanup();
        actions.setPhase("complete");
      }
    }, QBFT_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
