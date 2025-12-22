"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface OptimisticSceneProps {
  l2Blocks: ChainBlock[];
  l1Blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  challengePeriod: number;
  fraudProofSubmitted: boolean;
  currentStep: number;
}

// ==========================================
// COMPONENT
// ==========================================
function OptimisticSceneComponent({
  l2Blocks,
  l1Blocks,
  validators,
  transactions,
  challengePeriod,
  fraudProofSubmitted,
  currentStep,
}: OptimisticSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 18), 0.02);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <Stars radius={80} depth={50} count={800} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 4.5, 0]} fontSize={0.4} color="#ff0420" anchorX="center">
        🔴 OPTIMISTIC ROLLUP
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        Arbitrum / Optimism Style
      </Text>

      {/* L2 Layer Label */}
      <group position={[-7, 2, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#ff0420" anchorX="left">
          Layer 2
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.15} color="#6b7280" anchorX="left">
          Off-chain execution
        </Text>
      </group>

      {/* L2 Area Background */}
      <mesh position={[0, 2, -1]}>
        <planeGeometry args={[16, 3]} />
        <meshBasicMaterial color="#ff0420" transparent opacity={0.05} />
      </mesh>

      {/* Sequencer */}
      {validators.filter(v => v.role === "sequencer").map((v) => (
        <group key={v.id} position={v.position.toArray()}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.8, 8]} />
            <meshStandardMaterial color="#ff0420" emissive="#ff0420" emissiveIntensity={0.3} />
          </mesh>
          <Text position={[0, -0.8, 0]} fontSize={0.15} color="#ff0420" anchorX="center">
            Sequencer
          </Text>
        </group>
      ))}

      {/* L2 Blocks */}
      {l2Blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Divider Line */}
      <Line
        points={[[-8, 0, 0], [8, 0, 0]]}
        color="#374151"
        lineWidth={2}
        dashed
        dashSize={0.3}
        gapSize={0.2}
      />
      <Text position={[0, 0.3, 0]} fontSize={0.12} color="#6b7280" anchorX="center">
        State Root Submission
      </Text>

      {/* L1 Layer Label */}
      <group position={[-7, -2, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#627eea" anchorX="left">
          Layer 1 (Ethereum)
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.15} color="#6b7280" anchorX="left">
          Settlement & Data Availability
        </Text>
      </group>

      {/* L1 Area Background */}
      <mesh position={[0, -2, -1]}>
        <planeGeometry args={[16, 3]} />
        <meshBasicMaterial color="#627eea" transparent opacity={0.05} />
      </mesh>

      {/* L1 Blocks */}
      {l1Blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Challenge Period Display */}
      {challengePeriod > 0 && (
        <group position={[5, 0, 0]}>
          <RoundedBox args={[2.5, 1.2, 0.1]} radius={0.1}>
            <meshStandardMaterial color="#1f2937" />
          </RoundedBox>
          <Text position={[0, 0.3, 0.1]} fontSize={0.15} color="#fbbf24" anchorX="center">
            ⏳ Challenge Period
          </Text>
          <Text position={[0, 0, 0.1]} fontSize={0.25} color="#fbbf24" anchorX="center">
            {challengePeriod} days left
          </Text>
          <Text position={[0, -0.35, 0.1]} fontSize={0.1} color="#6b7280" anchorX="center">
            Anyone can submit fraud proof
          </Text>
        </group>
      )}

      {/* Fraud Proof Alert */}
      {fraudProofSubmitted && (
        <group position={[5, 0, 0]}>
          <RoundedBox args={[2.5, 1.2, 0.1]} radius={0.1}>
            <meshStandardMaterial color="#7f1d1d" />
          </RoundedBox>
          <Text position={[0, 0.2, 0.1]} fontSize={0.18} color="#ef4444" anchorX="center">
            🚨 FRAUD PROOF
          </Text>
          <Text position={[0, -0.15, 0.1]} fontSize={0.12} color="#ef4444" anchorX="center">
            Invalid state detected!
          </Text>
          <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="#fca5a5" anchorX="center">
            Rolling back...
          </Text>
        </group>
      )}

      {/* Info Panel */}
      <group position={[-7, -4, 0]}>
        <Text position={[0, 0.4, 0]} fontSize={0.18} color="#ff0420" anchorX="left">
          📊 Optimistic Rollup
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          Block: ~2s | Finality: 7 days (challenge)
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          Assume valid, prove fraud if needed
        </Text>
      </group>

      {/* Process Flow */}
      <group position={[0, -4, 0]}>
        <Text position={[-3, 0, 0]} fontSize={0.12} color={currentStep >= 1 ? "#22c55e" : "#6b7280"} anchorX="center">
          1. Batch TX
        </Text>
        <Text position={[-1, 0, 0]} fontSize={0.12} color={currentStep >= 2 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.12} color={currentStep >= 2 ? "#22c55e" : "#6b7280"} anchorX="center">
          2. Submit
        </Text>
        <Text position={[1, 0, 0]} fontSize={0.12} color={currentStep >= 3 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[2.5, 0, 0]} fontSize={0.12} color={currentStep >= 3 ? "#fbbf24" : "#6b7280"} anchorX="center">
          3. Challenge
        </Text>
        <Text position={[4, 0, 0]} fontSize={0.12} color={currentStep >= 4 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[5.5, 0, 0]} fontSize={0.12} color={currentStep >= 5 ? "#22c55e" : "#6b7280"} anchorX="center">
          4. Finalized
        </Text>
      </group>

      <Effects />
    </>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const OptimisticScene = memo(OptimisticSceneComponent);
