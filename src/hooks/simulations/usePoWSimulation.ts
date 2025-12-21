"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { REGIONS, SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HELPER FUNCTIONS
// ==========================================
function generateFakeHash(shouldStartWithZeros = false): string {
  const chars = "0123456789abcdef";
  if (shouldStartWithZeros) {
    return "0000" + Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * 16)]).join("");
  }
  const prefix = Math.random() > 0.1 ? chars[Math.floor(Math.random() * 15) + 1] : "0";
  return prefix + Array.from({ length: 15 }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

// ==========================================
// HOOK
// ==========================================
export function usePoWSimulation(
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

    // Create regional miners
    const miners: Validator[] = [
      { id: 0, position: new THREE.Vector3(8, 1.8, 0), role: "miner", vote: "none", active: true, name: "🌎 N.America Pool" },
      { id: 1, position: new THREE.Vector3(8, 0, 0), role: "miner", vote: "none", active: true, name: "🌍 Europe Pool" },
      { id: 2, position: new THREE.Vector3(8, -1.8, 0), role: "miner", vote: "none", active: true, name: "🌏 Asia Pool" },
    ];
    actions.setValidators(miners);

    let step = 0;
    const branchBlocks: ChainBlock[][] = [[], [], []];

    // Randomly determine winner
    const winnerIndex = Math.floor(Math.random() * 3);
    const targetLengths = [0, 0, 0];
    targetLengths[winnerIndex] = 6;
    const losers = [0, 1, 2].filter(i => i !== winnerIndex);
    targetLengths[losers[0]] = Math.random() > 0.5 ? 2 : 4;
    targetLengths[losers[1]] = targetLengths[losers[0]] === 2 ? 4 : 2;

    const regionYOffsets = [1.8, 0, -1.8];
    const regionNames = ["North America", "Europe", "Asia"];

    intervalRef.current = setInterval(() => {
      step++;

      if (step === 1) {
        actions.setStep(1, "Transactions propagate across the global network");
        const txs: Transaction[] = Array.from({ length: 6 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-8, (i % 3 - 1) * 1.8, 0),
          status: "pending",
          target: new THREE.Vector3(-5, 0, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 2) {
        actions.setTransactions([]);
        actions.setStep(2, "Mining pools in each region start mining simultaneously");
        actions.setMiningData({
          nonce: [0, 0, 0],
          hash: ["", "", ""],
          mining: [true, true, true],
          found: -1,
        });
      } else if (step >= 3 && step <= 5) {
        actions.setStep(2, "⛏️ Mining... Changing nonce values");
        actions.updateMiningData({
          nonce: [0, 1, 2].map(() => Math.floor(Math.random() * 100000)),
          hash: [generateFakeHash(), generateFakeHash(), generateFakeHash()],
        });
      } else if (step === 6) {
        const firstFinder = Math.floor(Math.random() * 3);
        actions.updateMiningData({
          hash: [0, 1, 2].map((i) => i === firstFinder ? "0000a3f8b2c1d4e5" : generateFakeHash()),
          found: firstFinder,
        });
        actions.setStep(2, `🎉 ${regionNames[firstFinder]} found valid hash! (starts with 0000)`);
        audio.playMine();
      } else if (step >= 7 && step <= 24) {
        const roundInPhase = step - 7;
        const branchIndex = roundInPhase % 3;
        const currentBranchLen = branchBlocks[branchIndex].length;

        if (roundInPhase % 3 === 0) {
          actions.setMiningData({
            nonce: [0, 1, 2].map(() => Math.floor(Math.random() * 100000)),
            hash: ["", "", ""],
            mining: [true, true, true],
            found: -1,
          });
        }

        if (currentBranchLen < targetLengths[branchIndex]) {
          audio.playMine();

          actions.updateMiningData({
            hash: [0, 1, 2].map((i) => i === branchIndex ? generateFakeHash(true) : ""),
            found: branchIndex,
          });

          const newBlock: ChainBlock = {
            id: `block-${step}`,
            position: new THREE.Vector3(-2.5 + currentBranchLen * 1.2, regionYOffsets[branchIndex], 0),
            status: "mined",
            blockNumber: currentBranchLen + 1,
            branch: branchIndex,
            txCount: Math.floor(Math.random() * 200) + 50,
          };

          branchBlocks[branchIndex].push(newBlock);
          actions.setBlocks([...branchBlocks.flat()]);
          actions.setForkLengths([branchBlocks[0].length, branchBlocks[1].length, branchBlocks[2].length]);
          actions.setStep(3, `${regionNames[branchIndex]} mined block #${currentBranchLen + 1}!`);
        }
      } else if (step === 25) {
        actions.updateMiningData({ mining: [false, false, false] });
        actions.setStep(4, `⚡ ${regionNames[winnerIndex]} chain becomes longest → All nodes adopt this chain as main`);
        actions.setWinningBranch(winnerIndex);
        audio.playFinalize();

        actions.updateBlocks((blocks) =>
          blocks.map((b) => ({
            ...b,
            status: b.branch === winnerIndex ? "confirmed" : "orphaned",
          }))
        );
      } else if (step === 28) {
        actions.setStep(5, "😭 Shorter chains become Orphan → Mining rewards invalidated (Reorg occurred)");
        audio.playOrphan();
      } else if (step === 32) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
