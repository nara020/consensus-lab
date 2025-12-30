"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS, DEFAULT_STAKES } from "@/constants/consensusInfo";

// Helper to generate random hex string
function randomHex(length: number): string {
  const chars = "0123456789abcdef";
  let result = "0x";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * 16)];
  }
  return result;
}

// Simple XOR-like hash mixing simulation
function mixHash(a: string, b: string): string {
  const combined = a.slice(2) + b.slice(2);
  return "0x" + combined.slice(0, 8);
}

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

    // Initialize RANDAO
    const epochSeed = randomHex(8);
    actions.setRandaoData({
      currentSeed: epochSeed,
      revealedValues: [],
      mixedHash: "",
    });

    intervalRef.current = setInterval(() => {
      step++;

      // ========================================
      // PHASE 1: 소개 (Steps 1-15)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "🎓 [이더리움 PoS] 2022년 9월 'The Merge'로 PoW에서 전환. Validator가 32 ETH를 예치하고 블록을 제안/검증합니다. 연간 에너지 소비가 99.95% 감소했습니다.");
      } else if (step === 3) {
        actions.setStep(1, "💰 [스테이킹] Validator가 되려면 32 ETH(약 $80,000)를 Deposit Contract에 예치해야 합니다. 이 ETH는 악의적 행동 시 '슬래싱'으로 몰수될 수 있어 정직한 행동을 유도합니다.");
      } else if (step === 5) {
        actions.setStep(1, "👥 [Validator 구성] 현재 이더리움에는 약 100만 개의 Validator가 있습니다. 이 시뮬레이션에서는 4명의 Validator로 단순화했습니다.");
      } else if (step === 7) {
        actions.setStep(1, "📊 [확률 가중치] 스테이크 양에 비례해 블록 제안 확률이 결정됩니다. 64 ETH = 32 ETH의 2배 확률. 이는 네트워크 보안과 분산화의 균형을 맞춥니다.");
      } else if (step === 9) {
        actions.setStep(1, "⏱️ [시간 단위] Slot=12초(블록 1개), Epoch=32 Slots=6.4분. 각 Slot마다 1명의 제안자와 여러 위원회(Committee)가 할당됩니다.");
      }

      // ========================================
      // PHASE 2: RANDAO 설명 (Steps 12-25)
      // ========================================
      else if (step === 12) {
        actions.setStep(1, "━━━ 🎲 RANDAO: 탈중앙화 난수 생성 ━━━");
      } else if (step === 14) {
        actions.setStep(1, "🎲 [RANDAO란?] 블록체인에서 난수를 만들기는 어렵습니다(모든 것이 결정적이므로). RANDAO는 Validator들의 BLS 서명을 XOR하여 예측 불가능한 난수를 생성합니다.");
      } else if (step === 16) {
        actions.setStep(1, "🌱 [Epoch 시드] 각 Epoch는 이전 RANDAO 믹스값을 시드로 시작합니다. 이 시드는 2 Epoch 전에 결정되어 있어 Validator 선정을 미리 알 수 있습니다.");
        actions.setRandaoData({
          currentSeed: epochSeed,
          revealedValues: [],
          mixedHash: epochSeed,
        });
      } else if (step === 18) {
        actions.setStep(1, "🔐 [BLS 서명] Validator는 Epoch 번호에 대한 BLS12-381 서명을 RANDAO reveal로 공개합니다. 이 서명은 개인키 없이는 예측이 불가능합니다.");
        audio.playVote();
      } else if (step === 20) {
        actions.setStep(1, "📤 [RANDAO Reveal] 제안자 V0이 자신의 BLS 서명(RANDAO reveal)을 블록에 포함합니다. 이 값은 현재 RANDAO 믹스와 XOR되어 새 믹스가 됩니다.");
        const v0Reveal = randomHex(8);
        const mixed = mixHash(epochSeed, v0Reveal);
        actions.setRandaoData({
          currentSeed: epochSeed,
          revealedValues: [v0Reveal],
          mixedHash: mixed,
        });
        audio.playVote();
      } else if (step === 22) {
        actions.setStep(1, "🔀 [믹싱 과정] new_mix = XOR(current_mix, BLS_signature). 각 블록마다 RANDAO가 업데이트되어 최종 Epoch 종료 시 다음 Epoch의 시드가 결정됩니다.");
      } else if (step === 24) {
        actions.setStep(1, "🎯 [제안자 선정] RANDAO를 Validator 인덱스와 스테이크 가중치로 나눠 제안자를 결정합니다. 한계: 마지막 제안자가 reveal을 보류해 약간의 편향을 줄 수 있습니다.");
      }

      // ========================================
      // PHASE 3: 제안자 선정 (Steps 27-40)
      // ========================================
      else if (step === 27) {
        actions.setStep(2, "━━━ 🎰 제안자(Proposer) 선정 알고리즘 ━━━");
      } else if (step === 29) {
        actions.setStep(2, "📊 [선정 방식] compute_proposer_index() 함수가 RANDAO 시드, Slot 번호, Validator 인덱스를 조합해 제안자를 결정합니다.");
      } else if (step === 31) {
        actions.setStep(2, "📈 [확률 분포] 총 240 ETH 중 - V0: 32 ETH (13.3%), V1: 64 ETH (26.7%)");
      } else if (step === 33) {
        actions.setStep(2, "📈 [확률 분포] V2: 48 ETH (20%), V3: 96 ETH (40%). 스테이크가 많을수록 제안 확률이 비례해서 증가합니다.");
      } else if (step === 35) {
        actions.setStakeData({ stakes, totalStake, selectedProposer: 0 });
        actions.setStep(2, "🎯 [V0 선정] RANDAO와 스테이크 확률에 따라 V0이 이번 Slot의 제안자로 선정되었습니다. 제안자는 12초 내에 블록을 제안해야 합니다.");
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 0 ? "proposer" : "validator",
          }))
        );
        audio.playVote();
      }

      // ========================================
      // PHASE 4: Slot 0 - 첫 번째 블록 (Steps 38-55)
      // ========================================
      else if (step === 39) {
        actions.setStep(2, "━━━ ⏰ EPOCH 0, SLOT 0 시작 ━━━");
        actions.setCurrentSlot(slot);
        actions.setCurrentEpoch(epoch);
      } else if (step === 41) {
        actions.setStep(2, "📥 트랜잭션이 제안자 V0에게 도착");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-6, 2.2, 0),
          status: "pending",
          target: new THREE.Vector3(-3, 2.2, 0),
        }]);
        audio.playTx();
      } else if (step === 43) {
        actions.setTransactions([]);
        actions.setStep(2, "📦 V0이 Slot 0 블록을 생성합니다");

        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        audio.playVote();
      } else if (step === 45) {
        actions.setStep(3, "━━━ 🗳️ 증명(Attestation) - LMD GHOST 투표 ━━━");
      } else if (step === 47) {
        actions.setStep(3, "👥 [Attestation이란?] 각 Validator가 '이 블록이 정규 체인의 헤드다'라고 투표하는 것입니다. LMD GHOST 프로토콜로 포크 선택 규칙을 결정합니다.");
      } else if (step === 49) {
        actions.setStep(3, "✅ [V1 증명] AttestationData에는 (slot, beacon_block_root, source, target) 정보가 포함됩니다. 증명은 Slot 시작 후 4초에 브로드캐스트됩니다.");
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 1 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(1);
        audio.playVote();
      } else if (step === 51) {
        actions.setStep(3, "✅ [V2 증명] 같은 위원회의 Validator들은 증명을 집계(Aggregate)합니다. BLS 서명 집계로 수천 개의 서명을 하나로 압축할 수 있습니다.");
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 && i !== 0 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(2);
        audio.playVote();
      } else if (step === 53) {
        actions.setStep(3, "✅ [V3 증명] 모든 위원회 증명이 수집되면 다음 블록에 포함됩니다. 정확한 source, target, head 투표 시 최대 보상을 받습니다.");
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 0 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(3);
        audio.playVote();
      } else if (step === 55) {
        actions.setStep(3, "🎉 [Slot 0 완료] 3/3 증명이 수신되었습니다. 이 증명들은 다음 블록에 포함되어 온체인에 기록됩니다.");
      }

      // ========================================
      // PHASE 5: Slot 1 - 제안자 로테이션 (Steps 58-75)
      // ========================================
      else if (step === 58) {
        slot++;
        actions.setCurrentSlot(slot);
        actions.setStep(2, "━━━ ⏰ EPOCH 0, SLOT 1 ━━━");
        actions.updateValidators((validators) =>
          validators.map((v) => ({ ...v, vote: "none" as const }))
        );
        actions.setAttestations(0);
      } else if (step === 60) {
        actions.setStep(2, "🎲 RANDAO가 V3 선정 (40% 스테이크 = 최고 확률)");
        const newReveal = randomHex(8);
        actions.setRandaoData({
          currentSeed: epochSeed,
          revealedValues: [randomHex(8), newReveal],
          mixedHash: randomHex(8),
        });
        audio.playVote();
      } else if (step === 62) {
        actions.setStakeData({ stakes, totalStake, selectedProposer: 3 });
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 3 ? "proposer" : "validator",
          }))
        );
        actions.setStep(2, "🎯 V3이 제안자로 선정됨 (96 ETH 스테이크)");
      } else if (step === 64) {
        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.setStep(2, "📦 V3이 Block 1을 제안합니다");
        audio.playVote();
      } else if (step === 66) {
        actions.setStep(3, "🗳️ 증명 투표 진행 중...");
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 3 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(3);
        audio.playVote();
      } else if (step === 68) {
        actions.setStep(3, "🎉 Slot 1 완료! 모든 증명 수신됨");
      }

      // ========================================
      // PHASE 6: Epoch 종료 - 정당화 (Steps 70-90)
      // ========================================
      else if (step === 71) {
        slot++;
        actions.setCurrentSlot(slot);
        epoch = 1;
        actions.setCurrentEpoch(epoch);
        actions.setStep(4, "━━━ 🔄 EPOCH 경계 - Casper FFG 체크포인트 ━━━");
        actions.updateValidators((validators) =>
          validators.map((v) => ({ ...v, vote: "none" as const }))
        );
        actions.setAttestations(0);
      } else if (step === 73) {
        actions.setStep(4, "🔍 [체크포인트] Epoch의 첫 Slot 블록이 체크포인트입니다. Casper FFG는 이 체크포인트들 간의 링크를 통해 최종성을 달성합니다.");
      } else if (step === 75) {
        actions.setStep(4, "✅ [JUSTIFIED] 총 스테이크의 2/3 이상이 source→target 링크에 투표하면 target이 Justified됩니다. 이는 '아마도 최종'이라는 의미입니다.");
        actions.updateBlocks((blocks) =>
          blocks.map((b) => ({ ...b, status: "justified" }))
        );
        audio.playConfirm();
      } else if (step === 77) {
        actions.setStep(4, "📌 [Justified vs Finalized] Justified 블록은 이론적으로 아직 재구성될 수 있습니다. 하지만 다음 Epoch에서 연속 Justified되면 Finalized가 됩니다.");
      } else if (step === 79) {
        const newReveal = randomHex(8);
        actions.setRandaoData({
          currentSeed: epochSeed,
          revealedValues: [randomHex(8), randomHex(8), newReveal],
          mixedHash: randomHex(8),
        });
        actions.setStep(4, "🎲 Epoch 1을 위한 새로운 RANDAO 값 공개");
        audio.playVote();
      } else if (step === 81) {
        actions.setStakeData({ stakes, totalStake, selectedProposer: 1 });
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 1 ? "proposer" : "validator",
          }))
        );
        actions.setStep(2, "🎯 V1이 Slot 2의 제안자로 선정됨 (64 ETH)");
      } else if (step === 83) {
        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.setStep(2, "📦 V1이 Block 2를 제안합니다");
        audio.playVote();
      } else if (step === 85) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 1 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(3);
        actions.setStep(3, "✅ Block 2에 대한 증명 수신됨");
        audio.playVote();
      }

      // ========================================
      // PHASE 7: Epoch 2 - 최종 확정 (Steps 88-105)
      // ========================================
      else if (step === 88) {
        slot++;
        actions.setCurrentSlot(slot);
        actions.setStep(2, "━━━ ⏰ SLOT 3 ━━━");
        actions.updateValidators((validators) =>
          validators.map((v) => ({ ...v, vote: "none" as const }))
        );
        actions.setAttestations(0);
      } else if (step === 90) {
        actions.setStakeData({ stakes, totalStake, selectedProposer: 2 });
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 2 ? "proposer" : "validator",
          }))
        );
        actions.setStep(2, "🎯 V2가 Slot 3의 제안자로 선정됨 (48 ETH)");
      } else if (step === 92) {
        const newBlock: ChainBlock = {
          id: `block-${slot}`,
          position: new THREE.Vector3(-4 + slot * 1.2, 0, 0),
          status: "proposed",
          blockNumber: slot,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.setStep(2, "📦 V2가 Block 3을 제안합니다");
        audio.playVote();
      } else if (step === 94) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 2 ? { ...v, vote: "attest" as const } : v))
        );
        actions.setAttestations(3);
        audio.playVote();
      } else if (step === 96) {
        slot++;
        actions.setCurrentSlot(slot);
        epoch = 2;
        actions.setCurrentEpoch(epoch);
        actions.setStep(5, "━━━ 🏆 최종 확정(Finalization) - 경제적 최종성 ━━━");
        actions.updateValidators((validators) =>
          validators.map((v) => ({ ...v, vote: "none" as const }))
        );
      } else if (step === 98) {
        actions.setStep(5, "🔒 [2-Epoch 규칙] 연속된 두 체크포인트가 Justified되면, 이전 체크포인트가 Finalized됩니다. 이를 'Supermajority Link'라고 합니다.");
      } else if (step === 100) {
        actions.updateBlocks((blocks) =>
          blocks.map((b, i) => ({
            ...b,
            status: i < blocks.length - 1 ? "finalized" : "justified",
          }))
        );
        actions.setStep(5, "🎉 [FINALIZED!] Block 0, 1, 2가 최종 확정되었습니다! 평균 확정 시간: 12-15분 (2 Epoch + 전파 시간)");
        audio.playFinalize();
      } else if (step === 102) {
        actions.setStep(5, "🔐 [경제적 최종성] Finalized 블록을 되돌리려면 전체 스테이크의 1/3 이상을 슬래싱해야 합니다. 현재 기준 약 $30B 이상의 손실이 필요합니다.");
      }

      // ========================================
      // PHASE 8: 슬래싱 시나리오 (Steps 105-125)
      // ========================================
      else if (step === 106) {
        actions.setStep(4, "━━━ ⚠️ 슬래싱(Slashing) - 악의적 행동 처벌 ━━━");
      } else if (step === 108) {
        actions.setStep(4, "🚨 [이중 투표] V2가 같은 Slot에서 두 개의 다른 블록에 Attestation을 제출했습니다! 이는 'Double Voting' 슬래싱 조건입니다.");
        actions.setByzantineNode(2);
        audio.playOrphan();
      } else if (step === 110) {
        actions.setStep(4, "📝 [슬래싱 조건 2가지] 1) Double Voting: 같은 epoch에서 다른 target에 투표. 2) Surround Voting: 이전 투표를 감싸는 투표를 하는 것.");
      } else if (step === 112) {
        actions.setStep(4, "👀 [탐지] 다른 Validator나 감시자(Whistleblower)가 모순된 두 메시지를 발견합니다. 이 증거를 ProposerSlashing 또는 AttesterSlashing으로 제출합니다.");
      } else if (step === 114) {
        actions.setStep(4, "📢 [슬래싱 증거 제출] 슬래셔(Slasher)가 증거를 블록에 포함시킵니다. 증거 제출자는 슬래싱된 금액의 일부를 보상으로 받습니다.");
        audio.playOrphan();
      } else if (step === 116) {
        actions.setStep(4, "💸 [페널티] 초기 페널티: 1/32 ETH. 추가로 'Correlation Penalty' - 같은 시기에 슬래싱된 Validator가 많을수록 페널티 증가 (최대 전액 몰수).");
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            active: i !== 2,
          }))
        );
      } else if (step === 118) {
        actions.setStep(4, "⚡ [퇴출 프로세스] 슬래싱된 Validator는 약 36일(8192 Epoch) 후에 퇴출됩니다. 이 기간 동안 추가 페널티가 적용될 수 있습니다.");
      } else if (step === 120) {
        actions.setStep(4, "🚫 [퇴출 완료] V2가 Validator 집합에서 제거되었습니다. 남은 ETH는 출금 큐를 통해 반환됩니다 (Shanghai 업그레이드 이후 가능).");
        actions.setByzantineNode(-1);
        audio.playConfirm();
      }

      // ========================================
      // PHASE 9: 요약 (Steps 123-140)
      // ========================================
      else if (step === 124) {
        actions.setStep(5, "━━━ 📋 이더리움 PoS 핵심 정리 ━━━");
      } else if (step === 126) {
        actions.setStep(5, "✅ [Gasper] 이더리움 PoS = LMD GHOST(포크 선택) + Casper FFG(최종성). 두 프로토콜을 결합한 하이브리드 합의입니다.");
      } else if (step === 128) {
        actions.setStep(5, "✅ [블록 시간] 12초 고정 Slot. PoW의 확률적 ~13분과 달리 예측 가능한 블록 생성. 빈 Slot도 가능(제안자 오프라인 시).");
      } else if (step === 130) {
        actions.setStep(5, "✅ [위원회] 매 Slot마다 Validator들이 ~128명 위원회로 나뉩니다. 각 위원회가 Attestation을 집계하여 효율성을 높입니다.");
      } else if (step === 132) {
        actions.setStep(5, "✅ [최종성] ~12-15분. PoW Bitcoin의 확률적 ~60분(6확인)과 달리, 수학적으로 보장된 최종성. 되돌리려면 1/3 스테이크 소각 필요.");
      } else if (step === 134) {
        actions.setStep(5, "✅ [보안] 51% 공격이 아닌 '1/3 공격'. 전체 스테이크의 1/3 이상을 확보해야 체인을 공격할 수 있습니다.");
      } else if (step === 136) {
        actions.setStep(5, "🌱 [에너지] PoW 대비 99.95% 절감. 연간 ~0.01 TWh (이전 ~112 TWh). 탄소 발자국이 사실상 제로에 가깝습니다.");
      } else if (step === 140) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
