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
        actions.setStep(1, "📤 [ZK 롤업] 사용자가 L2에 트랜잭션을 제출합니다. ZK Rollup은 수학적 증명(Validity Proof)으로 트랜잭션의 정확성을 보장합니다. 예: zkSync, StarkNet, Polygon zkEVM.");
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
        actions.setStep(1, "📦 [시퀀서] 트랜잭션을 배치로 묶습니다. 시퀀서는 트랜잭션 순서를 결정하고 L2 상태를 업데이트합니다. 현재 대부분 중앙화된 시퀀서를 사용합니다.");
      } else if (step === 5) {
        actions.setStep(2, "⚙️ [상태 전이] L2 VM(zkEVM 또는 Cairo VM)에서 트랜잭션을 실행합니다. 실행 결과로 새로운 상태 루트(State Root)가 계산됩니다.");
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
        actions.setStep(2, "🔐 [Prover 시작] ZK 증명자가 유효성 증명 생성을 시작합니다. 이 과정은 계산 집약적이며, GPU/FPGA/ASIC을 사용해 가속합니다.");
        actions.setProofProgress(10);
      } else if (step === 8) {
        actions.setProofProgress(25);
        actions.setStep(2, "🧮 [Witness 생성] 각 연산의 중간 결과값(Witness)을 계산합니다. 이 값들은 회로 제약조건을 만족시키는 '비밀 입력'입니다.");
      } else if (step === 9) {
        actions.setProofProgress(45);
        actions.setStep(2, "🔗 [산술 회로] R1CS 또는 AIR 형식의 제약조건 시스템을 구축합니다. 모든 연산이 올바르게 수행되었음을 수학적으로 표현합니다.");
      } else if (step === 10) {
        actions.setProofProgress(65);
        actions.setStep(2, "🔒 [SNARK/STARK] 증명 생성 중. SNARK: 작은 증명, Trusted Setup 필요. STARK: 큰 증명, 양자 저항성, Setup 불필요. 대부분 Plonk/Groth16 사용.");
      } else if (step === 11) {
        actions.setProofProgress(85);
        actions.setStep(2, "✨ [증명 마무리] 다항식 약속(Polynomial Commitment)과 Fiat-Shamir 변환을 적용합니다. 최종 증명 크기: ~수백 바이트(SNARK) 또는 ~수십 KB(STARK).");
      } else if (step === 12) {
        actions.setProofProgress(100);
        actions.setProofGenerated(true);
        actions.setStep(3, "✅ [증명 완료] ZK 증명이 생성되었습니다! 증명 생성 시간: 수 분~수십 분(배치 크기에 따라). 이제 L1에 제출합니다.");
        audio.playConfirm();
      } else if (step === 14) {
        l2Blocks.forEach(b => b.status = "proven");
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(3, "📨 [L1 제출] 증명 + 새 상태 루트 + 압축된 트랜잭션 데이터가 이더리움 L1에 제출됩니다. Calldata 또는 EIP-4844 Blob으로 데이터 가용성 보장.");

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
        actions.setStep(4, "🔍 [검증] L1 Verifier 컨트랙트가 증명을 검증합니다. Pairing 연산 사용. 가스 비용: ~200K-500K gas. 수백만 트랜잭션의 유효성을 한 번에 검증!");
        audio.playVote();
      } else if (step === 18) {
        actions.setStep(5, "✅ [즉시 최종성] 증명이 유효하면 상태가 즉시 확정됩니다! Optimistic과 달리 7일 이의제기 기간이 필요 없습니다. L1 블록 확정 시 함께 확정.");

        l2Blocks.forEach(b => b.status = "finalized");
        l1Blocks.forEach(b => b.status = "finalized");
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playFinalize();
      } else if (step === 20) {
        actions.setStep(5, "⚡ [요약] 수학적 증명으로 신뢰 불필요. 빠른 출금(분 단위). 높은 보안성. 단점: Prover 비용이 높음, EVM 호환성 도전적(zkEVM). 미래의 주류 기술.");
      } else if (step === 23) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
