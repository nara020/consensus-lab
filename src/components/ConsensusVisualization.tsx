"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import Link from "next/link";
import type { ConsensusMode } from "@/types/consensus";
import {
  useAudio,
  useSimulationState,
  usePoWSimulation,
  usePoSSimulation,
  useRaftSimulation,
  useQbftSimulation,
  useOptimisticSimulation,
  useZkSimulation,
  useRippleSimulation,
  useTendermintSimulation,
  useAvalancheSimulation,
  useSuiSimulation,
} from "@/hooks";
import { useI18n } from "@/i18n";
import {
  PoWScene,
  PoSScene,
  RaftScene,
  QbftScene,
  OptimisticScene,
  ZkScene,
  RippleScene,
  TendermintScene,
  AvalancheScene,
  SuiScene,
} from "./visualization/scenes";
import {
  ModeSelector,
  InfoPanel,
  StepIndicator,
  StartButton,
  ReplayButton,
  LanguageToggle,
  SimulationControls,
} from "./ui";

// Check for WebGL support
function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ConsensusVisualization() {
  const [mode, setMode] = useState<ConsensusMode>("pow");
  const [canRender, setCanRender] = useState(false);
  const [infoPanelMinimized, setInfoPanelMinimized] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const { t } = useI18n();

  // Check WebGL availability on client side
  useEffect(() => {
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (isWebGLAvailable()) {
        setCanRender(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // State management
  const { state, actions } = useSimulationState();

  // Audio
  const audio = useAudio();

  // Simulation hooks
  const powSimulation = usePoWSimulation(actions, audio);
  const posSimulation = usePoSSimulation(actions, audio);
  const raftSimulation = useRaftSimulation(actions, audio);
  const qbftSimulation = useQbftSimulation(actions, audio);
  const optimisticSimulation = useOptimisticSimulation(actions, audio);
  const zkSimulation = useZkSimulation(actions, audio);
  const rippleSimulation = useRippleSimulation(actions, audio);
  const tendermintSimulation = useTendermintSimulation(actions, audio);
  const avalancheSimulation = useAvalancheSimulation(actions, audio);
  const suiSimulation = useSuiSimulation(actions, audio);

  // Get current simulation based on mode
  const simulations = useMemo(
    () => ({
      pow: powSimulation,
      pos: posSimulation,
      raft: raftSimulation,
      qbft: qbftSimulation,
      optimistic: optimisticSimulation,
      zk: zkSimulation,
      ripple: rippleSimulation,
      tendermint: tendermintSimulation,
      avalanche: avalancheSimulation,
      sui: suiSimulation,
    }),
    [powSimulation, posSimulation, raftSimulation, qbftSimulation, optimisticSimulation, zkSimulation, rippleSimulation, tendermintSimulation, avalancheSimulation, suiSimulation]
  );

  // Handlers
  const handleStart = useCallback(() => {
    simulations[mode].run();
  }, [mode, simulations]);

  const handleModeChange = useCallback(
    (newMode: ConsensusMode) => {
      // Cleanup current simulation
      simulations[mode].cleanup();
      setMode(newMode);
      actions.reset();
    },
    [mode, simulations, actions]
  );

  const handleReplay = useCallback(() => {
    actions.reset();
  }, [actions]);

  const handleSkip = useCallback(() => {
    simulations[mode].cleanup();
    actions.setPhase("complete");
  }, [mode, simulations, actions]);

  // Derived state
  const isRunning = state.phase === "running";
  const isComplete = state.phase === "complete";
  const isIdle = state.phase === "idle";

  // Show loading until WebGL is ready
  if (!canRender) {
    return (
      <div className="fixed inset-0 bg-[#030308] flex items-center justify-center">
        <motion.div
          className="text-cyan-400 text-sm font-mono"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Initializing WebGL...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          // Handle context loss
          const canvas = gl.domElement;
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            console.warn("WebGL context lost. Attempting recovery...");
          });
          canvas.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored.");
          });
        }}
        fallback={<div className="text-white text-center p-4">WebGL not supported</div>}
      >
        <color attach="background" args={["#030308"]} />
        <fog attach="fog" args={["#030308", 10, 40]} />

        {mode === "pow" && (
          <PoWScene
            blocks={state.blocks}
            miners={state.validators}
            transactions={state.transactions}
            forkLengths={state.forkLengths}
            winningBranch={state.winningBranch}
            miningData={state.miningData}
          />
        )}
        {mode === "pos" && (
          <PoSScene
            blocks={state.blocks}
            validators={state.validators}
            transactions={state.transactions}
            currentSlot={state.currentSlot}
            currentEpoch={state.currentEpoch}
            attestations={state.attestations}
            stakeData={state.stakeData}
            randaoData={state.randaoData}
          />
        )}
        {mode === "raft" && (
          <RaftScene
            validators={state.validators}
            blocks={state.blocks}
            transactions={state.transactions}
            logEntries={state.logEntries}
            replicatedCount={state.replicatedCount}
          />
        )}
        {mode === "qbft" && (
          <QbftScene
            validators={state.validators}
            currentBlock={state.currentBlock}
            transactions={state.transactions}
            prepareCount={state.prepareCount}
            commitCount={state.commitCount}
            blocks={state.blocks}
            byzantineNode={state.byzantineNode}
          />
        )}
        {mode === "optimistic" && (
          <OptimisticScene
            l2Blocks={state.l2Blocks}
            l1Blocks={state.l1Blocks}
            validators={state.validators}
            transactions={state.transactions}
            challengePeriod={state.challengePeriod}
            fraudProofSubmitted={state.fraudProofSubmitted}
            currentStep={state.currentStep}
          />
        )}
        {mode === "zk" && (
          <ZkScene
            l2Blocks={state.l2Blocks}
            l1Blocks={state.l1Blocks}
            validators={state.validators}
            transactions={state.transactions}
            proofProgress={state.proofProgress}
            batchSize={state.batchSize}
            proofGenerated={state.proofGenerated}
            currentStep={state.currentStep}
          />
        )}
        {mode === "ripple" && (
          <RippleScene
            validators={state.validators}
            blocks={state.blocks}
            transactions={state.transactions}
            agreementPercent={state.agreementPercent}
            roundNumber={state.roundNumber}
            currentStep={state.currentStep}
          />
        )}
        {mode === "tendermint" && (
          <TendermintScene
            blocks={state.blocks}
            validators={state.validators}
            transactions={state.transactions}
            currentBlock={state.currentBlock}
            tendermintRound={state.tendermintRound}
            tendermintHeight={state.tendermintHeight}
            prevoteCount={state.prevoteCount}
            precommitCount={state.precommitCount}
          />
        )}
        {mode === "avalanche" && (
          <AvalancheScene
            blocks={state.blocks}
            validators={state.validators}
            transactions={state.transactions}
            avalancheConfidence={state.avalancheConfidence}
            avalancheQueryRound={state.avalancheQueryRound}
            avalancheDecided={state.avalancheDecided}
            networkConfidence={state.networkConfidence}
            currentStep={state.currentStep}
          />
        )}
        {mode === "sui" && (
          <SuiScene
            validators={state.validators}
            transactions={state.transactions}
            dagVertices={state.dagVertices}
            dagRound={state.dagRound}
            suiCertificates={state.suiCertificates}
            anchorCommitted={state.anchorCommitted}
            currentStep={state.currentStep}
          />
        )}
      </Canvas>

      {/* UI Overlay */}
      <ModeSelector mode={mode} onModeChange={handleModeChange} disabled={isRunning} />
      <LanguageToggle />
      {/* InfoPanel - 항상 표시, 시뮬레이션 중에는 최소화 가능 */}
      <InfoPanel
        mode={mode}
        minimized={isRunning && infoPanelMinimized}
        onToggleMinimize={isRunning ? () => setInfoPanelMinimized(!infoPanelMinimized) : undefined}
      />

      {/* Start Button */}
      {isIdle && <StartButton onClick={handleStart} mode={mode} />}

      {/* Step Indicator */}
      {isRunning && state.currentStep > 0 && (
        <StepIndicator
          step={state.currentStep}
          totalSteps={5}
          description={state.stepDescription}
        />
      )}

      {/* Replay Button */}
      {isComplete && <ReplayButton onClick={handleReplay} mode={mode} />}

      {/* Simulation Controls */}
      {isRunning && (
        <SimulationControls
          mode={mode}
          isPaused={isPaused}
          speed={speed}
          onTogglePause={() => setIsPaused(!isPaused)}
          onSpeedChange={setSpeed}
          onSkip={handleSkip}
        />
      )}

      {/* Footer Links */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4">
        <a
          href="https://github.com/nara020/consensus-lab"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-400 text-xs font-mono flex items-center gap-1"
          aria-label="View source on GitHub"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {t.ui.viewSource}
        </a>
        <Link
          href="/history"
          className="text-gray-600 hover:text-gray-400 text-xs font-mono flex items-center gap-1"
        >
          <span>📜</span>
          {t.ui.viewHistory}
        </Link>
      </div>
    </div>
  );
}
