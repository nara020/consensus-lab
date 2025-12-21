"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion } from "framer-motion";
import type { ConsensusMode } from "@/types/consensus";
import {
  useAudio,
  useSimulationState,
  usePoWSimulation,
  usePoSSimulation,
  useRaftSimulation,
  useQbftSimulation,
} from "@/hooks";
import { useI18n } from "@/i18n";
import { PoWScene, PoSScene, RaftScene, QbftScene } from "./visualization/scenes";
import {
  ModeSelector,
  InfoPanel,
  StepIndicator,
  StartButton,
  ReplayButton,
  LanguageToggle,
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

  // Get current simulation based on mode
  const simulations = useMemo(
    () => ({
      pow: powSimulation,
      pos: posSimulation,
      raft: raftSimulation,
      qbft: qbftSimulation,
    }),
    [powSimulation, posSimulation, raftSimulation, qbftSimulation]
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
    <div className="fixed inset-0 bg-black z-50">
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
          />
        )}
      </Canvas>

      {/* UI Overlay */}
      <ModeSelector mode={mode} onModeChange={handleModeChange} disabled={isRunning} />
      <LanguageToggle />
      <InfoPanel mode={mode} />

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

      {/* Skip Button */}
      {isRunning && (
        <motion.button
          className="absolute bottom-4 right-4 text-gray-600 hover:text-gray-400 text-xs uppercase tracking-widest z-20 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleSkip}
          aria-label="Skip simulation"
        >
          {t.ui.skip} →
        </motion.button>
      )}

      {/* GitHub Link */}
      <a
        href="https://github.com/nara020/consensus-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 text-gray-600 hover:text-gray-400 text-xs font-mono z-20 flex items-center gap-1"
        aria-label="View source on GitHub"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        {t.ui.viewSource}
      </a>
    </div>
  );
}
