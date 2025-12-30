import type { ConsensusMode } from "@/types/consensus";

// ==========================================
// DETAILED CONSENSUS INFORMATION FOR MODAL
// ==========================================

export interface ConsensusDetail {
  simulationSteps: string[];  // 시뮬레이션에서 보여주는 단계
  concept: string[];
  pros: string[];
  cons: string[];
  chains: string[];
  specs: { label: string; value: string }[];
  security: string;
  finality: string;
}

export const CONSENSUS_DETAILS: Record<ConsensusMode, ConsensusDetail> = {
  pow: {
    simulationSteps: [
      "1️⃣ 채굴자들이 각자 Nonce를 변경하며 해시 계산",
      "2️⃣ Target 이하의 해시를 찾으면 블록 발견!",
      "3️⃣ 네트워크 지연으로 Fork 발생 (여러 체인)",
      "4️⃣ 가장 긴 체인이 Main Chain으로 선택",
      "5️⃣ 짧은 체인의 블록은 Orphan(고아) 처리",
      "6️⃣ 6개 블록 확인 후 최종 확정",
    ],
    concept: [
      "🎯 목표: 특정 조건(Target)을 만족하는 해시 찾기",
      "⛏️ 방법: Nonce 값을 바꿔가며 SHA-256 해시 반복 계산",
      "🏆 보상: 가장 먼저 찾은 채굴자가 블록 보상 획득",
      "⛓️ 규칙: 가장 많은 작업량(긴 체인)이 정본",
    ],
    pros: [
      "검증된 보안성 (15년+ 운영)",
      "완전 탈중앙화 가능",
      "누구나 채굴 참여 가능",
    ],
    cons: [
      "높은 에너지 소비",
      "느린 블록 생성 (10분)",
      "확정까지 6블록 대기 필요",
    ],
    chains: ["Bitcoin", "Litecoin", "Dogecoin"],
    specs: [
      { label: "알고리즘", value: "SHA-256" },
      { label: "블록 시간", value: "~10분" },
      { label: "확정", value: "6블록 후" },
      { label: "난이도 조정", value: "2주마다" },
    ],
    security: "전체 해시파워의 51% 공격 필요",
    finality: "확률적 - 6블록 후 99.98% 확정",
  },

  pos: {
    simulationSteps: [
      "1️⃣ RANDAO로 무작위 시드 생성",
      "2️⃣ Validator가 BLS 서명 공개 (Reveal)",
      "3️⃣ 시드 + 스테이크 비율로 Proposer 선정",
      "4️⃣ 선정된 Proposer가 블록 제안",
      "5️⃣ Committee가 Attestation 투표",
      "6️⃣ 2/3+ 투표 시 Justified → Finalized",
    ],
    concept: [
      "🎰 Proposer 선정: 스테이크 비율에 따른 확률",
      "🎲 RANDAO: 조작 불가능한 난수 생성",
      "🗳️ Attestation: 위원회의 블록 검증 투표",
      "✅ Finality: 2/3+ 동의 시 확정 (되돌릴 수 없음)",
    ],
    pros: [
      "99.95% 에너지 절감",
      "경제적 보안 (Slashing)",
      "빠른 Finality (13분)",
    ],
    cons: [
      "최소 32 ETH 필요",
      "복잡한 프로토콜",
      "부자가 더 유리한 구조",
    ],
    chains: ["Ethereum", "Cardano", "Polkadot"],
    specs: [
      { label: "최소 스테이크", value: "32 ETH" },
      { label: "슬롯 시간", value: "12초" },
      { label: "에폭", value: "32 슬롯" },
      { label: "Finality", value: "2 에폭" },
    ],
    security: "공격 비용 > $26B (1/3 지분)",
    finality: "결정적 - 2 Epoch 후 확정",
  },

  raft: {
    simulationSteps: [
      "1️⃣ Leader Election: Term 시작, 투표",
      "2️⃣ Leader 선출 완료",
      "3️⃣ Client 요청 → Leader가 수신",
      "4️⃣ Log Entry를 모든 Follower에게 복제",
      "5️⃣ 과반수(>50%) ACK 수신",
      "6️⃣ Commit & Apply → 응답 반환",
    ],
    concept: [
      "👑 Leader-Follower 구조: 1명의 리더가 모든 결정",
      "📝 Log Replication: 리더가 팔로워에게 로그 복제",
      "✅ 과반수 동의: 50% 초과 동의 시 커밋",
      "💓 Heartbeat: 리더 생존 확인 (150ms 간격)",
    ],
    pros: [
      "이해하기 쉬운 알고리즘",
      "빠른 합의 속도",
      "강한 일관성 보장",
    ],
    cons: [
      "악의적 노드 대응 불가",
      "노드 수 확장 한계",
      "리더 병목 가능성",
    ],
    chains: ["Hyperledger Fabric", "etcd", "Consul"],
    specs: [
      { label: "장애 허용", value: "n/2 미만" },
      { label: "Heartbeat", value: "150ms" },
      { label: "최소 노드", value: "3개" },
      { label: "합의 시간", value: "수 ms" },
    ],
    security: "네트워크 내 신뢰 가정 필요",
    finality: "즉시 - Leader 승인 시 확정",
  },

  qbft: {
    simulationSteps: [
      "1️⃣ Round 시작: Proposer 지정 (Round-Robin)",
      "2️⃣ PRE-PREPARE: Proposer가 블록 제안",
      "3️⃣ PREPARE: 모든 노드가 블록 검증 후 투표",
      "4️⃣ 2/3+ PREPARE 수신 → COMMIT 단계",
      "5️⃣ COMMIT: 최종 확정 투표",
      "6️⃣ 2/3+ COMMIT → 블록 확정! (즉시 Finality)",
    ],
    concept: [
      "🔄 3단계 투표: PRE-PREPARE → PREPARE → COMMIT",
      "📐 Quorum: 2/3 이상 동의 필요 (N ≥ 3f+1)",
      "🛡️ Byzantine 허용: 33%까지 악의적 노드 허용",
      "⚡ 즉시 Finality: COMMIT 완료 = 확정 (Fork 없음)",
    ],
    pros: [
      "악의적 노드 33% 허용",
      "즉시 Finality",
      "예측 가능한 블록 시간",
    ],
    cons: [
      "노드 수 확장 한계 (~100)",
      "통신 비용 O(n²)",
      "허가형 네트워크 적합",
    ],
    chains: ["Hyperledger Besu", "GoQuorum"],
    specs: [
      { label: "장애 허용", value: "n/3 미만" },
      { label: "Quorum", value: "2f + 1" },
      { label: "최소 노드", value: "4개" },
      { label: "블록 시간", value: "1-5초" },
    ],
    security: "N ≥ 3f+1 노드로 33% Byzantine 허용",
    finality: "즉시 - Commit 완료 시 확정",
  },

  optimistic: {
    simulationSteps: [
      "1️⃣ L2에서 트랜잭션 실행 (Sequencer)",
      "2️⃣ 트랜잭션을 배치(Batch)로 묶음",
      "3️⃣ State Root를 L1에 제출",
      "4️⃣ 7일 Challenge Period 시작",
      "5️⃣ (선택) 누군가 Fraud Proof 제출 → 검증",
      "6️⃣ Challenge 없으면 → 최종 확정!",
    ],
    concept: [
      "🤞 낙관적 가정: 모든 트랜잭션이 유효하다고 가정",
      "📦 Batch 처리: 여러 트랜잭션을 묶어서 L1에 제출",
      "⏳ Challenge Period: 7일간 누구나 이의 제기 가능",
      "🚨 Fraud Proof: 잘못된 상태 증명 시 롤백",
    ],
    pros: [
      "높은 처리량 (10-100배)",
      "낮은 가스비",
      "EVM 완전 호환",
    ],
    cons: [
      "7일 출금 지연",
      "검증자 의존",
      "Sequencer 중앙화",
    ],
    chains: ["Arbitrum", "Optimism", "Base"],
    specs: [
      { label: "Challenge", value: "7일" },
      { label: "블록 시간", value: "~0.25초" },
      { label: "가스 절감", value: "90-99%" },
      { label: "최종성", value: "7일 후" },
    ],
    security: "1명의 정직한 검증자만 있으면 안전",
    finality: "L1 제출 후 7일",
  },

  zk: {
    simulationSteps: [
      "1️⃣ L2에서 트랜잭션 실행",
      "2️⃣ 트랜잭션을 배치(Batch)로 묶음",
      "3️⃣ ZK Proof 생성 시작 (수학적 증명)",
      "4️⃣ Proof 생성 완료 (수 분 소요)",
      "5️⃣ Proof + State Root를 L1에 제출",
      "6️⃣ L1에서 증명 검증 → 즉시 확정!",
    ],
    concept: [
      "🔐 Zero-Knowledge: 내용 공개 없이 유효성 증명",
      "📦 Batch 처리: 수천 개 트랜잭션을 하나의 증명으로",
      "✅ 수학적 검증: L1에서 증명만 확인하면 끝",
      "⚡ 즉시 Finality: 증명 검증 = 확정",
    ],
    pros: [
      "즉시 Finality",
      "강력한 보안",
      "높은 압축률",
    ],
    cons: [
      "증명 생성 비용 높음",
      "EVM 호환성 제한",
      "복잡한 수학",
    ],
    chains: ["zkSync", "StarkNet", "Polygon zkEVM"],
    specs: [
      { label: "증명 시간", value: "수 분" },
      { label: "검증 비용", value: "~500K gas" },
      { label: "압축률", value: "10-100배" },
      { label: "최종성", value: "즉시" },
    ],
    security: "수학적 증명 - 공격 불가능",
    finality: "L1 증명 검증 즉시",
  },

  ripple: {
    simulationSteps: [
      "1️⃣ 트랜잭션 제출",
      "2️⃣ UNL(신뢰 노드 목록) 노드들이 수신",
      "3️⃣ 1차 투표: 초기 합의 시도",
      "4️⃣ 2차 투표: 더 많은 노드 동의",
      "5️⃣ 80%+ 합의 달성",
      "6️⃣ Ledger 확정 (3-5초)",
    ],
    concept: [
      "📋 UNL: 각 노드가 신뢰하는 노드 목록",
      "🗳️ 반복 투표: 80%+ 동의할 때까지 반복",
      "⚡ 빠른 확정: 3-5초 내 Finality",
      "🏦 결제 최적화: 은행 간 송금에 특화",
    ],
    pros: [
      "빠른 Finality (3-5초)",
      "낮은 수수료",
      "에너지 효율적",
    ],
    cons: [
      "중앙화 우려",
      "UNL 관리 필요",
      "규제 불확실성",
    ],
    chains: ["XRP Ledger"],
    specs: [
      { label: "합의 임계값", value: "80%" },
      { label: "블록 시간", value: "3-5초" },
      { label: "Finality", value: "즉시" },
      { label: "수수료", value: "~0.00001 XRP" },
    ],
    security: "UNL 노드의 20% 이상 Byzantine 시 위험",
    finality: "즉시 - 80% 합의 시 확정",
  },

  tendermint: {
    simulationSteps: [
      "1️⃣ Round 시작: Proposer 지정",
      "2️⃣ PROPOSE: 블록 제안",
      "3️⃣ PREVOTE: 1차 투표 (2/3+ 필요)",
      "4️⃣ PRECOMMIT: 2차 투표 (2/3+ 필요)",
      "5️⃣ COMMIT: 블록 확정!",
      "6️⃣ Height 증가 → 다음 블록",
    ],
    concept: [
      "🔄 3단계 투표: Propose → Prevote → Precommit",
      "📐 2/3+ 동의: 각 단계마다 2/3 이상 투표 필요",
      "🔒 Locking: 안전성 보장 메커니즘",
      "⚡ 즉시 Finality: Precommit 완료 = 확정",
    ],
    pros: [
      "즉시 Finality (1-7초)",
      "검증된 BFT 구현",
      "Cosmos 생태계",
    ],
    cons: [
      "노드 수 확장 한계",
      "통신 복잡도 높음",
      "Validator 중앙화",
    ],
    chains: ["Cosmos Hub", "Terra", "Binance Chain"],
    specs: [
      { label: "장애 허용", value: "n/3 미만" },
      { label: "블록 시간", value: "1-7초" },
      { label: "Validator", value: "~150개" },
      { label: "Unbonding", value: "21일" },
    ],
    security: "2/3+ Validator가 정직해야 함",
    finality: "즉시 - Precommit 완료 시",
  },

  avalanche: {
    simulationSteps: [
      "1️⃣ 충돌하는 두 블록 발생",
      "2️⃣ 랜덤으로 k=20개 노드 샘플링",
      "3️⃣ 샘플 노드들에게 선호도 질의",
      "4️⃣ α=14개 이상 같은 답 → 선호도 변경",
      "5️⃣ 연속 성공 카운터 증가",
      "6️⃣ β=20 연속 성공 → 최종 결정!",
    ],
    concept: [
      "🎲 Random Sampling: 랜덤하게 k개 노드 선택",
      "📊 Snowball: 연속 성공 횟수 누적",
      "✅ 결정 조건: β회 연속으로 같은 답 받으면 확정",
      "⚡ 빠른 수렴: 반복 쿼리로 빠르게 합의",
    ],
    pros: [
      "Sub-second Finality",
      "높은 확장성",
      "낮은 에너지 소비",
    ],
    cons: [
      "확률적 보안",
      "파라미터 튜닝 필요",
      "새로운 기술",
    ],
    chains: ["Avalanche C-Chain"],
    specs: [
      { label: "샘플 크기 (k)", value: "20" },
      { label: "임계값 (α)", value: "14 (70%)" },
      { label: "결정 (β)", value: "20 연속" },
      { label: "Finality", value: "<1초" },
    ],
    security: "메타 안정성 - 빠른 수렴 보장",
    finality: "확률적 - <1초",
  },

  sui: {
    simulationSteps: [
      "1️⃣ Worker 노드가 트랜잭션 수집",
      "2️⃣ Primary가 DAG Vertex 생성",
      "3️⃣ Vertex를 다른 Primary에게 전파",
      "4️⃣ 2/3+ 서명 수집 → Certificate 생성",
      "5️⃣ Bullshark: Anchor 선정 & 순서 결정",
      "6️⃣ 병렬로 트랜잭션 실행 → 확정!",
    ],
    concept: [
      "🔷 DAG 구조: 블록 대신 Vertex의 그래프",
      "📜 Certificate: 2/3+ 서명 = 합의 증명",
      "🦈 Bullshark: DAG 순서화 알고리즘",
      "⚡ 병렬 실행: Object 기반 병렬 처리",
    ],
    pros: [
      "초고속 병렬 처리",
      "병렬 실행",
      "저지연 Finality",
    ],
    cons: [
      "새로운 기술",
      "학습 곡선",
      "생태계 성숙도",
    ],
    chains: ["Sui Network"],
    specs: [
      { label: "Finality", value: "~480ms" },
      { label: "Validator", value: "~100개" },
      { label: "실행 모델", value: "병렬" },
      { label: "구조", value: "DAG 기반" },
    ],
    security: "2/3+ Validator 정직성 가정",
    finality: "즉시 - Certificate 시 (~500ms)",
  },
};
