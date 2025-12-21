"use client";

import { memo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock } from "@/types/consensus";
import { BLOCK_STATUS_COLORS } from "@/constants/consensusInfo";

// ==========================================
// PROPS
// ==========================================
interface BlockProps {
  block: ChainBlock;
  showLabel?: boolean;
}

// ==========================================
// COMPONENT
// ==========================================
function BlockComponent({ block, showLabel = true }: BlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    setScale(0);
    const timer = setTimeout(() => setScale(1), 50);
    return () => clearTimeout(timer);
  }, [block.id]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const currentScale = meshRef.current.scale.x;
    const targetScale = block.status === "orphaned" ? 0.3 : scale;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
    );

    if (block.status === "mining") {
      meshRef.current.rotation.y += 0.05;
    }

    if (["finalized", "committed", "confirmed"].includes(block.status)) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      meshRef.current.scale.multiplyScalar(pulse);
    }
  });

  const color = BLOCK_STATUS_COLORS[block.status] || "#6b7280";
  const isActive = block.status !== "orphaned";
  const isAnimated = ["finalized", "committed", "confirmed"].includes(block.status);
  const isWireframe = block.status === "mining" || block.status === "proposed";

  return (
    <group position={block.position.toArray()}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isAnimated ? 0.6 : 0.2}
          transparent
          opacity={isActive ? 0.9 : 0.2}
          wireframe={isWireframe}
        />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.55, 0.55, 0.55)]} />
        <lineBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.1}
        />
      </lineSegments>

      {showLabel && isActive && (
        <Text
          position={[0, -0.45, 0]}
          fontSize={0.12}
          color={color}
          anchorX="center"
        >
          #{block.blockNumber}
        </Text>
      )}

      {block.txCount !== undefined && isActive && (
        <Text
          position={[0, 0.45, 0]}
          fontSize={0.08}
          color="#fbbf24"
          anchorX="center"
        >
          {block.txCount} tx
        </Text>
      )}

      {isAnimated && <pointLight intensity={1} color={color} distance={2} />}
    </group>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const Block = memo(BlockComponent);
