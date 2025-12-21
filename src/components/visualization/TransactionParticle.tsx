"use client";

import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Transaction } from "@/types/consensus";

// ==========================================
// PROPS
// ==========================================
interface TransactionParticleProps {
  tx: Transaction;
}

// ==========================================
// COMPONENT
// ==========================================
function TransactionParticleComponent({ tx }: TransactionParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current || !tx.target) return;
    meshRef.current.position.lerp(tx.target, 0.05);
  });

  if (tx.status === "included") return null;

  return (
    <mesh ref={meshRef} position={tx.position.toArray()}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
    </mesh>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const TransactionParticle = memo(TransactionParticleComponent);
