"use client";

import { memo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface RippleSceneProps {
  validators: Validator[];
  blocks: ChainBlock[];
  transactions: Transaction[];
  agreementPercent: number;
  roundNumber: number;
  currentStep: number;
}

// ==========================================
// UNL NODE COMPONENT
// ==========================================
function UnlNode({
  validator,
  isAgreeing,
  totalNodes
}: {
  validator: Validator;
  isAgreeing: boolean;
  totalNodes: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current && isAgreeing) {
      meshRef.current.rotation.y += delta;
    }
  });

  // Arrange nodes in a circle
  const angle = (validator.id / totalNodes) * Math.PI * 2;
  const radius = 3;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <group position={[x, y, 0]}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.35]} />
        <meshStandardMaterial
          color={isAgreeing ? "#22c55e" : "#23292f"}
          emissive={isAgreeing ? "#22c55e" : "#23292f"}
          emissiveIntensity={isAgreeing ? 0.5 : 0.2}
        />
      </mesh>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.1}
        color={isAgreeing ? "#22c55e" : "#6b7280"}
        anchorX="center"
      >
        {validator.name || `Node ${validator.id + 1}`}
      </Text>
      {/* Connection line to center */}
      <Line
        points={[[0, 0, 0], [-x * 0.7, -y * 0.7, 0]]}
        color={isAgreeing ? "#22c55e" : "#374151"}
        lineWidth={1}
        transparent
        opacity={isAgreeing ? 0.6 : 0.2}
      />
    </group>
  );
}

// ==========================================
// COMPONENT
// ==========================================
function RippleSceneComponent({
  validators,
  blocks,
  transactions,
  agreementPercent,
  roundNumber,
  currentStep,
}: RippleSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 14), 0.02);
    camera.lookAt(0, 0, 0);
  });

  // Calculate how many nodes are agreeing based on percentage
  const agreeingCount = Math.floor(validators.length * (agreementPercent / 100));
  const threshold80 = validators.length * 0.8;
  const hasConsensus = agreementPercent >= 80;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={0.6} />
      <Stars radius={80} depth={50} count={800} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 4.5, 0]} fontSize={0.4} color="#23292f" anchorX="center">
        💧 RIPPLE PROTOCOL
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        XRP Ledger - RPCA Consensus
      </Text>

      {/* Center - Current Ledger State */}
      <group position={[0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color={hasConsensus ? "#22c55e" : "#3b82f6"}
            emissive={hasConsensus ? "#22c55e" : "#3b82f6"}
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
        <Text position={[0, -1, 0]} fontSize={0.15} color="#94a3b8" anchorX="center">
          Ledger #{blocks.length + 1}
        </Text>
      </group>

      {/* UNL Nodes in circle */}
      {validators.map((v, i) => (
        <UnlNode
          key={v.id}
          validator={v}
          isAgreeing={i < agreeingCount}
          totalNodes={validators.length}
        />
      ))}

      {/* Agreement Progress */}
      <group position={[5.5, 2, 0]}>
        <RoundedBox args={[3, 2.5, 0.1]} radius={0.1}>
          <meshStandardMaterial color="#1f2937" />
        </RoundedBox>
        <Text position={[0, 0.8, 0.1]} fontSize={0.18} color="#94a3b8" anchorX="center">
          🗳️ Agreement
        </Text>
        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.4}
          color={hasConsensus ? "#22c55e" : "#fbbf24"}
          anchorX="center"
        >
          {agreementPercent}%
        </Text>
        <Text position={[0, -0.2, 0.1]} fontSize={0.12} color="#6b7280" anchorX="center">
          {agreeingCount}/{validators.length} nodes
        </Text>
        <Text
          position={[0, -0.6, 0.1]}
          fontSize={0.12}
          color={hasConsensus ? "#22c55e" : "#ef4444"}
          anchorX="center"
        >
          {hasConsensus ? "✓ Consensus reached!" : `Need 80%+ (${Math.ceil(threshold80)} nodes)`}
        </Text>
        <Text position={[0, -0.9, 0.1]} fontSize={0.1} color="#6b7280" anchorX="center">
          Round {roundNumber}
        </Text>
      </group>

      {/* UNL Explanation */}
      <group position={[-5.5, 2, 0]}>
        <RoundedBox args={[3, 2, 0.1]} radius={0.1}>
          <meshStandardMaterial color="#1f2937" />
        </RoundedBox>
        <Text position={[0, 0.6, 0.1]} fontSize={0.15} color="#94a3b8" anchorX="center">
          📋 UNL (Unique Node List)
        </Text>
        <Text position={[0, 0.2, 0.1]} fontSize={0.1} color="#6b7280" anchorX="center">
          Each node trusts specific
        </Text>
        <Text position={[0, -0.05, 0.1]} fontSize={0.1} color="#6b7280" anchorX="center">
          validators in their list
        </Text>
        <Text position={[0, -0.4, 0.1]} fontSize={0.1} color="#22c55e" anchorX="center">
          ✓ No mining required
        </Text>
        <Text position={[0, -0.65, 0.1]} fontSize={0.1} color="#22c55e" anchorX="center">
          ✓ 3-5s finality
        </Text>
      </group>

      {/* Finalized Blocks */}
      {blocks.map((block, i) => (
        <group key={block.id} position={[-4 + i * 1.5, -3, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.3]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.3}
            />
          </mesh>
          <Text position={[0, -0.65, 0]} fontSize={0.12} color="#22c55e" anchorX="center">
            Ledger #{block.blockNumber}
          </Text>
        </group>
      ))}

      {/* Chain connections */}
      {blocks.length > 1 && blocks.slice(1).map((_, i) => (
        <Line
          key={`chain-${i}`}
          points={[[-4 + i * 1.5 + 0.5, -3, 0], [-4 + (i + 1) * 1.5 - 0.5, -3, 0]]}
          color="#22c55e"
          lineWidth={2}
        />
      ))}

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Info Panel */}
      <group position={[-6, -4.5, 0]}>
        <Text position={[0, 0.3, 0]} fontSize={0.16} color="#23292f" anchorX="left">
          📊 XRP Ledger Stats
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.12} color="#94a3b8" anchorX="left">
          Block: 3-5s | Finality: Instant | Energy: Minimal
        </Text>
        <Text position={[0, -0.25, 0]} fontSize={0.1} color="#6b7280" anchorX="left">
          Federated Byzantine Agreement (FBA)
        </Text>
      </group>

      {/* Process Flow */}
      <group position={[2, -4.5, 0]}>
        <Text position={[-2, 0, 0]} fontSize={0.11} color={currentStep >= 1 ? "#22c55e" : "#6b7280"} anchorX="center">
          1. Propose
        </Text>
        <Text position={[-0.8, 0, 0]} fontSize={0.11} color={currentStep >= 2 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[0.2, 0, 0]} fontSize={0.11} color={currentStep >= 2 ? "#22c55e" : "#6b7280"} anchorX="center">
          2. Vote
        </Text>
        <Text position={[1.2, 0, 0]} fontSize={0.11} color={currentStep >= 3 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[2.4, 0, 0]} fontSize={0.11} color={currentStep >= 3 ? "#fbbf24" : "#6b7280"} anchorX="center">
          3. 80%+
        </Text>
        <Text position={[3.5, 0, 0]} fontSize={0.11} color={currentStep >= 4 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[4.8, 0, 0]} fontSize={0.11} color={currentStep >= 4 ? "#22c55e" : "#6b7280"} anchorX="center">
          4. Validated
        </Text>
      </group>

      <Effects />
    </>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const RippleScene = memo(RippleSceneComponent);
