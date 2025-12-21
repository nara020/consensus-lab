"use client";

import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { Validator } from "@/types/consensus";
import { ROLE_COLORS, VOTE_COLORS } from "@/constants/consensusInfo";

// ==========================================
// PROPS
// ==========================================
interface NodeProps {
  validator: Validator;
}

// ==========================================
// COMPONENT
// ==========================================
function NodeComponent({ validator }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (validator.role === "leader" || validator.role === "proposer") {
      const p = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(p);
    }

    if (validator.vote !== "none") {
      meshRef.current.rotation.y += 0.02;
    }
  });

  const baseColor = ROLE_COLORS[validator.role] || "#6b7280";
  const voteColor = VOTE_COLORS[validator.vote];
  const isLeaderOrProposer =
    validator.role === "leader" || validator.role === "proposer";
  const displayName =
    validator.name ||
    (validator.role === "miner" ? `Miner ${validator.id}` : `V${validator.id}`);

  return (
    <group position={validator.position.toArray()}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={validator.active ? 0.4 : 0.1}
          transparent
          opacity={validator.active ? 0.9 : 0.3}
        />
      </mesh>

      {voteColor && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.35, 0.04, 8, 16]} />
          <meshBasicMaterial color={voteColor} transparent opacity={0.8} />
        </mesh>
      )}

      <Text
        position={[0, -0.45, 0]}
        fontSize={0.1}
        color={baseColor}
        anchorX="center"
      >
        {displayName}
      </Text>

      {isLeaderOrProposer && (
        <>
          <Text
            position={[0, 0.55, 0]}
            fontSize={0.08}
            color={baseColor}
            anchorX="center"
          >
            {validator.role === "leader" ? "👑 LEADER" : "📢 PROPOSER"}
          </Text>
          <pointLight intensity={0.8} color={baseColor} distance={2.5} />
        </>
      )}
    </group>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const Node = memo(NodeComponent);
