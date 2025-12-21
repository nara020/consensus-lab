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
}

export interface Translations {
  consensus: ConsensusTranslations;
  ui: UITranslations;
  steps: StepTranslations;
  networkStats: NetworkStatsTranslations;
}
