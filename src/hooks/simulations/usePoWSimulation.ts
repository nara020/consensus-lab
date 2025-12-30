"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

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
        actions.setStep(1, "🌐 [트랜잭션 전파] 사용자의 트랜잭션이 P2P 네트워크를 통해 전 세계 노드로 브로드캐스트됩니다. 각 노드는 트랜잭션을 검증 후 Mempool(메모리 풀)에 저장합니다.");
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
        actions.setStep(2, "⛏️ [채굴 시작] 마이너들이 Mempool에서 트랜잭션을 선택해 블록을 구성합니다. 목표: SHA-256 해시값이 난이도 목표(Target) 이하가 되는 Nonce를 찾는 것입니다.");
        actions.setMiningData({
          nonce: [0, 0, 0],
          hash: ["", "", ""],
          mining: [true, true, true],
          found: -1,
        });
      } else if (step >= 3 && step <= 5) {
        actions.setStep(2, "⛏️ [해시 퍼즐] Nonce(32비트 숫자)를 0부터 증가시키며 SHA-256(SHA-256(블록헤더))를 계산합니다. 비트코인은 초당 약 500 EH/s(엑사해시)의 연산이 수행됩니다.");
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
        actions.setStep(2, `🎉 [블록 발견] ${regionNames[firstFinder]}이(가) 난이도 조건을 만족하는 해시를 찾았습니다! 해시가 '0000'으로 시작 = 난이도 목표 이하. 이 블록을 즉시 네트워크에 브로드캐스트합니다.`);
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
          actions.setStep(3, `⛏️ [포크 발생] ${regionNames[branchIndex]}이(가) 블록 #${currentBranchLen + 1} 채굴! 네트워크 지연으로 여러 마이너가 거의 동시에 블록을 찾으면 일시적 포크가 발생합니다.`);
        }
      } else if (step === 25) {
        actions.updateMiningData({ mining: [false, false, false] });
        actions.setStep(4, `⚡ [최장 체인 규칙] ${regionNames[winnerIndex]} 체인이 가장 길어졌습니다. 나카모토 합의: "가장 많은 작업 증명(누적 난이도)이 포함된 체인이 정규 체인"입니다. 모든 노드가 이 체인으로 전환합니다.`);
        actions.setWinningBranch(winnerIndex);
        audio.playFinalize();

        actions.updateBlocks((blocks) =>
          blocks.map((b) => ({
            ...b,
            status: b.branch === winnerIndex ? "confirmed" : "orphaned",
          }))
        );
      } else if (step === 28) {
        actions.setStep(5, "😭 [재구성(Reorg)] 짧은 체인의 블록은 고아(Orphan/Stale) 블록이 됩니다. 해당 블록의 채굴 보상(현재 6.25 BTC)과 수수료가 무효화됩니다. 이것이 PoW의 '확률적 최종성' - 6 확인 후 되돌리기가 사실상 불가능합니다.");
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
