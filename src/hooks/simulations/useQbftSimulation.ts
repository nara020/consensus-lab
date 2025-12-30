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

      // ========================================
      // PHASE 1: Introduction (Steps 1-12)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "🏢 [QBFT/IBFT 2.0] Hyperledger Besu와 ConsenSys Quorum에서 사용하는 엔터프라이즈급 BFT 합의. IBFT(Istanbul BFT)의 개선 버전으로 2021년 Besu에 도입되었습니다.");
      } else if (step === 3) {
        actions.setStep(1, "📋 [QBFT란?] Quorum Byzantine Fault Tolerant - PBFT(Practical BFT)를 블록체인에 최적화한 프로토콜. 즉각적 최종성과 낮은 지연시간이 특징입니다.");
      } else if (step === 5) {
        actions.setStep(1, "🌐 [사용 사례] 프라이빗/컨소시엄 블록체인, 금융기관 간 결제 네트워크, 공급망 관리, 중앙은행 디지털 화폐(CBDC) 등 엔터프라이즈 환경에 적합합니다.");
      } else if (step === 7) {
        actions.setStep(1, "👥 [검증자 구성] 4개의 검증자: V0, V1, V2, V3. 실제 네트워크에서는 최소 4개(f=1 허용), 권장 7개(f=2 허용), 대규모는 21개 이상을 사용합니다.");
      } else if (step === 9) {
        actions.setStep(1, "🛡️ [BFT 보장] f < n/3 비잔틴 노드 허용. 비잔틴 = 악의적 행동(거짓 메시지 전송) 또는 임의의 장애. Safety와 Liveness 모두 보장합니다.");
      } else if (step === 11) {
        actions.setStep(1, "📊 [쿼럼 요구사항] n=4일 때 f=1 허용. 합의를 위해 2f+1=3 노드의 동의가 필요합니다. 블록 헤더에 검증자 서명이 포함됩니다.");
      }

      // ========================================
      // PHASE 2: First Block - Normal QBFT Flow (Steps 14-50)
      // ========================================
      else if (step === 14) {
        actions.setStep(1, "━━━ 블록 1: 정상적인 3-Phase 합의 ━━━");
      } else if (step === 16) {
        actions.setStep(1, "👑 [제안자 선택] V0이 라운드-로빈 방식으로 선택됩니다. 제안자 = (높이 + 라운드) mod n. 공정하고 예측 가능한 리더 순환입니다.");
        audio.playVote();
      } else if (step === 18) {
        actions.setStep(1, "📨 [트랜잭션 수신] 클라이언트 트랜잭션이 네트워크에 도착합니다. 제안자는 트랜잭션을 수집하고 블록을 구성합니다.");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[0].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 20) {
        actions.setTransactions([]);
        actions.setStep(2, "━━━ Phase 1: PRE-PREPARE ━━━");
      } else if (step === 22) {
        actions.setStep(2, "📝 [PRE-PREPARE] V0이 블록 제안을 생성합니다. 메시지: <PRE-PREPARE, height, round, block_hash, block>. 블록에는 트랜잭션, 타임스탬프, 부모 해시가 포함됩니다.");
        actions.setCurrentBlock({
          id: "proposed-block",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        audio.playVote();
      } else if (step === 24) {
        actions.setStep(2, "📡 [브로드캐스트] PRE-PREPARE 메시지가 모든 검증자에게 전파됩니다. 각 검증자는 제안자의 서명, 블록 유효성, 시퀀스 번호를 검증합니다.");
      } else if (step === 26) {
        actions.setStep(3, "━━━ Phase 2: PREPARE ━━━");
      } else if (step === 28) {
        actions.setStep(3, "🔍 [PREPARE] 블록이 유효하면 검증자가 PREPARE 투표를 보냅니다. <PREPARE, height, round, digest>. 이 단계에서 '블록을 봤다'는 것을 증명합니다.");
      } else if (step === 30) {
        actions.setStep(3, "✋ [V1 PREPARE] V1이 PREPARE 투표를 브로드캐스트합니다. (1/4)");
        actions.setPrepareCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 1 ? { ...v, vote: "prepare" as const } : v))
        );
        audio.playVote();
      } else if (step === 32) {
        actions.setStep(3, "✋ [V2 PREPARE] V2가 PREPARE 투표를 보냅니다. (2/4) PREPARE 메시지가 네트워크에 전파됩니다.");
        actions.setPrepareCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "prepare" as const } : v))
        );
        audio.playVote();
      } else if (step === 34) {
        actions.setStep(3, "✋ [V3 PREPARE] V3가 PREPARE 투표를 보냅니다. (3/4) 이제 2f+1=3 PREPARE를 수집했습니다!");
        actions.setPrepareCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        audio.playVote();
      } else if (step === 36) {
        actions.setStep(3, "✅ [PREPARED 상태] 2f+1 PREPARE 수집 완료! 이 시점에서 검증자는 '같은 라운드에 다른 블록이 PREPARED될 수 없다'는 것을 알게 됩니다.");
      } else if (step === 38) {
        actions.setStep(4, "━━━ Phase 3: COMMIT ━━━");
      } else if (step === 40) {
        actions.setStep(4, "🤝 [COMMIT] 2f+1 PREPARE를 확인한 검증자가 COMMIT 투표를 보냅니다. <COMMIT, height, round, digest, commit_seal>. commit_seal은 검증자의 서명입니다.");
      } else if (step === 42) {
        actions.setStep(4, "✅ [V0 COMMIT] V0이 COMMIT 서명을 보냅니다. (1/4)");
        actions.setCommitCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 0 ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 44) {
        actions.setStep(4, "✅ [V1 COMMIT] V1이 COMMIT 서명을 보냅니다. (2/4)");
        actions.setCommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 46) {
        actions.setStep(4, "✅ [V2, V3 COMMIT] V2, V3가 COMMIT 서명을 보냅니다. (4/4) 모든 검증자가 합의에 참여했습니다!");
        actions.setCommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "commit" as const })));
        audio.playVote();
      } else if (step === 48) {
        actions.setStep(4, "✅ [COMMITTED 상태] 2f+1 COMMIT 수집 완료! 블록 헤더의 extraData에 commit_seals가 포함되어 블록이 확정됩니다.");
      } else if (step === 50) {
        actions.setStep(5, "🎉 [Instant Finality] 블록 #1 확정! 3-phase 합의 완료. 포크가 불가능하므로 확인 횟수 없이 즉시 트랜잭션이 확정됩니다.");
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
      }

      // ========================================
      // PHASE 3: Second Block - Proposer Rotation (Steps 53-75)
      // ========================================
      else if (step === 54) {
        actions.setStep(1, "━━━ 블록 2: 제안자 교체 ━━━");
      } else if (step === 56) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 1 ? "proposer" : "validator",
            vote: "none",
          }))
        );
        actions.setStep(1, "🔄 V1이 새로운 제안자가 됩니다 (라운드-로빈 방식)");
        audio.playVote();
      } else if (step === 58) {
        actions.setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[1].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 60) {
        actions.setTransactions([]);
        actions.setCurrentBlock({
          id: "proposed-block-2",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        actions.setStep(2, "📝 V1이 블록 #2를 제안합니다 (PRE-PREPARE)");
        audio.playVote();
      } else if (step === 62) {
        actions.setPrepareCount(3);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        actions.setStep(3, "✅ PREPARE 단계 완료: 3/4 투표");
        audio.playVote();
      } else if (step === 64) {
        actions.setCommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "commit" as const })));
        actions.setStep(4, "✅ COMMIT 단계 완료: 4/4 투표");
        audio.playVote();
      } else if (step === 66) {
        actions.setStep(5, "🎉 블록 #2 확정됨!");
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
      }

      // ========================================
      // PHASE 4: Byzantine Scenario (Steps 70-100)
      // ========================================
      else if (step === 71) {
        actions.setStep(1, "━━━ 블록 3: 비잔틴 장애 시나리오 ━━━");
      } else if (step === 73) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 2 ? "proposer" : "validator",
            vote: "none",
          }))
        );
        actions.setStep(2, "👑 V2가 블록 #3의 제안자가 됩니다");
      } else if (step === 75) {
        actions.setStep(2, "⚠️ V3가 비잔틴(악의적/오프라인) 상태가 됩니다!");
        actions.setByzantineNode(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            active: i !== 3,
          }))
        );
        audio.playOrphan();
      } else if (step === 77) {
        actions.setStep(2, "🔇 V3가 충돌하는 메시지를 보내거나 침묵할 수 있습니다");
      } else if (step === 79) {
        actions.setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 0, 0),
          status: "pending",
          target: vals[2].position.clone(),
        }]);
        audio.playTx();
      } else if (step === 81) {
        actions.setTransactions([]);
        actions.setCurrentBlock({
          id: "proposed-block-3",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        actions.setStep(2, "📝 V2가 블록 #3을 제안합니다 (PRE-PREPARE)");
        audio.playVote();
      } else if (step === 83) {
        actions.setStep(3, "⏳ PREPARE 단계: V3가 비잔틴 상태 - 응답 없음!");
      } else if (step === 85) {
        actions.setPrepareCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 0 ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setStep(3, "✋ V0이 PREPARE 투표를 보냅니다 (1/4)");
        audio.playVote();
      } else if (step === 87) {
        actions.setPrepareCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setStep(3, "✋ V1이 PREPARE 투표를 보냅니다 (2/4)");
        audio.playVote();
      } else if (step === 89) {
        actions.setPrepareCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setStep(3, "✋ V2가 PREPARE 투표를 보냅니다 (3/4) - V3는 침묵!");
        audio.playVote();
      } else if (step === 91) {
        actions.setStep(3, "✅ PREPARE: 3/4 투표 (V3 없이도 2f+1 달성!)");
      } else if (step === 93) {
        actions.setStep(4, "🛡️ COMMIT 단계: 비잔틴 장애를 허용하며 진행 중...");
      } else if (step === 95) {
        actions.setCommitCount(1);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i === 0 ? { ...v, vote: "commit" as const } : v))
        );
        actions.setStep(4, "✅ V0이 COMMIT 투표를 보냅니다");
        audio.playVote();
      } else if (step === 97) {
        actions.setCommitCount(2);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 1 ? { ...v, vote: "commit" as const } : v))
        );
        actions.setStep(4, "✅ V1이 COMMIT 투표를 보냅니다 (+2)");
        audio.playVote();
      } else if (step === 99) {
        actions.setCommitCount(3);
        actions.updateValidators((validators) =>
          validators.map((v, i) => (i <= 2 ? { ...v, vote: "commit" as const } : v))
        );
        actions.setStep(4, "✅ V2가 COMMIT 투표를 보냅니다 (+3) - V3는 여전히 침묵!");
        audio.playVote();
      } else if (step === 101) {
        actions.setStep(4, "✅ COMMIT: 비잔틴 노드에도 불구하고 3/4 투표 달성!");
      } else if (step === 103) {
        actions.setStep(5, "🛡️ 블록 #3 확정됨! BFT 성공!");
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
      } else if (step === 105) {
        actions.setStep(5, "💪 비잔틴 V3에도 불구하고 네트워크가 계속 작동합니다!");
      }

      // ========================================
      // PHASE 5: Recovery - Byzantine Rejoins (Steps 108-130)
      // ========================================
      else if (step === 109) {
        actions.setStep(1, "━━━ 블록 4: 비잔틴 노드 복구 ━━━");
      } else if (step === 111) {
        actions.setStep(1, "🔌 V3가 다시 온라인에 접속합니다 (오프라인이었을 뿐, 악의적이지 않았음)");
        actions.setByzantineNode(-1);
        actions.updateValidators((validators) =>
          validators.map((v) => ({
            ...v,
            active: true,
            vote: "none",
          }))
        );
        audio.playConfirm();
      } else if (step === 113) {
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            role: i === 3 ? "proposer" : "validator",
          }))
        );
        actions.setStep(1, "🔄 V3가 제안자가 됩니다 (라운드-로빈 계속 진행)");
      } else if (step === 115) {
        actions.setCurrentBlock({
          id: "proposed-block-4",
          position: new THREE.Vector3(0, 0, 0),
          status: "proposed",
          blockNumber: chainBlocks.length + 1,
          branch: 0,
        });
        actions.setStep(2, "📝 V3가 블록 #4를 제안합니다");
        audio.playVote();
      } else if (step === 117) {
        actions.setPrepareCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "prepare" as const })));
        actions.setStep(3, "✅ 모든 검증자가 PREPARE 투표 (4/4) - 완전한 참여!");
        audio.playVote();
      } else if (step === 119) {
        actions.setCommitCount(4);
        actions.updateValidators((validators) => validators.map((v) => ({ ...v, vote: "commit" as const })));
        actions.setStep(4, "✅ 모든 검증자가 COMMIT 투표 (4/4)");
        audio.playVote();
      } else if (step === 121) {
        actions.setStep(5, "🎉 블록 #4 확정됨! 네트워크 완전 복구!");
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
      }

      // ========================================
      // PHASE 6: Summary (Steps 125-145)
      // ========================================
      else if (step === 126) {
        actions.setStep(5, "━━━ QBFT/IBFT 2.0 기술 요약 ━━━");
      } else if (step === 128) {
        actions.setStep(5, "✅ [3-Phase] PRE-PREPARE(리더 제안) → PREPARE(블록 확인) → COMMIT(최종 서명). PBFT 기반으로 O(n²) 메시지 복잡도입니다.");
      } else if (step === 130) {
        actions.setStep(5, "✅ [쿼럼] 2f+1 투표 필요. n=4→3, n=7→5, n=21→15. 블록 헤더에 commit_seals(ECDSA 서명)이 포함됩니다.");
      } else if (step === 132) {
        actions.setStep(5, "✅ [BFT 보장] f < n/3 비잔틴 허용. Safety: 정직한 노드는 같은 높이에 다른 블록을 커밋하지 않음. Liveness: 네트워크가 동기화되면 진행 보장.");
      } else if (step === 134) {
        actions.setStep(5, "✅ [라운드 변경] 제안자 장애 시 Round-Change 프로토콜로 다음 제안자 선출. 타임아웃 기반 장애 감지(예: 10초).");
      } else if (step === 136) {
        actions.setStep(5, "✅ [Instant Finality] 블록 확정 즉시 최종성. PoW처럼 6 확인 대기 불필요. 금융 거래에 적합합니다.");
      } else if (step === 138) {
        actions.setStep(5, "✅ [생태계] Hyperledger Besu, ConsenSys Quorum, GoQuorum에서 프로덕션 사용. 은행, 공급망, CBDC 파일럿에 채택되었습니다.");
      } else if (step === 142) {
        cleanup();
        actions.setPhase("complete");
      }
    }, QBFT_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
