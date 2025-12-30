"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, AudioActions } from "@/types/consensus";
import type { SimulationActions } from "../useSimulationState";
import { SIMULATION_INTERVAL_MS } from "@/constants/consensusInfo";

// ==========================================
// HOOK
// ==========================================
export function useOptimisticSimulation(
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

    // Create sequencer
    const validators: Validator[] = [
      { id: 0, position: new THREE.Vector3(-4, 2, 0), role: "sequencer", vote: "none", active: true, name: "Sequencer" },
    ];
    actions.setValidators(validators);

    let step = 0;
    const l2Blocks: ChainBlock[] = [];
    const l1Blocks: ChainBlock[] = [];

    intervalRef.current = setInterval(() => {
      step++;

      // ========================================
      // PHASE 1: Introduction (Steps 1-15)
      // ========================================
      if (step === 1) {
        actions.setStep(1, "🚀 [Optimistic Rollup] 2019년 Plasma Group이 제안한 L2 확장 솔루션. '낙관적'이란 트랜잭션이 기본적으로 유효하다고 가정한다는 의미입니다. Arbitrum(2021), Optimism(2021), Base(2023)가 대표적입니다.");
      } else if (step === 3) {
        actions.setStep(1, "💡 [핵심 원리] 'Fraud Proof' 방식 - 모든 트랜잭션을 유효하다고 가정하고, 무효한 상태 전환이 발생하면 누구나 이의를 제기해 증명할 수 있습니다. ZK Rollup의 Validity Proof와 대조됩니다.");
      } else if (step === 5) {
        actions.setStep(1, "⚡ [L2 실행 레이어] EVM 호환 가상머신에서 트랜잭션을 실행합니다. Optimism: OVM→Bedrock(EVM 등가), Arbitrum: AVM→Nitro(WASM 기반). 가스비가 L1의 1/10~1/100 수준입니다.");
      } else if (step === 7) {
        actions.setStep(1, "🔒 [L1 보안 상속] 이더리움 메인넷이 Data Availability(DA)와 최종성을 보장합니다. 트랜잭션 데이터는 Calldata 또는 EIP-4844 Blob으로 L1에 게시되어 누구나 상태를 재구성할 수 있습니다.");
      } else if (step === 9) {
        actions.setStep(1, "📋 [시퀀서(Sequencer)] 트랜잭션 순서를 결정하고 L2 블록을 생성하는 역할. 현재 대부분 중앙화되어 있으나, Optimism의 Fault Proof와 Arbitrum의 BOLD로 탈중앙화 진행 중입니다.");
      } else if (step === 11) {
        actions.setStep(1, "⏳ [이의 제기 기간] 7일(Arbitrum, Optimism 기본값). 이 기간 동안 Fraud Proof를 제출할 수 있습니다. 왜 7일? - L1 재구성 가능성 고려 + 충분한 검증 시간 확보 + 검열 저항성 보장.");
      }

      // ========================================
      // PHASE 2: First Batch - Normal Flow (Steps 14-45)
      // ========================================
      else if (step === 14) {
        actions.setStep(1, "━━━ 배치 1: 정상 운영 플로우 ━━━");
      } else if (step === 16) {
        actions.setStep(1, "📥 [트랜잭션 제출] 사용자가 L2 RPC를 통해 시퀀서에 트랜잭션을 제출합니다. 시퀀서는 'Soft Confirmation'으로 즉시 응답하지만, 이는 아직 L1에서 확정되지 않은 상태입니다.");
        const txs: Transaction[] = Array.from({ length: 8 }, (_, i) => ({
          id: `tx-${i}`,
          position: new THREE.Vector3(-7, 2 + (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(-4, 2, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 18) {
        actions.setStep(1, "📨 [Mempool] 시퀀서가 트랜잭션을 수신하고 정렬합니다. MEV(Miner Extractable Value) 추출이 가능한 지점이며, 공정한 순서 보장을 위한 연구가 진행 중입니다.");
      } else if (step === 20) {
        actions.setTransactions([]);
        actions.setStep(1, "📦 [배치 생성] 시퀀서가 트랜잭션들을 배치로 묶습니다. Arbitrum: ~0.25초마다 블록 생성. Optimism: ~2초마다 블록 생성. 배치는 여러 L2 블록을 포함할 수 있습니다.");
      } else if (step === 22) {
        actions.setStep(2, "━━━ L2 상태 전이 (State Transition) ━━━");
      } else if (step === 24) {
        actions.setStep(2, "⚙️ [STF 실행] State Transition Function이 트랜잭션을 순차적으로 실행합니다. pre_state + transactions → post_state. 새로운 상태 루트(State Root)가 계산됩니다.");
        const block: ChainBlock = {
          id: "l2-block-1",
          position: new THREE.Vector3(-2, 2, 0),
          status: "batched",
          blockNumber: 1,
          branch: 0,
          txCount: 8,
        };
        l2Blocks.push(block);
        actions.setL2Blocks([...l2Blocks]);
        audio.playMine();
      } else if (step === 26) {
        actions.setStep(2, "✅ [L2 블록 생성] 블록 #1 완료. Merkle Patricia Trie로 상태를 저장하며, 루트 해시만으로 전체 상태의 무결성을 검증할 수 있습니다.");
      } else if (step === 28) {
        actions.setStep(2, "📨 [연속 처리] 새로운 트랜잭션이 도착합니다. L2는 L1과 독립적으로 계속 블록을 생성하며, 주기적으로 L1에 배치를 제출합니다.");
        const txs: Transaction[] = Array.from({ length: 5 }, (_, i) => ({
          id: `tx-batch2-${i}`,
          position: new THREE.Vector3(-7, 2 + (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(-4, 2, 0),
        }));
        actions.setTransactions(txs);
        audio.playTx();
      } else if (step === 30) {
        actions.setTransactions([]);
        const block2: ChainBlock = {
          id: "l2-block-2",
          position: new THREE.Vector3(0, 2, 0),
          status: "batched",
          blockNumber: 2,
          branch: 0,
          txCount: 12,
        };
        l2Blocks.push(block2);
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(2, "✅ [블록 #2] L2 블록 생성. 여러 블록의 상태 전이가 하나의 'Output Root'로 압축되어 L1에 제출됩니다.");
        audio.playMine();
      } else if (step === 32) {
        actions.setStep(3, "━━━ L1 Data Availability Layer ━━━");
      } else if (step === 34) {
        actions.setStep(3, "📤 [State Commitment] 시퀀서가 Output Root를 L1의 OutputOracle 컨트랙트에 제출합니다. 이 루트는 L2 상태의 '약속(Commitment)'입니다.");
        l2Blocks.forEach(b => b.status = "submitted");
        actions.setL2Blocks([...l2Blocks]);
      } else if (step === 36) {
        const l1Block: ChainBlock = {
          id: "l1-block-1",
          position: new THREE.Vector3(-1, -2, 0),
          status: "proposed",
          blockNumber: 1,
          branch: 0,
        };
        l1Blocks.push(l1Block);
        actions.setL1Blocks([...l1Blocks]);
        actions.setStep(3, "✅ [DA 보장] 트랜잭션 데이터가 L1 Calldata에 게시됩니다. EIP-4844(Proto-Danksharding) 이후 Blob으로도 가능하며, 비용이 ~90% 절감됩니다.");
        audio.playConfirm();
      } else if (step === 38) {
        actions.setStep(3, "📝 [L1 저장 데이터] output_root(32bytes), timestamp, l2_block_number, transaction_batch(압축됨). 누구나 이 데이터로 L2 상태를 재구성할 수 있습니다.");
      }

      // ========================================
      // PHASE 3: Challenge Period (Steps 40-60)
      // ========================================
      else if (step === 41) {
        actions.setStep(3, "━━━ Challenge Period (이의 제기 기간) ━━━");
        actions.setChallengePeriod(7);
      } else if (step === 43) {
        actions.setStep(3, "⏳ [Permissionless Verification] 누구나 L1 데이터로 상태를 재계산하고, 불일치 발견 시 Fraud Proof를 제출할 수 있습니다. 검증자가 되기 위한 특별한 자격이 필요 없습니다.");
      } else if (step === 45) {
        actions.setChallengePeriod(6);
        actions.setStep(3, "📅 [1일차] 검증자(Verifier)들이 L1의 배치 데이터를 다운로드하고 트랜잭션을 재실행합니다. 계산된 state_root와 제출된 output_root를 비교합니다.");
      } else if (step === 47) {
        actions.setChallengePeriod(5);
        actions.setStep(3, "📅 [2일차] 검증 진행 중. 정직한 검증자가 1명이라도 있으면 시스템이 안전합니다(1-of-N Trust Model). 이것이 Optimistic의 핵심 가정입니다.");
      } else if (step === 49) {
        actions.setChallengePeriod(4);
        actions.setStep(3, "📅 [3-4일차] 상태 전이가 유효합니다. 대부분의 배치는 이의 없이 통과합니다. 사기 시도는 경제적으로 비합리적(보증금 손실)이기 때문입니다.");
      } else if (step === 51) {
        actions.setChallengePeriod(3);
        actions.setStep(3, "📅 [5일차] 'Watchtower' 서비스들이 24/7 모니터링합니다. 사용자 자산을 보호하기 위해 자동화된 검증 시스템이 운영됩니다.");
      } else if (step === 53) {
        actions.setChallengePeriod(2);
        actions.setStep(4, "📅 [6일차] 이의 없이 진행 중. L2→L1 출금(Withdrawal)은 이 기간이 지나야 완료됩니다. Fast Bridge 서비스로 즉시 출금도 가능합니다(유동성 제공자 필요).");
      } else if (step === 55) {
        actions.setChallengePeriod(1);
        actions.setStep(4, "📅 [7일차] 마지막 날. finalizationPeriodSeconds가 경과하면 누구나 finalize()를 호출하여 상태를 확정할 수 있습니다.");
      } else if (step === 57) {
        actions.setChallengePeriod(0);
        actions.setStep(5, "✅ [Challenge 종료] 이의 제기 기간 만료! Fraud Proof가 제출되지 않았으므로 상태가 유효하다고 간주됩니다.");
      } else if (step === 59) {
        actions.setStep(5, "🎉 [L1 Finality] 상태가 L1에서 확정되었습니다! 이 시점부터 L2→L1 출금이 실행 가능합니다. L1의 보안을 완전히 상속받은 'Hard Finality'입니다.");
        l2Blocks.forEach(b => b.status = "finalized");
        l1Blocks.forEach(b => b.status = "finalized");
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playFinalize();
      }

      // ========================================
      // PHASE 4: Second Batch - Fraud Scenario (Steps 62-100)
      // ========================================
      else if (step === 63) {
        actions.setStep(1, "━━━ 배치 2: Fraud Proof 시나리오 ━━━");
      } else if (step === 65) {
        actions.setStep(1, "⚠️ [악의적 시퀀서] 시퀀서가 손상되었다고 가정합니다. 중앙화된 시퀀서의 잠재적 위험: 검열, 순서 조작, 유효하지 않은 상태 제출. 이것이 Fraud Proof가 필요한 이유입니다.");
      } else if (step === 67) {
        const txs: Transaction[] = Array.from({ length: 5 }, (_, i) => ({
          id: `tx-fraud-${i}`,
          position: new THREE.Vector3(-7, 2 + (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(-4, 2, 0),
        }));
        actions.setTransactions(txs);
        actions.setStep(1, "📨 [정상 트랜잭션] 사용자들이 정상적인 트랜잭션을 제출합니다...");
        audio.playTx();
      } else if (step === 69) {
        actions.setTransactions([]);
        const fraudBlock: ChainBlock = {
          id: "l2-block-fraud",
          position: new THREE.Vector3(2.5, 2, 0),
          status: "batched",
          blockNumber: 3,
          branch: 0,
          txCount: 5,
        };
        l2Blocks.push(fraudBlock);
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(2, "📦 [블록 생성] 시퀀서가 L2 블록 #3을 생성합니다...");
        audio.playMine();
      } else if (step === 71) {
        actions.setStep(2, "⚠️ [Invalid State Transition] 시퀀서가 조작된 상태 루트를 생성합니다! 실제 실행 결과와 다른 post_state_root를 제출하려 합니다.");
      } else if (step === 73) {
        actions.setStep(2, "💀 [공격 예시] 시퀀서가 자신에게 100 ETH를 민팅하는 유효하지 않은 상태 전이를 포함시킵니다. EVM 규칙을 위반하는 연산입니다.");
      } else if (step === 75) {
        l2Blocks[l2Blocks.length - 1].status = "submitted";
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(3, "📤 [L1 제출] 유효하지 않은 output_root가 L1 OutputOracle에 제출됩니다. 아직 확정되지 않은 'pending' 상태입니다.");
      } else if (step === 77) {
        const l1Block2: ChainBlock = {
          id: "l1-block-2",
          position: new THREE.Vector3(2, -2, 0),
          status: "proposed",
          blockNumber: 2,
          branch: 0,
        };
        l1Blocks.push(l1Block2);
        actions.setL1Blocks([...l1Blocks]);
        audio.playConfirm();
      } else if (step === 79) {
        actions.setStep(3, "⏳ [Challenge 시작] 7일간의 이의 제기 기간이 시작됩니다. 이 기간이 보안의 핵심입니다.");
        actions.setChallengePeriod(7);
      } else if (step === 81) {
        actions.setChallengePeriod(6);
        actions.setStep(3, "📅 [검증 시작] 정직한 검증자가 배치 데이터를 다운로드하고 트랜잭션을 재실행합니다. 로컬에서 계산한 state_root와 제출된 것을 비교합니다.");
      } else if (step === 83) {
        actions.setChallengePeriod(5);
        actions.setStep(3, "🔍 [불일치 발견!] 검증자: 'computed_root ≠ submitted_root'. 상태 불일치가 감지되었습니다!");
      } else if (step === 85) {
        actions.setStep(3, "🚨 [Bisection Protocol] Arbitrum의 Interactive Fraud Proof가 시작됩니다. 불일치 구간을 이진 탐색으로 좁혀 단일 명령어(WASM opcode)까지 찾아냅니다.");
      } else if (step === 87) {
        actions.setStep(3, "📋 [Fraud Proof 준비] 검증자가 문제가 되는 상태 전이의 Merkle Proof와 실행 증거를 수집합니다. L1에서 검증 가능한 형태로 구성합니다.");
        actions.setFraudProofSubmitted(true);
        audio.playOrphan();
      } else if (step === 89) {
        actions.setStep(4, "━━━ Fraud Proof 검증 (On-chain) ━━━");
      } else if (step === 91) {
        actions.setStep(4, "📋 [증명 내용] Arbitrum: OneStepProof(단일 WASM 명령어 검증). Optimism: FaultDisputeGame(분쟁 게임으로 유효하지 않은 claim 식별).");
      } else if (step === 93) {
        actions.setStep(4, "⚖️ [L1 검증] FraudVerifier 컨트랙트가 제출된 증명을 검증합니다. 단일 명령어의 입력/출력이 EVM 규격과 일치하는지 확인합니다.");
        l2Blocks[l2Blocks.length - 1].status = "challenged";
        l1Blocks[l1Blocks.length - 1].status = "challenged";
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playVote();
      } else if (step === 95) {
        actions.setStep(4, "🔄 [On-chain 재실행] L1 컨트랙트가 분쟁 중인 단일 연산을 재실행합니다. 가스 비용: 수십만~수백만 gas. 전체 트랜잭션이 아닌 단일 opcode만 실행합니다.");
      } else if (step === 97) {
        actions.setStep(4, "✅ [Fraud 확정!] L1 실행 결과가 시퀀서의 claim과 불일치! 시퀀서가 잘못된 상태를 제출했음이 수학적으로 증명되었습니다.");
      } else if (step === 99) {
        actions.setStep(5, "🔄 [State Revert] 해당 배치의 상태가 되돌려집니다. 이전의 유효한 상태로 롤백되며, 사용자 자산은 보호됩니다.");
        l2Blocks.pop();
        l1Blocks.pop();
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        actions.setChallengePeriod(0);
        audio.playConfirm();
      } else if (step === 101) {
        actions.setStep(5, "💸 [Slashing] 악의적 시퀀서의 보증금(Bond)이 삭감됩니다! Arbitrum: ETH bond, Optimism: ETH collateral. 경제적 페널티로 공격을 억제합니다.");
      } else if (step === 103) {
        actions.setStep(5, "💰 [보상] Fraud Proof 제출자에게 슬래싱된 보증금의 일부가 보상으로 지급됩니다. 검증 인센티브를 제공하여 네트워크 보안을 강화합니다.");
        actions.setFraudProofSubmitted(false);
      }

      // ========================================
      // PHASE 5: Recovery - New Sequencer (Steps 106-130)
      // ========================================
      else if (step === 107) {
        actions.setStep(1, "━━━ 배치 3: 네트워크 복구 ━━━");
      } else if (step === 109) {
        actions.setStep(1, "🔄 [시퀀서 교체] 새로운 정직한 시퀀서가 역할을 인계받습니다. Sequencer rotation 또는 governance를 통해 새 시퀀서가 선정됩니다.");
        actions.updateValidators(() => [
          { id: 1, position: new THREE.Vector3(-4, 2, 0), role: "sequencer", vote: "none", active: true, name: "Sequencer 2" },
        ]);
        audio.playConfirm();
      } else if (step === 111) {
        actions.setStep(1, "✅ [상태 복구] 네트워크가 마지막으로 확정된 유효한 상태(블록 #2)부터 계속됩니다. L1에 기록된 데이터로 정확한 상태 복구가 가능합니다.");
      } else if (step === 113) {
        const txs: Transaction[] = Array.from({ length: 6 }, (_, i) => ({
          id: `tx-recovery-${i}`,
          position: new THREE.Vector3(-7, 2 + (i % 3 - 1) * 0.5, 0),
          status: "pending",
          target: new THREE.Vector3(-4, 2, 0),
        }));
        actions.setTransactions(txs);
        actions.setStep(1, "📨 [정상 운영 재개] 새로운 트랜잭션들이 도착합니다. Force Inclusion 메커니즘으로 사용자는 시퀀서를 우회해 직접 L1에 트랜잭션을 제출할 수도 있습니다.");
        audio.playTx();
      } else if (step === 115) {
        actions.setTransactions([]);
        const recoveryBlock: ChainBlock = {
          id: "l2-block-recovery",
          position: new THREE.Vector3(2.5, 2, 0),
          status: "batched",
          blockNumber: 3,
          branch: 0,
          txCount: 6,
        };
        l2Blocks.push(recoveryBlock);
        actions.setL2Blocks([...l2Blocks]);
        actions.setStep(2, "✅ [L2 블록 #3] 새 시퀀서가 유효한 블록을 생성합니다. 정직한 실행으로 올바른 state_root가 계산됩니다.");
        audio.playMine();
      } else if (step === 117) {
        l2Blocks[l2Blocks.length - 1].status = "submitted";
        actions.setL2Blocks([...l2Blocks]);
        const l1Block3: ChainBlock = {
          id: "l1-block-3",
          position: new THREE.Vector3(2, -2, 0),
          status: "proposed",
          blockNumber: 3,
          branch: 0,
        };
        l1Blocks.push(l1Block3);
        actions.setL1Blocks([...l1Blocks]);
        actions.setStep(3, "📤 [L1 제출] 올바른 output_root가 L1에 제출됩니다. 이전 사건과 동일한 검증 프로세스가 적용됩니다.");
        audio.playConfirm();
      } else if (step === 119) {
        actions.setChallengePeriod(7);
        actions.setStep(3, "⏳ [Challenge Period] 다시 7일간의 이의 제기 기간이 시작됩니다...");
      } else if (step === 121) {
        actions.setChallengePeriod(3);
        actions.setStep(3, "🔍 [검증 진행] 검증자들이 상태 전이를 확인 중... 이번에는 모든 것이 유효합니다.");
      } else if (step === 123) {
        actions.setChallengePeriod(0);
        actions.setStep(5, "✅ [최종 확정] Challenge Period 종료! 사기 없음 - 상태가 L1에서 확정되었습니다.");
        l2Blocks[l2Blocks.length - 1].status = "finalized";
        l1Blocks[l1Blocks.length - 1].status = "finalized";
        actions.setL2Blocks([...l2Blocks]);
        actions.setL1Blocks([...l1Blocks]);
        audio.playFinalize();
      }

      // ========================================
      // PHASE 6: Summary (Steps 126-145)
      // ========================================
      else if (step === 127) {
        actions.setStep(5, "━━━ Optimistic Rollup 기술 요약 ━━━");
      } else if (step === 129) {
        actions.setStep(5, "✅ [핵심 개념] 'Optimistic' = 유효하다고 가정 + Fraud Proof로 검증. ZK Rollup과 달리 암호학적 증명 없이 게임 이론적 보안 모델을 사용합니다.");
      } else if (step === 131) {
        actions.setStep(5, "✅ [성능] L2 실행: 빠르고 저렴한 트랜잭션(L1의 1/10~1/100 비용). EIP-4844 이후 Blob 사용으로 추가 비용 절감.");
      } else if (step === 133) {
        actions.setStep(5, "✅ [보안] L1 Security 상속: 이더리움 Validator가 DA와 Finality를 보장. 1-of-N Trust Model - 정직한 검증자 1명이면 충분합니다.");
      } else if (step === 135) {
        actions.setStep(5, "✅ [Trade-off] 7일 Challenge Period로 인한 출금 지연이 단점. Fast Bridge로 즉시 출금 가능하나 유동성 제공자 필요(수수료 발생).");
      } else if (step === 137) {
        actions.setStep(5, "✅ [비교] ZK Rollup: 즉시 출금, 높은 Prover 비용. Optimistic: 7일 출금 지연, 낮은 운영 비용. 각각의 장단점이 있습니다.");
      } else if (step === 139) {
        actions.setStep(5, "🌐 [생태계] Arbitrum(TVL 1위), Optimism(OP Stack), Base(Coinbase). 이더리움 L2 TVL의 대부분을 차지합니다.");
      } else if (step === 143) {
        cleanup();
        actions.setPhase("complete");
      }
    }, SIMULATION_INTERVAL_MS);

    return cleanup;
  }, [actions, audio, cleanup]);

  return { run, cleanup };
}
