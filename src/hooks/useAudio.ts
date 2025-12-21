"use client";

import { useRef, useCallback, useMemo } from "react";
import type { AudioActions } from "@/types/consensus";

// ==========================================
// AUDIO CONTEXT SINGLETON
// ==========================================
let audioContextInstance: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContextInstance) {
    audioContextInstance = new (window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
  }
  return audioContextInstance;
}

// ==========================================
// SOUND CONFIGURATION
// ==========================================
interface SoundConfig {
  freq: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUNDS: Record<keyof AudioActions, SoundConfig> = {
  playTx: { freq: 400, duration: 0.1, type: "sine", volume: 0.08 },
  playMine: { freq: 200, duration: 0.15, type: "square", volume: 0.05 },
  playConfirm: { freq: 880, duration: 0.2, type: "sine", volume: 0.12 },
  playOrphan: { freq: 150, duration: 0.3, type: "sawtooth", volume: 0.06 },
  playVote: { freq: 600, duration: 0.08, type: "triangle", volume: 0.06 },
  playFinalize: { freq: 880, duration: 0.15, type: "sine", volume: 0.1 },
};

// ==========================================
// HOOK
// ==========================================
export function useAudio(): AudioActions {
  const isInitialized = useRef(false);

  const playSound = useCallback(
    (
      freq: number,
      duration: number,
      type: OscillatorType = "sine",
      volume = 0.1
    ) => {
      try {
        const ctx = getAudioContext();

        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);

        // Cleanup
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      } catch {
        // Silently fail if audio context is not available
      }
    },
    []
  );

  const actions = useMemo<AudioActions>(
    () => ({
      playTx: () => {
        const { freq, duration, type, volume } = SOUNDS.playTx;
        playSound(freq, duration, type, volume);
      },
      playMine: () => {
        const { freq, duration, type, volume } = SOUNDS.playMine;
        playSound(freq, duration, type, volume);
      },
      playConfirm: () => {
        const { freq, duration, type, volume } = SOUNDS.playConfirm;
        playSound(freq, duration, type, volume);
      },
      playOrphan: () => {
        const { freq, duration, type, volume } = SOUNDS.playOrphan;
        playSound(freq, duration, type, volume);
      },
      playVote: () => {
        const { freq, duration, type, volume } = SOUNDS.playVote;
        playSound(freq, duration, type, volume);
      },
      playFinalize: () => {
        const { freq, duration, type, volume } = SOUNDS.playFinalize;
        playSound(freq, duration, type, volume);
        // Play second note for finalize
        setTimeout(() => {
          playSound(1100, 0.2, "sine", 0.1);
        }, 100);
      },
    }),
    [playSound]
  );

  return actions;
}
