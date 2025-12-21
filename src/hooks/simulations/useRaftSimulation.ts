"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useRaftSimulation(
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

    const vals: Validator[] = [
      { id: 0, position: new THREE.Vector3(0, 1.5, 0), role: "leader", vote: "none", active: true, name: "Leader" },
      { id: 1, position: new THREE.Vector3(-2.5, -0.5, 0), role: "follower", vote: "none", active: true, name: "Follower 1" },
      { id: 2, position: new THREE.Vector3(0, -1.5, 0), role: "follower", vote: "none", active: true, name: "Follower 2" },
      { id: 3, position: new THREE.Vector3(2.5, -0.5, 0), role: "follower", vote: "none", active: true, name: "Follower 3" },
    ];
    actions.setValidators(vals);

    let step = 0;
    let log = 0;
    const chainBlocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      // ========== BLOCK 1 ==========
      if (step === 1) {
        actions.setStep(1, "Transaction arrives at Leader");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(2, "Leader appends to log");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 5) {
        actions.setStep(3, "Requesting replication to Followers...");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(1);
        audio.playVote();
      } else if (step === 7) {
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 9) {
        actions.setStep(4, "Majority (3/4) replicated!");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 11) {
        actions.setStep(5, "Commit! Block #1 finalized (Instant Finality)");
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setReplicatedCount(0);
      }

      // ========== BLOCK 2 ==========
      else if (step === 13) {
        actions.setStep(1, "Transaction #2 arrives at Leader");
        actions.setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 15) {
        actions.setTransactions([]);
        actions.setStep(2, "Leader appends to log (Entry #2)");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 16) {
        actions.setStep(3, "Requesting replication to Followers...");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 17) {
        actions.setStep(4, "Majority replicated!");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 18) {
        actions.setStep(5, "Commit! Block #2 finalized (Instant Finality)");
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setReplicatedCount(0);
      }

      // ========== BLOCK 3 ==========
      else if (step === 20) {
        actions.setStep(1, "Transaction #3 arrives at Leader");
        actions.setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 22) {
        actions.setTransactions([]);
        actions.setStep(2, "Leader appends to log (Entry #3)");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 23) {
        actions.setStep(3, "Requesting replication to Followers...");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 24) {
        actions.setStep(4, "Majority replicated!");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 25) {
        actions.setStep(5, "Commit! Block #3 finalized (Instant Finality)");
        audio.playFinalize();

        const newBlock: ChainBlock = {
          id: `block-${chainBlocks.length}`,
          position: new THREE.Vector3(-4 + chainBlocks.length * 1.5, -3, 0),
          status: "committed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
          txCount: Math.floor(Math.random() * 100) + 50,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
      } else if (step === 28) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
