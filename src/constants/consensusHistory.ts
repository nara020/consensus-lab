// ==========================================
// CONSENSUS ALGORITHM HISTORY & TIMELINE
// ==========================================

export interface ConsensusHistoryEvent {
  year: number;
  month?: number;
  algorithm: string;
  title: string;
  description: string;
  category: "academic" | "mainnet" | "upgrade" | "layer2";
  icon: string;
  color: string;
  details?: string[];
  links?: { label: string; url: string }[];
}

export const CONSENSUS_HISTORY: ConsensusHistoryEvent[] = [
  // 1982 - Byzantine Generals Problem
  {
    year: 1982,
    algorithm: "Byzantine",
    title: "비잔틴 장군 문제 발표",
    description: "Leslie Lamport, Robert Shostak, Marshall Pease가 비잔틴 장군 문제를 발표. 분산 시스템에서 신뢰할 수 없는 노드가 있을 때 합의를 이루는 문제를 정의했습니다.",
    category: "academic",
    icon: "📜",
    color: "#94a3b8",
    details: [
      "논문: 'The Byzantine Generals Problem' (1982)",
      "분산 시스템 합의 문제의 이론적 기초 확립",
      "f < n/3 악의적 노드까지 허용 가능하다는 것을 증명",
      "이후 모든 BFT 알고리즘의 이론적 토대가 됨",
    ],
  },
  // 1989 - Paxos
  {
    year: 1989,
    algorithm: "Paxos",
    title: "Paxos 알고리즘 발표",
    description: "Leslie Lamport가 Paxos 합의 알고리즘을 발표. 비동기 네트워크에서 장애 허용 합의를 달성하는 알고리즘을 제시했습니다.",
    category: "academic",
    icon: "🏛️",
    color: "#64748b",
    details: [
      "논문: 'The Part-Time Parliament' (1998년 공식 발표)",
      "CFT(Crash Fault Tolerant) 합의의 기초",
      "Google Chubby, Apache ZooKeeper 등에서 채택",
      "이해하기 어렵다는 비판으로 RAFT 개발에 영감",
    ],
  },
  // 1999 - PBFT
  {
    year: 1999,
    algorithm: "PBFT",
    title: "PBFT (Practical BFT) 발표",
    description: "Miguel Castro와 Barbara Liskov가 MIT에서 PBFT를 발표. 실용적인 비잔틴 장애 허용 합의 알고리즘을 제시했습니다.",
    category: "academic",
    icon: "🛡️",
    color: "#3c3c3d",
    details: [
      "논문: 'Practical Byzantine Fault Tolerance' (1999)",
      "비잔틴 장애 허용을 실용적으로 구현",
      "3-phase 합의: PRE-PREPARE, PREPARE, COMMIT",
      "O(n²) 메시지 복잡도로 수십 개 노드까지 실용적",
      "IBFT, Tendermint 등 블록체인 합의의 기반",
    ],
  },
  // 2008 - Bitcoin Whitepaper
  {
    year: 2008,
    month: 10,
    algorithm: "PoW",
    title: "비트코인 백서 발표",
    description: "Satoshi Nakamoto가 'Bitcoin: A Peer-to-Peer Electronic Cash System' 백서를 발표. 작업 증명(Proof of Work) 기반 나카모토 합의를 제안했습니다.",
    category: "academic",
    icon: "📄",
    color: "#f7931a",
    details: [
      "2008년 10월 31일 cypherpunks 메일링 리스트에 발표",
      "SHA-256 해시 기반 작업 증명 합의",
      "가장 긴 체인(Most Accumulated Work) 규칙",
      "탈중앙화 P2P 네트워크에서 합의 달성",
      "Double Spending 문제 해결",
    ],
  },
  // 2009 - Bitcoin Genesis Block
  {
    year: 2009,
    month: 1,
    algorithm: "PoW",
    title: "비트코인 제네시스 블록",
    description: "비트코인 메인넷이 시작되었습니다. 제네시스 블록에는 'The Times 03/Jan/2009 Chancellor on brink of second bailout for banks' 메시지가 포함되었습니다.",
    category: "mainnet",
    icon: "₿",
    color: "#f7931a",
    details: [
      "2009년 1월 3일 제네시스 블록 채굴",
      "블록 보상: 50 BTC (현재 6.25 BTC)",
      "난이도 1에서 시작",
      "최초의 탈중앙화 암호화폐 네트워크",
    ],
  },
  // 2012 - Ripple Consensus
  {
    year: 2012,
    algorithm: "RPCA",
    title: "Ripple Protocol Consensus Algorithm",
    description: "David Schwartz, Jed McCaleb, Arthur Britto가 XRP Ledger를 위한 RPCA를 개발. UNL(Unique Node List) 기반 합의를 제안했습니다.",
    category: "mainnet",
    icon: "💧",
    color: "#23292f",
    details: [
      "채굴이나 스테이킹 없는 합의",
      "UNL: 각 노드가 신뢰하는 Validator 목록",
      "80% Supermajority로 합의 달성",
      "3-5초 내 최종성(Finality)",
      "은행/결제 네트워크에 최적화",
    ],
  },
  // 2014 - Tendermint
  {
    year: 2014,
    algorithm: "Tendermint",
    title: "Tendermint BFT 발표",
    description: "Jae Kwon이 Tendermint 합의 알고리즘을 발표. PBFT를 블록체인에 최적화하여 즉각적 최종성을 제공합니다.",
    category: "academic",
    icon: "⚛️",
    color: "#2e3148",
    details: [
      "PBFT를 블록체인에 최적화",
      "Propose → Prevote → Precommit 3단계",
      "가중 라운드-로빈 제안자 선택",
      "Locking 메커니즘으로 포크 방지",
      "Cosmos SDK의 핵심 합의 엔진",
    ],
  },
  // 2014 - Raft
  {
    year: 2014,
    algorithm: "Raft",
    title: "Raft 합의 알고리즘 발표",
    description: "Diego Ongaro와 John Ousterhout가 Stanford에서 Raft를 발표. Paxos보다 이해하기 쉬운 합의 알고리즘을 제시했습니다.",
    category: "academic",
    icon: "🔷",
    color: "#2c9ed4",
    details: [
      "논문: 'In Search of an Understandable Consensus Algorithm' (2014)",
      "Leader 기반 로그 복제",
      "CFT(Crash Fault Tolerant): 과반수 장애 허용",
      "etcd, Consul, CockroachDB 등에서 채택",
      "Hyperledger Fabric의 Ordering Service",
    ],
  },
  // 2015 - Ethereum Genesis
  {
    year: 2015,
    month: 7,
    algorithm: "PoW",
    title: "이더리움 메인넷 출시",
    description: "이더리움 프론티어(Frontier)가 출시되었습니다. Ethash PoW로 시작하여 스마트 컨트랙트 플랫폼을 제공합니다.",
    category: "mainnet",
    icon: "◆",
    color: "#627eea",
    details: [
      "2015년 7월 30일 프론티어 출시",
      "Ethash: ASIC 저항성 PoW 알고리즘",
      "평균 블록 시간: ~15초",
      "스마트 컨트랙트 플랫폼",
      "PoS 전환 계획(The Merge) 발표",
    ],
  },
  // 2017 - IBFT/Istanbul
  {
    year: 2017,
    algorithm: "IBFT",
    title: "IBFT (Istanbul BFT) 발표",
    description: "Quorum 프로젝트에서 IBFT를 발표. PBFT를 이더리움에 맞게 최적화한 엔터프라이즈급 합의 알고리즘입니다.",
    category: "academic",
    icon: "🏢",
    color: "#3c3c3d",
    details: [
      "PBFT를 이더리움 블록체인에 최적화",
      "3-phase: PRE-PREPARE, PREPARE, COMMIT",
      "블록 헤더에 commit_seals 포함",
      "즉각적 최종성, 포크 불가",
      "ConsenSys Quorum에서 채택",
    ],
  },
  // 2018 - Avalanche
  {
    year: 2018,
    month: 5,
    algorithm: "Avalanche",
    title: "Avalanche 합의 발표",
    description: "Cornell 연구팀(Team Rocket)이 Avalanche 합의 프로토콜을 발표. 반복 무작위 샘플링을 통한 확률적 합의를 제안했습니다.",
    category: "academic",
    icon: "❄️",
    color: "#e84142",
    details: [
      "논문: 'Scalable and Probabilistic Leaderless BFT Consensus' (2018)",
      "Slush → Snowflake → Snowball → Avalanche 진화",
      "O(log n) 메시지 복잡도로 확장성 확보",
      "k=20 샘플, α=14 쿼럼, β=20 결정 임계값",
      "Sub-second Finality 달성",
    ],
  },
  // 2019 - Cosmos Hub Launch
  {
    year: 2019,
    month: 3,
    algorithm: "Tendermint",
    title: "Cosmos Hub 메인넷 출시",
    description: "Tendermint 기반 Cosmos Hub가 메인넷을 시작했습니다. IBC(Inter-Blockchain Communication)로 블록체인 간 통신을 지원합니다.",
    category: "mainnet",
    icon: "⚛️",
    color: "#2e3148",
    details: [
      "2019년 3월 13일 메인넷 출시",
      "175 검증자로 운영 (현재)",
      "Tendermint BFT + Cosmos SDK",
      "IBC로 체인 간 토큰/데이터 전송",
      "100+ 체인이 Cosmos SDK 사용",
    ],
  },
  // 2019 - Optimistic Rollup Concept
  {
    year: 2019,
    algorithm: "Optimistic",
    title: "Optimistic Rollup 제안",
    description: "Plasma Group이 Optimistic Rollup 개념을 발표. Fraud Proof 기반 L2 확장 솔루션을 제안했습니다.",
    category: "academic",
    icon: "🔴",
    color: "#ff0420",
    details: [
      "Plasma의 데이터 가용성 문제 해결",
      "낙관적 가정: 트랜잭션이 기본적으로 유효",
      "7일 Challenge Period로 보안 확보",
      "EVM 호환성으로 쉬운 마이그레이션",
      "Arbitrum, Optimism, Base 개발로 이어짐",
    ],
  },
  // 2020 - Avalanche Mainnet
  {
    year: 2020,
    month: 9,
    algorithm: "Avalanche",
    title: "Avalanche C-Chain 메인넷",
    description: "Ava Labs가 Avalanche 메인넷을 출시했습니다. EVM 호환 C-Chain과 함께 P-Chain, X-Chain을 포함합니다.",
    category: "mainnet",
    icon: "🔺",
    color: "#e84142",
    details: [
      "2020년 9월 21일 메인넷 출시",
      "C-Chain: EVM 호환 스마트 컨트랙트",
      "P-Chain: 스테이킹 및 서브넷 관리",
      "X-Chain: 자산 생성 및 교환",
      "4,500+ TPS, 1초 미만 최종성",
    ],
  },
  // 2021 - QBFT
  {
    year: 2021,
    algorithm: "QBFT",
    title: "QBFT (Quorum BFT) 도입",
    description: "Hyperledger Besu가 QBFT를 도입했습니다. IBFT 2.0의 개선 버전으로 더 나은 라이브니스와 안정성을 제공합니다.",
    category: "upgrade",
    icon: "🛡️",
    color: "#3c3c3d",
    details: [
      "IBFT 2.0의 개선 버전",
      "향상된 라운드 변경 프로토콜",
      "더 나은 네트워크 파티션 처리",
      "Hyperledger Besu 기본 합의 엔진",
      "ConsenSys Quorum과 호환",
    ],
  },
  // 2021 - Arbitrum & Optimism
  {
    year: 2021,
    algorithm: "Optimistic",
    title: "Arbitrum One & Optimism 메인넷",
    description: "Optimistic Rollup 기반 L2 솔루션인 Arbitrum One과 Optimism이 메인넷을 출시했습니다.",
    category: "mainnet",
    icon: "🔴",
    color: "#ff0420",
    details: [
      "Arbitrum One: 2021년 8월 메인넷",
      "Optimism: 2021년 1월 메인넷",
      "Interactive Fraud Proof (Arbitrum)",
      "Fault Dispute Game (Optimism)",
      "L1 대비 10-100x 가스비 절감",
    ],
  },
  // 2022 - Ethereum Merge
  {
    year: 2022,
    month: 9,
    algorithm: "PoS",
    title: "이더리움 The Merge",
    description: "이더리움이 PoW에서 PoS로 전환했습니다. Casper FFG + LMD GHOST 합의 메커니즘이 도입되었습니다.",
    category: "upgrade",
    icon: "◆",
    color: "#627eea",
    details: [
      "2022년 9월 15일 The Merge 완료",
      "에너지 소비 99.95% 감소",
      "Casper FFG: Finality Gadget",
      "LMD GHOST: Fork Choice Rule",
      "32 ETH 스테이킹으로 검증자 참여",
      "슬래싱: Double Voting, Surround Voting 처벌",
    ],
  },
  // 2022 - zkSync Era
  {
    year: 2022,
    month: 10,
    algorithm: "ZK",
    title: "zkSync Era 메인넷 준비",
    description: "Matter Labs가 zkSync Era(zkEVM)를 발표했습니다. EVM 호환 ZK Rollup으로 Validity Proof 기반 즉각적 최종성을 제공합니다.",
    category: "mainnet",
    icon: "🟣",
    color: "#8b5cf6",
    details: [
      "2023년 3월 정식 메인넷 오픈",
      "zkEVM: EVM 바이트코드 호환",
      "SNARK 기반 Validity Proof",
      "즉시 출금 가능 (7일 대기 없음)",
      "Account Abstraction 기본 지원",
    ],
  },
  // 2022 - Sui/Narwhal-Bullshark
  {
    year: 2022,
    algorithm: "Narwhal-Bullshark",
    title: "Narwhal-Bullshark 발표",
    description: "Mysten Labs(전 Diem 엔지니어)가 Narwhal-Bullshark 합의를 발표. DAG 기반 데이터 가용성과 무메시지 순서화를 제안했습니다.",
    category: "academic",
    icon: "🦈",
    color: "#6fbcf0",
    details: [
      "Narwhal: DAG 기반 Mempool",
      "Bullshark: Zero-message Ordering",
      "Anchor 버텍스를 통한 합의",
      "합의와 데이터 전파 분리",
      "높은 처리량 달성 (300K+ TPS)",
    ],
  },
  // 2023 - Sui Mainnet
  {
    year: 2023,
    month: 5,
    algorithm: "Sui",
    title: "Sui 메인넷 출시",
    description: "Mysten Labs가 Sui 메인넷을 출시했습니다. 객체 중심 모델과 Narwhal-Bullshark 합의로 병렬 트랜잭션 처리를 지원합니다.",
    category: "mainnet",
    icon: "💧",
    color: "#6fbcf0",
    details: [
      "2023년 5월 3일 메인넷 출시",
      "객체 중심 데이터 모델",
      "Owned Objects: 합의 없이 즉시 실행",
      "Move 스마트 컨트랙트 언어",
      "Web3 게임과 DeFi에 최적화",
    ],
  },
  // 2023 - Base Launch
  {
    year: 2023,
    month: 8,
    algorithm: "Optimistic",
    title: "Base (Coinbase L2) 메인넷",
    description: "Coinbase가 OP Stack 기반 L2인 Base를 출시했습니다. Optimism의 Superchain 비전에 참여합니다.",
    category: "mainnet",
    icon: "🔵",
    color: "#0052ff",
    details: [
      "2023년 8월 9일 메인넷 출시",
      "OP Stack 기반 (Optimism)",
      "Coinbase의 10억+ 사용자 접근성",
      "Superchain 생태계 참여",
      "EIP-4844 Blob 지원",
    ],
  },
  // 2024 - EIP-4844 Dencun
  {
    year: 2024,
    month: 3,
    algorithm: "Layer2",
    title: "이더리움 Dencun 업그레이드",
    description: "EIP-4844(Proto-Danksharding)가 활성화되었습니다. Blob 트랜잭션으로 L2 데이터 가용성 비용이 대폭 감소했습니다.",
    category: "upgrade",
    icon: "📦",
    color: "#627eea",
    details: [
      "2024년 3월 13일 Dencun 활성화",
      "Blob: L2 데이터용 임시 저장소",
      "L2 비용 90%+ 감소",
      "Rollup 확장성 대폭 향상",
      "Full Danksharding으로의 첫 단계",
    ],
  },
  // 2025 - Ethereum Pectra
  {
    year: 2025,
    month: 5,
    algorithm: "PoS",
    title: "이더리움 Pectra 업그레이드",
    description: "Prague(실행층) + Electra(합의층) 통합 업그레이드. EIP-7702 계정 추상화와 Validator 개선이 포함되었습니다.",
    category: "upgrade",
    icon: "◆",
    color: "#627eea",
    details: [
      "EIP-7702: 스마트 계정 네이티브 지원",
      "EIP-7251: MaxEB 증가 (32 → 2048 ETH)",
      "EIP-7691: Blob 처리량 증가",
      "Validator 운영 효율성 향상",
      "Account Abstraction 대중화 기반",
    ],
  },
  // 2025 - Solana Firedancer
  {
    year: 2025,
    algorithm: "Tower BFT",
    title: "Solana Firedancer 출시",
    description: "Jump Crypto가 개발한 C/C++ 기반 새 Solana Validator 클라이언트. 기존 Rust 클라이언트 대비 처리량 대폭 향상.",
    category: "upgrade",
    icon: "🔥",
    color: "#9945ff",
    details: [
      "Jump Crypto의 독자 개발 Validator",
      "C/C++ 기반으로 성능 최적화",
      "1M+ TPS 목표",
      "클라이언트 다양성으로 네트워크 안정성 향상",
      "Frankendancer: 점진적 통합 버전",
    ],
  },
  // 2025 - Monad
  {
    year: 2025,
    algorithm: "MonadBFT",
    title: "Monad 메인넷 출시",
    description: "병렬 EVM 실행과 파이프라인 처리로 10,000+ TPS를 달성하는 새로운 Layer 1 블록체인.",
    category: "mainnet",
    icon: "⚡",
    color: "#836ef9",
    details: [
      "Optimistic Parallel Execution",
      "MonadBFT: 파이프라인 합의 프로토콜",
      "MonadDB: 커스텀 상태 데이터베이스",
      "EVM 바이트코드 완전 호환",
      "10,000+ TPS with 1초 블록 시간",
    ],
  },
  // 2025 - Polygon AggLayer
  {
    year: 2025,
    algorithm: "ZK",
    title: "Polygon AggLayer 확장",
    description: "여러 ZK 체인을 하나의 통합 유동성 레이어로 연결. 크로스체인 상호운용성의 새로운 패러다임.",
    category: "layer2",
    icon: "🟣",
    color: "#8247e5",
    details: [
      "Unified Liquidity across chains",
      "ZK Proof 기반 브릿지 보안",
      "Pessimistic Proof: 안전한 크로스체인 TX",
      "Polygon CDK 체인 통합",
      "Near-instant 크로스체인 최종성",
    ],
  },
];

// ==========================================
// CATEGORY LABELS
// ==========================================
export const CATEGORY_LABELS: Record<ConsensusHistoryEvent["category"], { ko: string; color: string }> = {
  academic: { ko: "학술 발표", color: "#64748b" },
  mainnet: { ko: "메인넷 출시", color: "#22c55e" },
  upgrade: { ko: "업그레이드", color: "#f97316" },
  layer2: { ko: "Layer 2", color: "#8b5cf6" },
};
