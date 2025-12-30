"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface AvalancheSceneProps {
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  avalancheConfidence: number[];
  avalancheQueryRound: number;
  avalancheDecided: boolean[];
  networkConfidence: number;
  currentStep: number;
}

// ==========================================
// COMPONENT
// ==========================================
function AvalancheSceneComponent({
  blocks,
  validators,
  transactions,
  avalancheConfidence,
  avalancheQueryRound,
  avalancheDecided,
  networkConfidence,
  currentStep,
}: AvalancheSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 14), 0.02);
    camera.lookAt(0, 0, 0);
  });

  // Helper to get color based on confidence
  const getConfidenceColor = (confidence: number, decided: boolean) => {
    if (decided) return "#22c55e";
    if (confidence > 80) return "#4ade80";
    if (confidence > 60) return "#fbbf24";
    if (confidence > 40) return "#f97316";
    return "#ef4444";
  };

  const decidedCount = avalancheDecided.filter((d) => d).length;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 4.2, 0]} fontSize={0.35} color="#e84142" anchorX="center">
        🔺 AVALANCHE - Snowball Consensus
      </Text>

      {/* Query Round and Parameters */}
      <group position={[-6.5, 3, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.2} color="#e84142" anchorX="left">
          {t.ui.queryRound}: {avalancheQueryRound}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.16} color="#94a3b8" anchorX="left">
          k=20 (sample) | α=14 (quorum) | β=20 (decision)
        </Text>
      </group>

      {/* Network Confidence */}
      <group position={[4, 3, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.2} color="#e84142" anchorX="left">
          {t.ui.confidence}: {networkConfidence}%
        </Text>
        <mesh position={[1.2, -0.35, 0]}>
          <planeGeometry args={[3, 0.2]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.3 + (networkConfidence / 100) * 1.5, -0.35, 0.01]}>
          <planeGeometry args={[(networkConfidence / 100) * 3, 0.2]} />
          <meshBasicMaterial
            color={networkConfidence >= 95 ? "#22c55e" : networkConfidence > 70 ? "#fbbf24" : "#e84142"}
          />
        </mesh>
        <Text position={[0, -0.7, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {decidedCount}/{validators.length} nodes {t.ui.decided}
        </Text>
      </group>

      {/* Node Grid */}
      {validators.map((v, i) => {
        const confidence = avalancheConfidence[i] || 50;
        const decided = avalancheDecided[i] || false;
        const row = Math.floor(i / 4);
        const col = i % 4;
        const pos = new THREE.Vector3(-3 + col * 2, 2 - row * 1.3, 0);

        return (
          <group key={v.id}>
            {/* Node with confidence-based color */}
            <mesh position={pos}>
              <sphereGeometry args={[0.25, 16, 16]} />
              <meshStandardMaterial
                color={getConfidenceColor(confidence, decided)}
                emissive={getConfidenceColor(confidence, decided)}
                emissiveIntensity={decided ? 0.4 : 0.2}
              />
            </mesh>

            {/* Node label */}
            <Text
              position={[pos.x, pos.y - 0.45, 0]}
              fontSize={0.12}
              color="#94a3b8"
              anchorX="center"
            >
              {v.name}
            </Text>

            {/* Confidence indicator */}
            <Text
              position={[pos.x, pos.y + 0.4, 0]}
              fontSize={0.1}
              color={getConfidenceColor(confidence, decided)}
              anchorX="center"
            >
              {Math.round(confidence)}%
            </Text>

            {/* Query lines (show random sampling) */}
            {v.vote === "query" &&
              currentStep >= 2 &&
              validators.slice(0, 3).map((target) => {
                if (target.id === v.id) return null;
                const tRow = Math.floor(target.id / 4);
                const tCol = target.id % 4;
                const tPos = new THREE.Vector3(-3 + tCol * 2, 2 - tRow * 1.3, 0);
                return (
                  <Line
                    key={`query-${v.id}-${target.id}`}
                    points={[
                      [pos.x, pos.y, 0],
                      [tPos.x, tPos.y, 0],
                    ]}
                    color="#e84142"
                    lineWidth={0.5}
                    transparent
                    opacity={0.2}
                  />
                );
              })}
          </group>
        );
      })}

      {/* Conflicting blocks */}
      {blocks.map((block) => (
        <group key={block.id}>
          <mesh position={block.position}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
              color={
                block.status === "accepted"
                  ? "#22c55e"
                  : block.status === "orphaned"
                  ? "#ef4444"
                  : "#e84142"
              }
              emissive={
                block.status === "accepted"
                  ? "#22c55e"
                  : block.status === "orphaned"
                  ? "#ef4444"
                  : "#e84142"
              }
              emissiveIntensity={0.3}
              transparent={block.status === "orphaned"}
              opacity={block.status === "orphaned" ? 0.4 : 1}
            />
          </mesh>
          <Text
            position={[block.position.x, block.position.y - 0.7, 0]}
            fontSize={0.16}
            color={
              block.status === "accepted"
                ? "#22c55e"
                : block.status === "orphaned"
                ? "#ef4444"
                : "#94a3b8"
            }
            anchorX="center"
          >
            {block.id === "block-A" ? "Block A" : "Block B"}
          </Text>
          <Text
            position={[block.position.x, block.position.y - 0.95, 0]}
            fontSize={0.12}
            color="#6b7280"
            anchorX="center"
          >
            {block.status === "accepted" && "✓ ACCEPTED"}
            {block.status === "orphaned" && "✗ REJECTED"}
            {block.status === "queried" && "Conflicting..."}
            {block.status === "preferred" && "Preferred"}
          </Text>
        </group>
      ))}

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Info Panel */}
      <group position={[-6.5, -3.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#e84142" anchorX="left">
          {t.networkStats.avalanche.avalancheNetwork}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.15} color="#94a3b8" anchorX="left">
          {t.networkStats.avalanche.tpsBlockFinality}
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {t.networkStats.avalanche.probabilisticBft}
        </Text>
      </group>

      {/* Snowball explanation */}
      <group position={[4, -3.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#fbbf24" anchorX="left">
          ❄️ {t.ui.snowball} Protocol
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          Repeated sampling → Preference flipping
        </Text>
        <Text position={[0, -0.55, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          → Consecutive success → Decision
        </Text>
      </group>

      {/* Finality indicator */}
      {networkConfidence >= 95 && (
        <group position={[0, -2.5, 0]}>
          <Text position={[0, 0.3, 0]} fontSize={0.22} color="#22c55e" anchorX="center">
            ✓ CONSENSUS ACHIEVED
          </Text>
          <Text position={[0, 0, 0]} fontSize={0.14} color="#94a3b8" anchorX="center">
            {t.networkStats.avalanche.subSecondFinality}
          </Text>
        </group>
      )}

      <Effects />
    </>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const AvalancheScene = memo(AvalancheSceneComponent);
