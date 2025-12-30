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
        actions.setStep(1, "📤 [XRP Ledger 합의] 2012년 개발. 트랜잭션이 네트워크에 제출됩니다. XRPLCP는 채굴이나 스테이킹 없이 합의를 달성하는 독특한 프로토콜입니다.");
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
        actions.setStep(1, "📋 [UNL이란?] Unique Node List - 각 노드가 신뢰하는 Validator 목록. 기본 UNL은 Ripple이 추천하지만, 노드는 자체 UNL을 구성할 수 있습니다.");
        actions.setRoundNumber(1);
      } else if (step === 5) {
        actions.setStep(2, "🗳️ [라운드 1] 각 Validator가 유효하다고 판단한 트랜잭션 세트(Candidate Set)를 제안합니다. 서로 다른 Validator가 같은 트랜잭션을 포함할수록 합의 확률이 높아집니다.");
        actions.setAgreementPercent(25);
        audio.playVote();
      } else if (step === 7) {
        actions.setStep(2, "🗳️ [라운드 2] 각 Validator가 UNL 멤버들의 제안을 수집합니다. 최소 50% 이상이 포함한 트랜잭션만 다음 후보 세트에 남깁니다.");
        actions.setAgreementPercent(45);
        actions.setRoundNumber(2);
      } else if (step === 9) {
        actions.setStep(2, "🤝 [라운드 3] 임계값을 점진적으로 올립니다: 50% → 60% → 70%. 낮은 합의 트랜잭션은 제외되고, 높은 합의 트랜잭션만 남습니다.");
        actions.setAgreementPercent(65);
        actions.setRoundNumber(3);
      } else if (step === 11) {
        actions.setStep(3, "📈 [라운드 4] 최종 단계에서 80% 임계값 적용. UNL의 80% 이상이 동의해야 트랜잭션이 원장에 포함됩니다.");
        actions.setAgreementPercent(78);
        actions.setRoundNumber(4);
      } else if (step === 13) {
        actions.setStep(3, "🎯 [Supermajority] 80% 이상 달성! 이 임계값은 'Byzantine 장애 허용'과 '라이브니스' 사이의 균형점입니다. UNL의 20% 미만이 악의적이면 안전합니다.");
        actions.setAgreementPercent(85);
        audio.playConfirm();
      } else if (step === 15) {
        actions.setStep(4, "✅ [원장 확정] 합의된 트랜잭션 세트가 새 원장(Ledger)에 적용됩니다. 이전 원장의 해시를 포함하여 체인을 형성합니다. 즉시 최종성입니다!");
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
        actions.setStep(4, "⚡ [요약] 3-5초 확정. 채굴/스테이킹 없음. 에너지 효율적. 약 150+ Validator가 운영 중. 송금 수수료 ~0.00001 XRP.");
      } else if (step === 20) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
