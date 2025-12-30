"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { Validator, Transaction, DagVertex } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface SuiSceneProps {
  validators: Validator[];
  transactions: Transaction[];
  dagVertices: DagVertex[];
  dagRound: number;
  suiCertificates: number;
  anchorCommitted: boolean;
  currentStep: number;
}

// ==========================================
// COMPONENT
// ==========================================
function SuiSceneComponent({
  validators,
  transactions,
  dagVertices,
  dagRound,
  suiCertificates,
  anchorCommitted,
  currentStep: _currentStep,
}: SuiSceneProps) {
  void _currentStep; // Used for future step-based animations
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(1, 0, 14), 0.02);
    camera.lookAt(1, 0, 0);
  });

  const workers = validators.filter((v) => v.role === "worker");
  const primaries = validators.filter((v) => v.role === "primary");

  // Get vertex color based on status
  const getVertexColor = (status: DagVertex["status"]) => {
    switch (status) {
      case "committed":
        return "#22c55e";
      case "certified":
        return "#6fbcf0";
      case "proposed":
        return "#94a3b8";
      default:
        return "#6b7280";
    }
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[1, 4, 0]} fontSize={0.35} color="#6fbcf0" anchorX="center">
        💧 SUI - Narwhal-Bullshark (DAG-BFT)
      </Text>

      {/* DAG Round and Stats */}
      <group position={[-6, 3.3, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.2} color="#6fbcf0" anchorX="left">
          {t.ui.dagRound}: {dagRound}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.16} color="#94a3b8" anchorX="left">
          {t.ui.certificates}: {suiCertificates}
        </Text>
      </group>

      {/* Workers Section */}
      <group>
        <Text position={[-5.5, 3.3, 0]} fontSize={0.18} color="#6fbcf0" anchorX="center">
          {t.ui.workers}
        </Text>
        {workers.map((w) => (
          <group key={w.id}>
            <mesh position={w.position}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial
                color={w.vote === "certify" ? "#6fbcf0" : "#475569"}
                emissive={w.vote === "certify" ? "#6fbcf0" : "#475569"}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Text
              position={[w.position.x, w.position.y - 0.5, 0]}
              fontSize={0.12}
              color="#94a3b8"
              anchorX="center"
            >
              {w.name}
            </Text>
          </group>
        ))}
      </group>

      {/* Primaries Section */}
      <group>
        <Text position={[-2, 3.3, 0]} fontSize={0.18} color="#3b82f6" anchorX="center">
          {t.ui.primaries}
        </Text>
        {primaries.map((p) => (
          <group key={p.id}>
            <mesh position={p.position}>
              <cylinderGeometry args={[0.3, 0.3, 0.5, 6]} />
              <meshStandardMaterial
                color={p.vote === "certify" ? "#3b82f6" : "#475569"}
                emissive={p.vote === "certify" ? "#3b82f6" : "#475569"}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Text
              position={[p.position.x, p.position.y - 0.5, 0]}
              fontSize={0.12}
              color="#94a3b8"
              anchorX="center"
            >
              {p.name}
            </Text>
          </group>
        ))}
      </group>

      {/* Arrows from Workers to Primaries */}
      {workers.map((w, i) => (
        <Line
          key={`w-to-p-${i}`}
          points={[
            [w.position.x + 0.3, w.position.y, 0],
            [primaries[i]?.position.x - 0.3 || -2, primaries[i]?.position.y || w.position.y, 0],
          ]}
          color="#6fbcf0"
          lineWidth={1}
          transparent
          opacity={0.4}
        />
      ))}

      {/* DAG Vertices */}
      <group>
        <Text position={[3.5, 3.3, 0]} fontSize={0.18} color="#22c55e" anchorX="center">
          DAG {t.ui.vertices}
        </Text>

        {dagVertices.map((vertex) => (
          <group key={vertex.id}>
            {/* Vertex node */}
            <mesh position={vertex.position}>
              <sphereGeometry args={[0.35, 16, 16]} />
              <meshStandardMaterial
                color={getVertexColor(vertex.status)}
                emissive={getVertexColor(vertex.status)}
                emissiveIntensity={vertex.status === "committed" ? 0.5 : 0.3}
              />
            </mesh>

            {/* Vertex label */}
            <Text
              position={[vertex.position.x, vertex.position.y - 0.55, 0]}
              fontSize={0.1}
              color="#94a3b8"
              anchorX="center"
            >
              R{vertex.round}-P{vertex.author}
            </Text>

            {/* TX count */}
            <Text
              position={[vertex.position.x, vertex.position.y + 0.5, 0]}
              fontSize={0.08}
              color="#6b7280"
              anchorX="center"
            >
              {vertex.transactions} txs
            </Text>

            {/* Parent edges */}
            {vertex.parents.map((parentId) => {
              const parent = dagVertices.find((v) => v.id === parentId);
              if (!parent) return null;
              return (
                <Line
                  key={`${vertex.id}-${parentId}`}
                  points={[
                    [vertex.position.x, vertex.position.y + 0.35, 0],
                    [parent.position.x, parent.position.y - 0.35, 0],
                  ]}
                  color={vertex.status === "committed" ? "#22c55e" : "#6fbcf0"}
                  lineWidth={1}
                  transparent
                  opacity={0.5}
                />
              );
            })}
          </group>
        ))}

        {/* Round labels on the right */}
        {dagRound >= 1 && (
          <Text position={[7.5, 2.5, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
            Round 1
          </Text>
        )}
        {dagRound >= 2 && (
          <Text position={[7.5, 1, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
            Round 2
          </Text>
        )}
        {dagRound >= 3 && (
          <Text position={[7.5, -0.5, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
            Round 3 (Anchor)
          </Text>
        )}
      </group>

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Info Panel */}
      <group position={[-6, -2.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#6fbcf0" anchorX="left">
          {t.networkStats.sui.suiNetwork}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.15} color="#94a3b8" anchorX="left">
          {t.networkStats.sui.tpsBlockFinality}
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {t.networkStats.sui.dagBasedMempool}
        </Text>
      </group>

      {/* Architecture explanation */}
      <group position={[4, -2.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#fbbf24" anchorX="left">
          🦈 Bullshark Ordering
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          Anchor committed → Causal order determined
        </Text>
        <Text position={[0, -0.55, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          → Parallel execution of non-conflicting TXs
        </Text>
      </group>

      {/* Anchor committed indicator */}
      {anchorCommitted && (
        <group position={[1, -1.8, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.22} color="#22c55e" anchorX="center">
            ✓ ANCHOR COMMITTED
          </Text>
          <Text position={[0, -0.3, 0]} fontSize={0.14} color="#94a3b8" anchorX="center">
            {t.networkStats.sui.parallelExecution}
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
export const SuiScene = memo(SuiSceneComponent);
