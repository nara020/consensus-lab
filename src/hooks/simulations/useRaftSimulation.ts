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
        actions.setStep(1, "📥 [Raft 합의] 2014년 스탠포드에서 개발. 클라이언트 요청이 리더에게 도착합니다. 모든 쓰기는 반드시 리더를 통해 처리됩니다 (Strong Leader).");
        actions.setTransactions([{
          id: "tx-1",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 3) {
        actions.setTransactions([]);
        actions.setStep(2, "📝 [로그 추가] 리더가 명령을 자신의 로그에 먼저 추가합니다. 각 로그 항목은 (term, index, command)를 포함합니다. 아직 커밋되지 않은 상태입니다.");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 5) {
        actions.setStep(3, "📤 [AppendEntries RPC] 리더가 모든 팔로워에게 로그 항목을 병렬로 전송합니다. 팔로워는 로그를 받아 자신의 로그에 추가하고 성공 응답을 보냅니다.");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(1);
        audio.playVote();
      } else if (step === 7) {
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 9) {
        actions.setStep(4, "✅ [과반수 달성] 3/4 노드가 복제 완료! Raft는 (n/2)+1 노드가 응답하면 커밋합니다. 4노드 클러스터에서는 3개, 5노드에서는 3개가 필요합니다.");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 11) {
        actions.setStep(5, "🎉 [커밋 완료] 로그 항목이 커밋되었습니다! 리더는 commitIndex를 증가시키고, 다음 AppendEntries에서 팔로워들에게 커밋 사실을 알립니다. 즉시 최종성 달성!");
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
        actions.setStep(1, "📥 [연속 처리] 새로운 요청이 도착합니다. Raft는 리더가 살아있는 한 빠르게 연속 처리할 수 있습니다. 리더는 주기적으로 Heartbeat를 보내 리더십을 유지합니다.");
        actions.setTransactions([{
          id: "tx-2",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 15) {
        actions.setTransactions([]);
        actions.setStep(2, "📝 [Term & Index] 로그 항목 #2 추가. 각 항목의 index는 증가하며, term은 리더 선출 때마다 증가합니다. term+index로 모든 로그를 고유하게 식별합니다.");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 16) {
        actions.setStep(3, "📤 팔로워들에게 복제 요청 중...");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 17) {
        actions.setStep(4, "✅ 과반수 복제 완료!");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 18) {
        actions.setStep(5, "🎉 [Safety 보장] 커밋된 로그는 절대 사라지지 않습니다. 새 리더는 반드시 가장 최신 커밋을 가진 노드 중에서 선출됩니다 (Election Restriction).");
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
        actions.setStep(1, "📥 [CFT vs BFT] Raft는 Crash Fault Tolerant - 노드 충돌만 허용. 악의적 노드(Byzantine)는 처리 못함. etcd, Consul, CockroachDB 등에서 사용됩니다.");
        actions.setTransactions([{
          id: "tx-3",
          position: new THREE.Vector3(-5, 1.5, 0),
          status: "pending",
          target: new THREE.Vector3(0, 1.5, 0),
        }]);
        audio.playTx();
      } else if (step === 22) {
        actions.setTransactions([]);
        actions.setStep(2, "📝 [로그 일관성] Raft의 Log Matching Property: 같은 index의 로그가 같은 term이면 그 이전의 모든 로그도 동일합니다.");
        log++;
        actions.setLogEntries(log);
        audio.playVote();
      } else if (step === 23) {
        actions.setStep(3, "📤 팔로워들에게 복제 요청 중...");
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "prepare" as const } : v))
        );
        actions.setReplicatedCount(2);
        audio.playVote();
      } else if (step === 24) {
        actions.setStep(4, "✅ 과반수 복제 완료!");
        actions.setReplicatedCount(3);
        actions.updateValidators((validators) =>
          validators.map((v) => (v.role === "follower" ? { ...v, vote: "commit" as const } : v))
        );
        audio.playVote();
      } else if (step === 25) {
        actions.setStep(5, "🎉 [요약] Raft: 이해하기 쉬운 합의 알고리즘. 리더 기반, 과반수 복제, 즉시 최종성. 지연시간: 2 RTT(왕복). CFT로 (n-1)/2 노드 장애 허용.");
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
