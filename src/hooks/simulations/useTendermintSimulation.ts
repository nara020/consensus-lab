"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useTendermintSimulation(
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

    // Create 4 validators in a circle
    const vals: Validator[] = [];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      vals.push({
        id: i,
        position: new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 2, 0),
        role: i === 0 ? "proposer" : "tendermintValidator",
        vote: "none",
        active: true,
        name: `V${i}`,
      });
    }
    actions.setValidators(vals);
    actions.setTendermintHeight(1);
    actions.setTendermintRound(0);

    let step = 0;
    const chainBlocks: ChainBlock[] = [];
    let height = 1;

    intervalRef.current = setInterval(() => {
      step++;

      // ========================================
      // PHASE 1: Introduction (Steps 1-8)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "🌐 [Tendermint BFT] 2014년 Jae Kwon이 설계한 BFT 합의 알고리즘. Cosmos SDK의 핵심 합의 엔진으로, 100+ 블록체인에서 사용됩니다.");
      } else if (step === 3) {
        actions.setStep(1, "💫 [Cosmos 생태계] Tendermint Core + Cosmos SDK + IBC(Inter-Blockchain Communication). 'Internet of Blockchains' 비전을 실현합니다.");
      } else if (step === 5) {
        actions.setStep(1, "👥 [검증자 셋] 4개의 검증자: V0~V3. 각 검증자는 스테이킹 기반 Voting Power를 보유합니다. Cosmos Hub는 175 검증자로 운영됩니다.");
      } else if (step === 7) {
        actions.setStep(1, "🛡️ [BFT 보장] f < n/3 비잔틴 허용. Voting Power 기준으로 1/3 미만이 악의적이면 안전합니다. DPoS와 결합하여 경제적 보안을 제공합니다.");
      } else if (step === 9) {
        actions.setStep(1, "📊 [Height & Round] 높이 1, 라운드 0: V0이 제안자. 제안자 = proposer_priority 기반 가중 라운드-로빈으로 선택됩니다.");
        actions.setTendermintRound(0);
        audio.playVote();
      }

      // ========================================
      // PHASE 2: First Block - Detailed Normal Flow (Steps 10-45)
      // ========================================
      else if (step === 11) {
        actions.setStep(1, "📥 트랜잭션이 네트워크에 도착합니다...");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[0].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 13) {
        actions.setTransactions([]);
        actions.setStep(1, "📨 제안자 V0이 트랜잭션을 수신합니다");
      } else if (step === 15) {
        actions.setStep(2, "━━━ PROPOSE (제안) 단계 ━━━");
      } else if (step === 17) {
        actions.setStep(2, "📝 V0이 트랜잭션을 포함한 블록 제안서를 생성합니다");
        actions.setCurrentBlock({
          id: "proposed-block-1",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 19) {
        actions.setStep(2, "📡 블록 제안서가 모든 검증자에게 전파됩니다");
      } else if (step === 21) {
        actions.setStep(2, "🔍 각 검증자가 제안된 블록을 검증 중...");
      } else if (step === 23) {
        actions.setStep(3, "━━━ PREVOTE (사전투표) 단계 ━━━");
      } else if (step === 25) {
        actions.setStep(3, "✍️ 검증자들이 블록이 유효하면 PREVOTE에 서명합니다");
      } else if (step === 27) {
        actions.setStep(3, "✋ V1이 제안된 블록에 PREVOTE를 보냅니다");
        actions.setPrevoteCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 1 ? { ...v, vote: "prevote" as const } : v))
        );
        audio.playVote();
      } else if (step === 29) {
        actions.setStep(3, "✋ V2가 PREVOTE를 보냅니다 (+2/4)");
        actions.setPrevoteCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "prevote" as const } : v))
        );
        audio.playVote();
      } else if (step === 31) {
        actions.setStep(3, "✋ V3가 PREVOTE를 보냅니다 (+3/4)");
        actions.setPrevoteCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 0 ? { ...v, vote: "prevote" as const } : v))
        );
        audio.playVote();
      } else if (step === 33) {
        actions.setStep(3, "✋ V0 (제안자)도 PREVOTE에 참여합니다 (+4/4)");
        actions.setPrevoteCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prevote" as const })));
        audio.playVote();
      } else if (step === 35) {
        actions.setStep(3, "✅ PREVOTE 완료: 4/4 (2/3+ = 3 필요)");
        actions.setCurrentBlock({
          id: "proposed-block-1",
          position: new THREE.Vector3(0, 0, 0),
          status: "prevoted",
          blockNumber: height,
          branch: 0,
        });
      } else if (step === 37) {
        actions.setStep(3, "🔒 LOCK 획득: 검증자들이 이제 이 블록에 잠금됩니다");
      } else if (step === 39) {
        actions.setStep(4, "━━━ PRECOMMIT (사전확정) 단계 ━━━");
      } else if (step === 41) {
        actions.setStep(4, "🤝 2/3+ PREVOTE를 확인한 검증자들이 이제 PRECOMMIT합니다");
      } else if (step === 43) {
        actions.setStep(4, "✅ V0이 PRECOMMIT을 보냅니다");
        actions.setPrecommitCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 0 ? { ...v, vote: "precommit" as const } : v))
        );
        audio.playVote();
      } else if (step === 45) {
        actions.setStep(4, "✅ V1이 PRECOMMIT을 보냅니다 (+2/4)");
        actions.setPrecommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "precommit" as const } : v))
        );
        audio.playVote();
      } else if (step === 47) {
        actions.setStep(4, "✅ V2가 PRECOMMIT을 보냅니다 (+3/4)");
        actions.setPrecommitCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "precommit" as const } : v))
        );
        audio.playVote();
      } else if (step === 49) {
        actions.setStep(4, "✅ V3가 PRECOMMIT을 보냅니다 (+4/4)");
        actions.setPrecommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "precommit" as const })));
        audio.playVote();
      } else if (step === 51) {
        actions.setStep(4, "✅ PRECOMMIT 완료: 4/4 (2/3+ = 3 필요)");
        actions.setCurrentBlock({
          id: "proposed-block-1",
          position: new THREE.Vector3(0, 0, 0),
          status: "precommitted",
          blockNumber: height,
          branch: 0,
        });
      } else if (step === 53) {
        actions.setStep(5, "🎉 블록 #1 확정됨! 높이 1 완료");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${height}`,
          position: new THREE.Vector3(-3 + (height - 1) * 1.8, -2.5, 0),
          status: "committed",
          blockNumber: height,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrevoteCount(0);
        actions.setPrecommitCount(0);
        height++;
        actions.setTendermintHeight(height);
      } else if (step === 55) {
        actions.setStep(5, "⚡ 즉각적 최종성: 재조직(Reorganization) 불가능!");
      }

      // ========================================
      // PHASE 3: Second Block - Round Robin Demo (Steps 56-80)
      // ========================================
      else if (step === 58) {
        actions.setStep(1, "━━━ 높이 2: 제안자 교체 ━━━");
      } else if (step === 60) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 1 ? "proposer" : "tendermintValidator",
            vote: "none",
          }))
        );
        actions.setStep(1, "🔄 V1이 새로운 제안자가 됩니다 (라운드-로빈)");
        actions.setTendermintRound(0);
        audio.playVote();
      } else if (step === 62) {
        actions.setStep(1, "🔁 라운드-로빈은 공정한 블록 생성을 보장합니다");
      } else if (step === 64) {
        actions.setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[1].position.clone(),
        }]);
        actions.setStep(1, "📥 블록 #2를 위한 새 트랜잭션 도착");
        audio.playTx();
      } else if (step === 66) {
        actions.setTransactions([]);
        actions.setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: height,
          branch: 0,
        });
        actions.setStep(2, "📝 V1이 블록 #2를 제안합니다");
        audio.playVote();
      } else if (step === 68) {
        actions.setPrevoteCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => ([0, 2].includes(i) ? { ...v, vote: "prevote" as const } : v))
        );
        actions.setStep(3, "⏳ PREVOTE 단계: V0, V2 투표 중...");
        audio.playVote();
      } else if (step === 70) {
        actions.setPrevoteCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prevote" as const })));
        actions.setStep(3, "✅ PREVOTE 완료: 4/4");
        actions.setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "prevoted",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 72) {
        actions.setPrecommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "precommit" as const } : v))
        );
        actions.setStep(4, "⏳ PRECOMMIT 단계 시작...");
        audio.playVote();
      } else if (step === 74) {
        actions.setPrecommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "precommit" as const })));
        actions.setStep(4, "✅ PRECOMMIT 완료: 4/4");
        actions.setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "precommitted",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 76) {
        actions.setStep(5, "🎉 블록 #2 확정됨!");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${height}`,
          position: new THREE.Vector3(-3 + (height - 1) * 1.8, -2.5, 0),
          status: "committed",
          blockNumber: height,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrevoteCount(0);
        actions.setPrecommitCount(0);
        height++;
        actions.setTendermintHeight(height);
      }

      // ========================================
      // PHASE 4: Timeout Scenario - Proposer Failure (Steps 80-120)
      // ========================================
      else if (step === 80) {
        actions.setStep(1, "━━━ 높이 3: 타임아웃 시나리오 ━━━");
      } else if (step === 82) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 2 ? "proposer" : "tendermintValidator",
            vote: "none",
            active: i !== 2, // V2 goes offline!
          }))
        );
        actions.setStep(1, "⚠️ V2가 다음 제안자이지만... 오프라인!");
        audio.playOrphan();
      } else if (step === 84) {
        actions.setByzantineNode(2);
        actions.setStep(1, "🔇 V2가 타임아웃 기간 내에 제안하지 못합니다");
      } else if (step === 86) {
        actions.setStep(2, "⏳ 제안을 기다리는 중... (타임아웃 카운팅)");
      } else if (step === 88) {
        actions.setStep(2, "⏳ 계속 기다리는 중... (ProposeTimeout = 3초)");
      } else if (step === 90) {
        actions.setStep(2, "⏰ 타임아웃! V2로부터 제안이 수신되지 않음");
        audio.playOrphan();
      } else if (step === 92) {
        actions.setStep(2, "📤 검증자들이 PREVOTE nil을 전파합니다 (유효한 블록 없음)");
      } else if (step === 94) {
        actions.setPrevoteCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 2 ? { ...v, vote: "prevote" as const } : v))
        );
        actions.setStep(3, "✋ V0, V1, V3가 PREVOTE nil을 보냅니다 (3/4)");
        audio.playVote();
      } else if (step === 96) {
        actions.setStep(3, "📊 2/3+ PREVOTE nil 수신 → PrevoteTimeout");
      } else if (step === 98) {
        actions.setPrecommitCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 2 ? { ...v, vote: "precommit" as const } : v))
        );
        actions.setStep(4, "✅ 검증자들이 PRECOMMIT nil을 보냅니다 (커밋 없음)");
        audio.playVote();
      } else if (step === 100) {
        actions.setStep(4, "📊 2/3+ PRECOMMIT nil → 라운드 실패, 다음 라운드로 이동");
      } else if (step === 102) {
        actions.setStep(1, "━━━ 높이 3, 라운드 1 ━━━");
        actions.setTendermintRound(1);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrevoteCount(0);
        actions.setPrecommitCount(0);
      } else if (step === 104) {
        actions.setStep(1, "🔄 라운드 증가: V3가 새로운 제안자가 됩니다!");
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 3 ? "proposer" : "tendermintValidator",
            vote: "none",
          }))
        );
        audio.playVote();
      } else if (step === 106) {
        actions.setStep(2, "📝 V3가 라운드 1에서 블록 #3을 제안합니다");
        actions.setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 108) {
        actions.setPrevoteCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 2 ? { ...v, vote: "prevote" as const } : v))
        );
        actions.setStep(3, "✋ PREVOTE: V0, V1, V3 투표 (V2는 여전히 오프라인)");
        audio.playVote();
      } else if (step === 110) {
        actions.setStep(3, "✅ 3/4 PREVOTE 수신 (V2 없이도 2/3+ 달성!)");
        actions.setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "prevoted",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 112) {
        actions.setPrecommitCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i !== 2 ? { ...v, vote: "precommit" as const } : v))
        );
        actions.setStep(4, "✅ PRECOMMIT: 3/4 투표 (BFT 성공!)");
        audio.playVote();
      } else if (step === 114) {
        actions.setStep(4, "✅ 3/4 PRECOMMIT (2/3+ 달성!) → 블록 확정 가능");
        actions.setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "precommitted",
          blockNumber: height,
          branch: 0,
        });
      } else if (step === 116) {
        actions.setStep(5, "🎉 V2 장애에도 불구하고 블록 #3 확정됨!");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        actions.setByzantineNode(-1);
        const newBlock: ChainBlock = {
          id: `block-${height}`,
          position: new THREE.Vector3(-3 + (height - 1) * 1.8, -2.5, 0),
          status: "committed",
          blockNumber: height,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrevoteCount(0);
        actions.setPrecommitCount(0);
        height++;
        actions.setTendermintHeight(height);
      } else if (step === 118) {
        actions.setStep(5, "🛡️ BFT 속성: f=1 장애에도 네트워크 계속 작동!");
      }

      // ========================================
      // PHASE 5: Recovery & 4th Block (Steps 120-140)
      // ========================================
      else if (step === 122) {
        actions.setStep(1, "━━━ 높이 4: V2 복구 ━━━");
      } else if (step === 124) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 0 ? "proposer" : "tendermintValidator",
            vote: "none",
            active: true, // V2 comes back!
          }))
        );
        actions.setStep(1, "✅ V2가 다시 온라인! 놓친 블록들을 동기화합니다");
        audio.playConfirm();
      } else if (step === 126) {
        actions.setStep(1, "👑 V0이 높이 4의 제안자가 됩니다");
        actions.setTendermintRound(0);
      } else if (step === 128) {
        actions.setCurrentBlock({
          id: "proposed-block-4",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: height,
          branch: 0,
        });
        actions.setStep(2, "📝 V0이 블록 #4를 제안합니다");
        audio.playVote();
      } else if (step === 130) {
        actions.setPrevoteCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prevote" as const })));
        actions.setStep(3, "✅ 4명의 검증자 모두 PREVOTE");
        actions.setCurrentBlock({
          id: "proposed-block-4",
          position: new THREE.Vector3(0, 0, 0),
          status: "prevoted",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 132) {
        actions.setPrecommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "precommit" as const })));
        actions.setStep(4, "✅ 4명의 검증자 모두 PRECOMMIT");
        actions.setCurrentBlock({
          id: "proposed-block-4",
          position: new THREE.Vector3(0, 0, 0),
          status: "precommitted",
          blockNumber: height,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 134) {
        actions.setStep(5, "🎉 블록 #4 확정됨! 네트워크 완전 복구");
        audio.playFinalize();

        actions.setCurrentBlock(null);
        const newBlock: ChainBlock = {
          id: `block-${height}`,
          position: new THREE.Vector3(-3 + (height - 1) * 1.8, -2.5, 0),
          status: "committed",
          blockNumber: height,
          branch: 0,
        };
        chainBlocks.push(newBlock);
        actions.setBlocks([...chainBlocks]);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "none" as const })));
        actions.setPrevoteCount(0);
        actions.setPrecommitCount(0);
      }

      // ========================================
      // PHASE 6: Summary (Steps 138-150)
      // ========================================
      else if (step === 138) {
        actions.setStep(5, "━━━ TENDERMINT BFT 기술 요약 ━━━");
      } else if (step === 140) {
        actions.setStep(5, "✅ [3-Phase] Propose → Prevote → Precommit. PBFT를 블록체인에 최적화. 2/3+ voting power 필요. O(n²) 메시지 복잡도.");
      } else if (step === 142) {
        actions.setStep(5, "✅ [Proposer Selection] 가중 라운드-로빈. voting power가 높은 검증자가 더 자주 제안합니다. proposer_priority 알고리즘 사용.");
      } else if (step === 144) {
        actions.setStep(5, "✅ [타임아웃] ProposeTimeout, PrevoteTimeout, PrecommitTimeout. 장애 시 라운드 증가로 새 제안자 선출. 네트워크 적응형 타임아웃.");
      } else if (step === 146) {
        actions.setStep(5, "✅ [Locking] Prevote 후 블록에 'locked'. 다음 라운드에서도 locked 블록에만 투표. 포크 방지의 핵심 메커니즘입니다.");
      } else if (step === 148) {
        actions.setStep(5, "✅ [IBC] 즉각적 최종성으로 Inter-Blockchain Communication 가능. Light Client 증명으로 다른 체인의 상태를 검증합니다.");
      } else if (step === 152) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
