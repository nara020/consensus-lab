"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// CONSTANTS
// ==========================================
const _K_SAMPLE_SIZE = 20;  // Number of peers to sample
const _ALPHA_THRESHOLD = 14; // Quorum threshold
const BETA_DECISION = 20;   // Consecutive successes needed
void _K_SAMPLE_SIZE; // Parameter reference for documentation
void _ALPHA_THRESHOLD; // Parameter reference for documentation

// ==========================================
// HOOK
// ==========================================
export function useAvalancheSimulation(
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

    // Create nodes in a grid (simplified from real network of 1000+)
    const nodeCount = 16;
    const vals: Validator[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      vals.push({
        id: i,
        position: new THREE.Vector3(-3 + col * 2, 2 - row * 1.3, 0),
        role: "avalancheNode",
        vote: "none",
        active: true,
        name: `N${i}`,
      });
    }
    actions.setValidators(vals);

    // Initialize confidence array (all start at 50%, representing conflict)
    const initialConfidence = Array(nodeCount).fill(50);
    const initialDecided = Array(nodeCount).fill(false);
    actions.setAvalancheConfidence(initialConfidence);
    actions.setAvalancheDecided(initialDecided);
    actions.setNetworkConfidence(50);

    let step = 0;
    let queryRound = 0;
    let consecutiveSuccess = 0;
    const confidence = [...initialConfidence];
    const decided = [...initialDecided];

    // Create two conflicting blocks
    const conflictA: ChainBlock = {
      id: "block-A",
      position: new THREE.Vector3(-5.5, -2.5, 0),
      status: "queried",
      blockNumber: 1,
      branch: 0,
    };
    const conflictB: ChainBlock = {
      id: "block-B",
      position: new THREE.Vector3(5.5, -2.5, 0),
      status: "queried",
      blockNumber: 1,
      branch: 1,
    };

    intervalRef.current = setInterval(() => {
      step++;

      // ========================================
      // PHASE 1: Introduction (Steps 1-15)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "❄️ [Avalanche Consensus] 2018년 Cornell 연구팀(Team Rocket)이 발표한 혁신적인 합의 프로토콜. 확률적 샘플링으로 O(log n) 메시지 복잡도를 달성합니다.");
      } else if (step === 3) {
        actions.setStep(1, "🔄 [Snowball Protocol] Slush → Snowflake → Snowball → Avalanche 순으로 진화. 반복 무작위 샘플링과 양성 피드백 루프로 합의에 수렴합니다.");
      } else if (step === 5) {
        actions.setStep(1, "👥 [네트워크 규모] 시뮬레이션: 16개 노드. 실제 Avalanche: 1,200+ 검증자. 리더 없이 모든 노드가 동등하게 참여합니다(Leaderless).");
      } else if (step === 7) {
        actions.setStep(1, "📊 [핵심 파라미터] k=20(샘플 크기), α=14(쿼럼 임계값, 70%), β=20(결정 임계값). 이 파라미터로 안전성과 활성을 수학적으로 보장합니다.");
      } else if (step === 9) {
        actions.setStep(1, "⚠️ [충돌 감지] 두 개의 충돌하는 트랜잭션(Double Spend 시도)이 감지되었습니다! 네트워크가 하나를 선택해야 합니다.");
        actions.setBlocks([conflictA, conflictB]);
        audio.playTx();
      } else if (step === 11) {
        actions.setStep(1, "🔴 [Virtuous vs Rogue] 블록 A(virtuous) vs 블록 B(rogue). DAG 기반 트랜잭션 그래프에서 충돌이 해결됩니다.");
      } else if (step === 13) {
        actions.setStep(1, "📊 [초기 상태] 50/50 분할. 네트워크 지연으로 다른 노드가 다른 트랜잭션을 먼저 봤을 수 있습니다. 'Metastable' 상태입니다.");
        // Color half nodes differently to show conflict
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            vote: i < 8 ? "query" as const : "response" as const,
          }))
        );
      }

      // ========================================
      // PHASE 2: Snowball Protocol Explanation (Steps 15-25)
      // ========================================
      else if (step === 16) {
        actions.setStep(2, "━━━ 스노우볼 프로토콜 ━━━");
      } else if (step === 18) {
        actions.setStep(2, "🔄 각 노드가 k개의 무작위 피어를 반복적으로 샘플링합니다");
      } else if (step === 20) {
        actions.setStep(2, "✅ α개 이상의 피어가 같은 값을 선호하면 → 선호도 전환");
      } else if (step === 22) {
        actions.setStep(2, "📊 연속 동의에 대한 '신뢰도 카운터'를 추적합니다");
      } else if (step === 24) {
        actions.setStep(2, "🎯 카운터가 β에 도달하면 → 결정(최종 확정)");
      }

      // ========================================
      // PHASE 3: First Query Rounds - Slow Start (Steps 26-50)
      // ========================================
      else if (step === 27) {
        actions.setStep(2, "━━━ 쿼리 라운드 1 ━━━");
        queryRound = 1;
        actions.setAvalancheQueryRound(queryRound);
        audio.playVote();
      } else if (step === 29) {
        actions.setStep(2, "🔍 각 노드가 k=20개의 무작위 피어를 샘플링 중...");
      } else if (step === 31) {
        actions.setStep(2, "📊 N0 쿼리: 11개는 A 선호, 9개는 B 선호");
        // Slight shift toward A
        for (let i = 0; i < 4; i++) {
          confidence[i] = Math.min(100, confidence[i] + 3);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
      } else if (step === 33) {
        actions.setStep(2, "📊 N5 쿼리: 12개는 A 선호, 8개는 B 선호");
        for (let i = 4; i < 8; i++) {
          confidence[i] = Math.min(100, confidence[i] + 4);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        audio.playVote();
      } else if (step === 35) {
        actions.setStep(2, "✅ 라운드 1 완료: A에 대한 약간의 선호도 형성 중");
        consecutiveSuccess = 1;
      } else if (step === 37) {
        actions.setStep(2, "━━━ 쿼리 라운드 2 ━━━");
        queryRound = 2;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 39) {
        actions.setStep(2, "🔄 더 많은 노드가 쿼리 중... 선호도가 변화하고 있습니다");
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 2 + Math.random() * 3);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        audio.playVote();
      } else if (step === 41) {
        consecutiveSuccess = 2;
        actions.setStep(2, `📊 스노우볼 카운터: ${consecutiveSuccess}/${BETA_DECISION}`);
      } else if (step === 43) {
        actions.setStep(2, "━━━ 쿼리 라운드 3 ━━━");
        queryRound = 3;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 45) {
        actions.setStep(2, "📈 네트워크가 블록 A 쪽으로 기울기 시작...");
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 3 + Math.random() * 2);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        // Update validator visuals
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            vote: confidence[i] > 60 ? "response" as const : "query" as const,
          }))
        );
        audio.playVote();
      } else if (step === 47) {
        consecutiveSuccess = 3;
        actions.setStep(3, `📊 스노우볼 카운터: ${consecutiveSuccess}/${BETA_DECISION}`);
      }

      // ========================================
      // PHASE 4: Convergence Phase (Steps 50-90)
      // ========================================
      else if (step === 50) {
        actions.setStep(3, "━━━ 수렴 단계 ━━━");
      } else if (step === 52) {
        actions.setStep(3, "📈 더 많은 노드가 A를 선호하면, 샘플링이 더 많은 A 투표를 반환합니다");
        queryRound = 4;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 54) {
        actions.setStep(3, "🔄 이것이 양성 피드백 루프를 만듭니다!");
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 4);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        consecutiveSuccess = 5;
        audio.playVote();
      } else if (step === 56) {
        actions.setStep(3, `📊 라운드 5: 스노우볼 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 5;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 58) {
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 5);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            vote: confidence[i] > 70 ? "response" as const : "query" as const,
          }))
        );
        audio.playVote();
      } else if (step === 60) {
        consecutiveSuccess = 7;
        actions.setStep(3, `📊 라운드 6-7: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 7;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 62) {
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 5);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        audio.playVote();
      } else if (step === 64) {
        consecutiveSuccess = 9;
        actions.setStep(3, `📊 라운드 8-9: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 9;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 66) {
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = Math.min(100, confidence[i] + 4);
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            vote: confidence[i] > 80 ? "certify" as const : "response" as const,
          }))
        );
        audio.playVote();
      } else if (step === 68) {
        consecutiveSuccess = 11;
        actions.setStep(3, `📊 라운드 10-11: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 11;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 70) {
        // First nodes start deciding
        for (let i = 0; i < 4; i++) {
          confidence[i] = 95;
          decided[i] = true;
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setAvalancheDecided([...decided]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.setStep(3, "🎯 첫 번째 노드들이 95% 신뢰도에 도달!");
        audio.playVote();
      } else if (step === 72) {
        consecutiveSuccess = 13;
        actions.setStep(4, `📊 라운드 12-13: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 13;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 74) {
        for (let i = 4; i < 8; i++) {
          confidence[i] = 95;
          decided[i] = true;
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setAvalancheDecided([...decided]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.updateValidators((validators) =>
          validators.map((v, i) => ({
            ...v,
            vote: decided[i] ? "certify" as const : "response" as const,
          }))
        );
        audio.playVote();
      } else if (step === 76) {
        consecutiveSuccess = 15;
        actions.setStep(4, `📊 라운드 14-15: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 15;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 78) {
        for (let i = 8; i < 12; i++) {
          confidence[i] = 95;
          decided[i] = true;
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setAvalancheDecided([...decided]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.setStep(4, "📊 12/16 노드가 블록 A에 결정함");
        audio.playVote();
      } else if (step === 80) {
        consecutiveSuccess = 17;
        actions.setStep(4, `📊 라운드 16-17: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 17;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 82) {
        for (let i = 12; i < 16; i++) {
          confidence[i] = 95;
          decided[i] = true;
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setAvalancheDecided([...decided]);
        actions.setNetworkConfidence(Math.round(confidence.reduce((a, b) => a + b, 0) / nodeCount));
        actions.updateValidators((validators) =>
          validators.map((v) => ({ ...v, vote: "certify" as const }))
        );
        actions.setStep(4, "📊 16개 노드 모두 결정 완료! β 대기 중...");
        audio.playVote();
      } else if (step === 84) {
        consecutiveSuccess = 19;
        actions.setStep(4, `📊 라운드 18-19: 카운터 = ${consecutiveSuccess}/${BETA_DECISION}`);
        queryRound = 19;
        actions.setAvalancheQueryRound(queryRound);
      } else if (step === 86) {
        consecutiveSuccess = 20;
        actions.setStep(4, `📊 라운드 20: 카운터 = ${consecutiveSuccess}/${BETA_DECISION} 🎯`);
        queryRound = 20;
        actions.setAvalancheQueryRound(queryRound);
        audio.playConfirm();
      }

      // ========================================
      // PHASE 5: Decision & Finality (Steps 88-110)
      // ========================================
      else if (step === 89) {
        actions.setStep(5, "━━━ 결정 임계값 도달! ━━━");
      } else if (step === 91) {
        actions.setStep(5, "🎉 β=20 연속 성공 달성!");
        audio.playFinalize();
      } else if (step === 93) {
        // All nodes decide on Block A
        for (let i = 0; i < nodeCount; i++) {
          confidence[i] = 100;
          decided[i] = true;
        }
        actions.setAvalancheConfidence([...confidence]);
        actions.setAvalancheDecided([...decided]);
        actions.setNetworkConfidence(100);
        actions.setStep(5, "📊 모든 노드: 블록 A에 100% 신뢰도");
      } else if (step === 95) {
        // Update blocks - A is accepted, B is rejected
        actions.setBlocks([
          { ...conflictA, status: "accepted" },
          { ...conflictB, status: "orphaned" },
        ]);
        actions.setStep(5, "✅ 블록 A 수락됨 | ❌ 블록 B 거부됨");
        audio.playOrphan();
      } else if (step === 97) {
        actions.setStep(5, "⚡ 1초 미만의 최종성 달성!");
      } else if (step === 99) {
        actions.setStep(5, "🌐 단일 리더 없음, 위원회 없음 - 순수 P2P!");
      }

      // ========================================
      // PHASE 6: Summary (Steps 102-120)
      // ========================================
      else if (step === 102) {
        actions.setStep(5, "━━━ Avalanche 기술 요약 ━━━");
      } else if (step === 104) {
        actions.setStep(5, "✅ [Repeated Sampling] 매 라운드 k=20 무작위 피어 샘플링. 전체 네트워크와 통신할 필요 없이 국소적 샘플로 전역 합의 달성.");
      } else if (step === 106) {
        actions.setStep(5, "✅ [Quorum α=14] 70% 이상이 같은 값을 선호하면 자신의 선호도를 전환. 이 임계값이 양성 피드백 루프를 만듭니다.");
      } else if (step === 108) {
        actions.setStep(5, "✅ [Decision β=20] 연속 20라운드 같은 결과 → 결정(최종). 실패 확률이 2^(-β)로 기하급수적으로 감소합니다.");
      } else if (step === 110) {
        actions.setStep(5, "✅ [확률적 Safety] 적대자가 1/3 미만이면 실패 확률이 무시할 수 있을 정도. 비잔틴 장애 허용과 유사한 보장을 제공합니다.");
      } else if (step === 112) {
        actions.setStep(5, "✅ [확장성] O(k log n) 메시지. 노드 수가 증가해도 지연시간이 거의 일정. PBFT의 O(n²)와 대비됩니다.");
      } else if (step === 114) {
        actions.setStep(5, "✅ [생태계] Avalanche C-Chain(EVM 호환), P-Chain(스테이킹), X-Chain(자산 교환). 1초 미만 최종성을 달성합니다.");
      } else if (step === 118) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
