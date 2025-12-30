export type Locale = "en" | "ko";

export interface ConsensusTranslations {
  pow: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  pos: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  raft: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  qbft: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  optimistic: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  zk: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  ripple: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  tendermint: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  avalanche: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
  sui: {
    name: string;
    chain: string;
    subtitle: string;
    descriptions: string[];
  };
}

export interface UITranslations {
  startSimulation: string;
  replay: string;
  skip: string;
  viewSource: string;
  loading: string;
  blocks: string;
  main: string;
  orphan: string;
  epoch: string;
  slot: string;
  attestations: string;
  logEntries: string;
  replicated: string;
  nodes: string;
  prepare: string;
  commit: string;
  need: string;
  finalized: string;
  justified: string;
  proposed: string;
  pending: string;
  instantFinality: string;
  neverReverted: string;
  noForkPossible: string;
  // Category tabs
  layer1: string;
  layer2: string;
  alternative: string;
  // Layer 2 specific
  challengePeriod: string;
  daysRemaining: string;
  fraudProof: string;
  proofProgress: string;
  batchSize: string;
  // Ripple specific
  agreement: string;
  round: string;
  unlNodes: string;
  // Tendermint specific
  height: string;
  prevote: string;
  precommit: string;
  lockedRound: string;
  // Avalanche specific
  confidence: string;
  queryRound: string;
  sampleSize: string;
  decided: string;
  snowball: string;
  // Sui/Narwhal specific
  dagRound: string;
  certificates: string;
  vertices: string;
  workers: string;
  primaries: string;
  // History link
  viewHistory: string;
  // Info panel
  viewDetails: string;
  closeModal: string;
  visitOfficialSite: string;
  // Simulation preview
  simulationSteps: string;
}

export interface StepTranslations {
  pow: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    mining: string;
    found: string;
    blockMined: string;
    longestChain: string;
    orphaned: string;
  };
  pos: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    checkingStakes: string;
    selectingProposer: string;
    selected: string;
    txDelivered: string;
    proposing: string;
    attesting: string;
    epochComplete: string;
  };
  raft: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    txArrived: string;
    appendLog: string;
    replicating: string;
    majorityReplicated: string;
    committed: string;
  };
  qbft: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    txArrived: string;
    prePrepareBroadcast: string;
    prepareVoting: string;
    prepareComplete: string;
    commitVoting: string;
    commitComplete: string;
    blockFinalized: string;
    proposerRotation: string;
  };
  optimistic: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
  zk: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
  ripple: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
  tendermint: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
  avalanche: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
  sui: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
}

export interface NetworkStatsTranslations {
  pow: {
    blockReward: string;
    tpsBlockFinality: string;
    networkDelay: string;
    orphanedBlocks: string;
    lostRewards: string;
  };
  pos: {
    networkStats: string;
    tpsBlockFinality: string;
    aprValidatorsStaked: string;
    slashingWarning: string;
    finalizedIrreversible: string;
    revertCost: string;
  };
  raft: {
    cft: string;
    cftAllows: string;
    cftDenies: string;
    maxFailHeartbeat: string;
    performance: string;
    tpsBlock: string;
    finalityNetwork: string;
  };
  qbft: {
    bft: string;
    bftAllows: string;
    quorumFormula: string;
    tpsBlockInstant: string;
    bftVsCft: string;
    ibftTolerance: string;
    raftTolerance: string;
  };
  optimistic: {
    layer2Scaling: string;
    tpsBlockFinality: string;
    fraudProofBased: string;
    challengePeriodInfo: string;
    anyoneCanChallenge: string;
    gasEfficiency: string;
  };
  zk: {
    layer2Scaling: string;
    tpsBlockFinality: string;
    validityProof: string;
    noChallengePeriod: string;
    instantFinality: string;
    gasEfficiency: string;
  };
  ripple: {
    xrpLedger: string;
    tpsBlockFinality: string;
    unlConsensus: string;
    agreementThreshold: string;
    noMining: string;
    federatedBft: string;
  };
  tendermint: {
    cosmosHub: string;
    tpsBlockFinality: string;
    roundBased: string;
    twoThirdsVoting: string;
    instantFinality: string;
    cosmosEcosystem: string;
  };
  avalanche: {
    avalancheNetwork: string;
    tpsBlockFinality: string;
    probabilisticBft: string;
    snowballProtocol: string;
    subSecondFinality: string;
    highThroughput: string;
  };
  sui: {
    suiNetwork: string;
    tpsBlockFinality: string;
    dagBasedMempool: string;
    parallelExecution: string;
    narwhalBullshark: string;
    highTps: string;
  };
}

export interface HistoryTranslations {
  title: string;
  subtitle: string;
  backToLab: string;
  categories: {
    academic: string;
    mainnet: string;
    upgrade: string;
    layer2: string;
    all: string;
  };
  viewDetails: string;
  references: string;
}

export interface Translations {
  consensus: ConsensusTranslations;
  ui: UITranslations;
  steps: StepTranslations;
  networkStats: NetworkStatsTranslations;
  history: HistoryTranslations;
}
