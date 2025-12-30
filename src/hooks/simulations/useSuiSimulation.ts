"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { Validator, Transaction, AudioActions, DagVertex } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useSuiSimulation(
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

    // Create Workers (left side) and Primaries (right side)
    const workers: Validator[] = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: new THREE.Vector3(-5.5, 2.5 - i * 1.2, 0),
      role: "worker" as const,
      vote: "none",
      active: true,
      name: `W${i}`,
    }));

    const primaries: Validator[] = Array.from({ length: 4 }, (_, i) => ({
      id: i + 4,
      position: new THREE.Vector3(-2, 2.5 - i * 1.2, 0),
      role: "primary" as const,
      vote: "none",
      active: true,
      name: `P${i}`,
    }));

    actions.setValidators([...workers, ...primaries]);

    let step = 0;
    let dagRound = 0;
    const vertices: DagVertex[] = [];
    let certificateCount = 0;

    intervalRef.current = setInterval(() => {
      step++;

      // ========================================
      // PHASE 1: Introduction (Steps 1-15)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "🌊 [Sui / Narwhal-Bullshark] 2022년 Mysten Labs가 개발. Diem(Libra) 출신 엔지니어들이 설계한 차세대 DAG 기반 합의 프로토콜입니다.");
      } else if (step === 3) {
        actions.setStep(1, "💫 [객체 중심 모델] Sui의 핵심 혁신: 트랜잭션이 소유한 객체(Owned Objects)만 접근하면 합의 없이 즉시 실행 가능(Fast Path). 공유 객체만 합의 필요.");
      } else if (step === 5) {
        actions.setStep(1, "📦 [Narwhal] 데이터 가용성 레이어. DAG 구조로 트랜잭션 배치를 조직하고, 합의와 데이터 전파를 분리하여 처리량을 극대화합니다.");
      } else if (step === 7) {
        actions.setStep(1, "🦈 [Bullshark] 합의 순서화 레이어. DAG의 Anchor(앵커) 버텍스를 통해 무메시지 순서화(Zero-message ordering)를 달성합니다.");
      } else if (step === 9) {
        actions.setStep(1, "👷 [Workers] 사용자 트랜잭션을 수집하고 배치로 묶습니다. 각 Primary에 여러 Worker가 있어 데이터 수집을 병렬화합니다.");
      } else if (step === 11) {
        actions.setStep(1, "👑 [Primaries] DAG 버텍스를 생성하고 인증서를 교환합니다. 2f+1 서명으로 인증서 생성. BFT 보장: f < n/3 비잔틴 허용.");
      }

      // ========================================
      // PHASE 2: Transaction Batching (Steps 13-30)
      // ========================================
      else if (step === 14) {
        actions.setStep(1, "━━━ 트랜잭션 배치 처리 ━━━");
      } else if (step === 16) {
        actions.setStep(1, "📥 대량의 트랜잭션이 도착 중...");
        const txs: Transaction[] = Array.from({ length: 12 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-8, 2.5 - (i % 4) * 1.2, 0),
          status: "pending",
          target: new THREE.Vector3(-5.5, 2.5 - (i % 4) * 1.2, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 18) {
        actions.setStep(1, "📨 W0이 트랜잭션을 수신 중...");
      } else if (step === 20) {
        actions.setStep(1, "📨 W1, W2, W3도 트랜잭션을 수신 중...");
        audio.playTx();
      } else if (step === 22) {
        actions.setTransactions([]);
        actions.setStep(1, "📦 Workers가 트랜잭션을 청크로 배치 처리");
        actions.updateValidators((vals) =>
          vals.map((v) => (v.role === "worker" ? { ...v, vote: "certify" as const } : v))
        );
        audio.playVote();
      } else if (step === 24) {
        actions.setStep(2, "📤 배치가 Primary 검증자에게 전송됨");
        actions.updateValidators((vals) =>
          vals.map((v) => (v.role === "primary" ? { ...v, vote: "certify" as const } : v))
        );
        audio.playVote();
      } else if (step === 26) {
        actions.setStep(2, "📊 각 배치에는 50-100+ 트랜잭션이 포함됩니다");
      }

      // ========================================
      // PHASE 3: DAG Round 1 (Steps 28-45)
      // ========================================
      else if (step === 29) {
        actions.setStep(2, "━━━ DAG 라운드 1 ━━━");
        dagRound = 1;
        actions.setDagRound(dagRound);
      } else if (step === 31) {
        actions.setStep(2, "🔷 Primaries가 배치로부터 DAG 버텍스를 생성합니다");
      } else if (step === 33) {
        actions.setStep(3, "📝 P0이 버텍스 v1-0을 생성 (45 txs)");
        vertices.push({
          id: "v-r1-p0",
          position: new THREE.Vector3(1, 2.5, 0),
          round: 1,
          author: 0,
          parents: [],
          status: "proposed",
          transactions: 45,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 35) {
        actions.setStep(3, "📝 P1이 버텍스 v1-1을 생성 (52 txs)");
        vertices.push({
          id: "v-r1-p1",
          position: new THREE.Vector3(2.5, 2.5, 0),
          round: 1,
          author: 1,
          parents: [],
          status: "proposed",
          transactions: 52,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 37) {
        actions.setStep(3, "📝 P2가 버텍스 v1-2를 생성 (38 txs)");
        vertices.push({
          id: "v-r1-p2",
          position: new THREE.Vector3(4, 2.5, 0),
          round: 1,
          author: 2,
          parents: [],
          status: "proposed",
          transactions: 38,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 39) {
        actions.setStep(3, "📝 P3가 버텍스 v1-3을 생성 (61 txs)");
        vertices.push({
          id: "v-r1-p3",
          position: new THREE.Vector3(5.5, 2.5, 0),
          round: 1,
          author: 3,
          parents: [],
          status: "proposed",
          transactions: 61,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 41) {
        actions.setStep(3, "✅ 라운드 1: 4개의 버텍스 생성 (총 196 txs)");
      } else if (step === 43) {
        actions.setStep(3, "📤 검증자들이 라운드 1 인증서를 교환합니다");
        vertices.forEach((v) => {
          if (v.round === 1) v.status = "certified";
        });
        certificateCount = 4;
        actions.setSuiCertificates(certificateCount);
        actions.setDagVertices([...vertices]);
        audio.playVote();
      }

      // ========================================
      // PHASE 4: DAG Round 2 (Steps 46-65)
      // ========================================
      else if (step === 46) {
        actions.setStep(3, "━━━ DAG 라운드 2 ━━━");
        dagRound = 2;
        actions.setDagRound(dagRound);
      } else if (step === 48) {
        actions.setStep(3, "🔗 라운드 2 버텍스들이 라운드 1 부모를 참조합니다");
      } else if (step === 50) {
        actions.setStep(3, "📐 DAG 구조: 각 버텍스 → 2f+1 부모");
      } else if (step === 52) {
        actions.setStep(3, "📝 P0이 v2-0을 생성 (부모: v1-3, v1-0, v1-1)");
        vertices.push({
          id: "v-r2-p0",
          position: new THREE.Vector3(1, 1.2, 0),
          round: 2,
          author: 0,
          parents: ["v-r1-p3", "v-r1-p0", "v-r1-p1"],
          status: "proposed",
          transactions: 48,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 54) {
        actions.setStep(3, "📝 P1이 v2-1을 생성 (부모: v1-0, v1-1, v1-2)");
        vertices.push({
          id: "v-r2-p1",
          position: new THREE.Vector3(2.5, 1.2, 0),
          round: 2,
          author: 1,
          parents: ["v-r1-p0", "v-r1-p1", "v-r1-p2"],
          status: "proposed",
          transactions: 55,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 56) {
        actions.setStep(3, "📝 P2가 v2-2를 생성 (부모: v1-1, v1-2, v1-3)");
        vertices.push({
          id: "v-r2-p2",
          position: new THREE.Vector3(4, 1.2, 0),
          round: 2,
          author: 2,
          parents: ["v-r1-p1", "v-r1-p2", "v-r1-p3"],
          status: "proposed",
          transactions: 42,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 58) {
        actions.setStep(3, "📝 P3가 v2-3을 생성 (부모: v1-2, v1-3, v1-0)");
        vertices.push({
          id: "v-r2-p3",
          position: new THREE.Vector3(5.5, 1.2, 0),
          round: 2,
          author: 3,
          parents: ["v-r1-p2", "v-r1-p3", "v-r1-p0"],
          status: "proposed",
          transactions: 67,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 60) {
        actions.setStep(3, "📤 라운드 2 인증서 교환 완료");
        vertices.forEach((v) => {
          if (v.round === 2) v.status = "certified";
        });
        certificateCount = 8;
        actions.setSuiCertificates(certificateCount);
        actions.setDagVertices([...vertices]);
        audio.playVote();
      } else if (step === 62) {
        actions.setStep(3, "📊 DAG 성장 중: 8개 버텍스, 총 408 txs");
      }

      // ========================================
      // PHASE 5: DAG Round 3 - Anchor (Steps 65-85)
      // ========================================
      else if (step === 66) {
        actions.setStep(4, "━━━ DAG 라운드 3 (앵커 라운드) ━━━");
        dagRound = 3;
        actions.setDagRound(dagRound);
      } else if (step === 68) {
        actions.setStep(4, "⚓ 라운드 3은 특별합니다: 앵커 버텍스 포함");
      } else if (step === 70) {
        actions.setStep(4, "🎯 앵커 = 순서화를 위한 결정론적 리더");
      } else if (step === 72) {
        actions.setStep(4, "⚓ P0이 앵커 버텍스 v3-0을 생성");
        vertices.push({
          id: "v-r3-p0",
          position: new THREE.Vector3(1, -0.1, 0),
          round: 3,
          author: 0,
          parents: ["v-r2-p3", "v-r2-p0", "v-r2-p1"],
          status: "committed",
          transactions: 51,
        });
        actions.setDagVertices([...vertices]);
        audio.playConfirm();
      } else if (step === 74) {
        actions.setStep(4, "📝 P1이 v3-1을 생성");
        vertices.push({
          id: "v-r3-p1",
          position: new THREE.Vector3(2.5, -0.1, 0),
          round: 3,
          author: 1,
          parents: ["v-r2-p0", "v-r2-p1", "v-r2-p2"],
          status: "certified",
          transactions: 44,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 76) {
        actions.setStep(4, "📝 P2가 v3-2를 생성");
        vertices.push({
          id: "v-r3-p2",
          position: new THREE.Vector3(4, -0.1, 0),
          round: 3,
          author: 2,
          parents: ["v-r2-p1", "v-r2-p2", "v-r2-p3"],
          status: "certified",
          transactions: 39,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 78) {
        actions.setStep(4, "📝 P3가 v3-3을 생성");
        vertices.push({
          id: "v-r3-p3",
          position: new THREE.Vector3(5.5, -0.1, 0),
          round: 3,
          author: 3,
          parents: ["v-r2-p2", "v-r2-p3", "v-r2-p0"],
          status: "certified",
          transactions: 58,
        });
        actions.setDagVertices([...vertices]);
        audio.playMine();
      } else if (step === 80) {
        certificateCount = 12;
        actions.setSuiCertificates(certificateCount);
        actions.setStep(4, "✅ 라운드 3 완료: 총 12개 버텍스");
      }

      // ========================================
      // PHASE 6: Bullshark Ordering (Steps 83-100)
      // ========================================
      else if (step === 84) {
        actions.setStep(4, "━━━ 불샤크 순서화 ━━━");
      } else if (step === 86) {
        actions.setStep(4, "🔍 확인 중: 앵커가 2f+1 지지를 받았나요?");
      } else if (step === 88) {
        actions.setStep(4, "✅ v3-0 (앵커)이 3/4 인증서를 보유");
        actions.setAnchorCommitted(true);
        audio.playConfirm();
      } else if (step === 90) {
        actions.setStep(4, "⚓ 앵커 확정됨! 순서화 시작...");
      } else if (step === 92) {
        actions.setStep(4, "🔗 인과적 순서화: 모든 조상이 이제 순서화됨");
      } else if (step === 94) {
        // Commit all vertices
        vertices.forEach((v) => {
          v.status = "committed";
        });
        actions.setDagVertices([...vertices]);
        actions.setStep(4, "✅ 12개의 모든 버텍스가 이제 결정론적 순서를 가짐");
        audio.playVote();
      } else if (step === 96) {
        actions.setStep(4, "📊 총: ~1 라운드에서 600+ 트랜잭션 순서화");
      }

      // ========================================
      // PHASE 7: Parallel Execution (Steps 99-115)
      // ========================================
      else if (step === 100) {
        actions.setStep(5, "━━━ 병렬 실행 ━━━");
      } else if (step === 102) {
        actions.setStep(5, "💡 Sui의 핵심 혁신: 객체 중심 모델");
        audio.playFinalize();
      } else if (step === 104) {
        actions.setStep(5, "⚡ 서로 다른 객체에 접근하는 트랜잭션 → 병렬 처리");
      } else if (step === 106) {
        actions.setStep(5, "🔓 전역 상태 잠금이 필요 없습니다!");
      } else if (step === 108) {
        actions.setStep(5, "⚡ 여러 코어에서 600+ txs 실행 중...");
      } else if (step === 110) {
        actions.setStep(5, "🚀 결과: 고성능 병렬 처리 달성!");
      }

      // ========================================
      // PHASE 8: Summary (Steps 113-130)
      // ========================================
      else if (step === 114) {
        actions.setStep(5, "━━━ Sui / Narwhal-Bullshark 기술 요약 ━━━");
      } else if (step === 116) {
        actions.setStep(5, "✅ [Narwhal DAG] 데이터 가용성 보장. 트랜잭션 배치를 DAG 구조로 조직. 합의와 데이터 전파 분리로 처리량 극대화.");
      } else if (step === 118) {
        actions.setStep(5, "✅ [Bullshark] 무메시지 순서화. 홀수 라운드의 Anchor가 2f+1 지지를 받으면 인과적으로 연결된 모든 버텍스가 순서화됩니다.");
      } else if (step === 120) {
        actions.setStep(5, "✅ [인증서] 각 버텍스가 2f+1 ECDSA 서명을 수집. 인증서가 있으면 버텍스 데이터가 2f+1 정직한 노드에 저장됨을 보장합니다.");
      } else if (step === 122) {
        actions.setStep(5, "✅ [Move 언어] Sui의 스마트 컨트랙트 언어. 객체 소유권 모델로 병렬 실행 가능. Rust 기반으로 안전한 자원 관리를 제공합니다.");
      } else if (step === 124) {
        actions.setStep(5, "✅ [성능] 고성능 병렬 처리(단일 객체 트랜잭션), 1초 미만 최종성. 합의 지연시간 ~500ms.");
      } else if (step === 126) {
        actions.setStep(5, "🌐 [생태계] Sui(Mysten Labs), Aptos(Diem 포크, Block-STM 병렬화), Linera(마이크로체인). Web3 게임과 DeFi에 적합합니다.");
      } else if (step === 130) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
