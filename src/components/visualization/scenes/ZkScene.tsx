"use client";

import { memo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars, RoundedBox, Ring } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface ZkSceneProps {
  l2Blocks: ChainBlock[];
  l1Blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  proofProgress: number;
  batchSize: number;
  proofGenerated: boolean;
  currentStep: number;
}

// ==========================================
// ZK PROOF VISUALIZATION
// ==========================================
function ZkProofVisual({ progress, generated }: { progress: number; generated: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current && !generated) {
      ringRef.current.rotation.z += delta * 2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.6, 0.8, 32, 1, 0, (progress / 100) * Math.PI * 2]} />
        <meshBasicMaterial color={generated ? "#22c55e" : "#8b5cf6"} side={THREE.DoubleSide} />
      </mesh>
      <Text position={[0, 0, 0.1]} fontSize={0.2} color={generated ? "#22c55e" : "#8b5cf6"} anchorX="center">
        {generated ? "✓" : `${progress}%`}
      </Text>
    </group>
  );
}

// ==========================================
// COMPONENT
// ==========================================
function ZkSceneComponent({
  l2Blocks,
  l1Blocks,
  validators,
  transactions,
  proofProgress,
  batchSize,
  proofGenerated,
  currentStep,
}: ZkSceneProps) {
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
      <pointLight position={[-3, 0, 3]} intensity={0.4} color="#8b5cf6" />
      <Stars radius={80} depth={50} count={800} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 4.5, 0]} fontSize={0.4} color="#8b5cf6" anchorX="center">
        🟣 ZK ROLLUP
      </Text>
      <Text position={[0, 4, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        zkSync / StarkNet Style
      </Text>

      {/* L2 Layer Label */}
      <group position={[-7, 2, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#8b5cf6" anchorX="left">
          Layer 2
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.15} color="#6b7280" anchorX="left">
          Off-chain execution + ZK proof
        </Text>
      </group>

      {/* L2 Area Background */}
      <mesh position={[0, 2, -1]}>
        <planeGeometry args={[16, 3]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
      </mesh>

      {/* Prover Node */}
      {validators.filter(v => v.role === "prover").map((v) => (
        <group key={v.id} position={v.position.toArray()}>
          <mesh>
            <octahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.4} wireframe />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.35]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
          </mesh>
          <Text position={[0, -0.8, 0]} fontSize={0.15} color="#8b5cf6" anchorX="center">
            ZK Prover
          </Text>
        </group>
      ))}

      {/* Sequencer */}
      {validators.filter(v => v.role === "sequencer").map((v) => (
        <group key={v.id} position={v.position.toArray()}>
          <mesh>
            <cylinderGeometry args={[0.35, 0.35, 0.7, 6]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.2} />
          </mesh>
          <Text position={[0, -0.7, 0]} fontSize={0.13} color="#a855f7" anchorX="center">
            Sequencer
          </Text>
        </group>
      ))}

      {/* L2 Blocks */}
      {l2Blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Proof Generation Visual */}
      {(proofProgress > 0 || proofGenerated) && (
        <group position={[3, 0.5, 0]}>
          <ZkProofVisual progress={proofProgress} generated={proofGenerated} />
          <Text position={[0, -1.2, 0]} fontSize={0.12} color="#8b5cf6" anchorX="center">
            {proofGenerated ? "Validity Proof Ready" : "Generating ZK Proof..."}
          </Text>
        </group>
      )}

      {/* Divider Line */}
      <Line
        points={[[-8, -0.5, 0], [8, -0.5, 0]]}
        color="#374151"
        lineWidth={2}
        dashed
        dashSize={0.3}
        gapSize={0.2}
      />
      <Text position={[0, -0.2, 0]} fontSize={0.12} color="#6b7280" anchorX="center">
        Proof + State Root
      </Text>

      {/* L1 Layer Label */}
      <group position={[-7, -2.5, 0]}>
        <Text position={[0, 0.5, 0]} fontSize={0.3} color="#627eea" anchorX="left">
          Layer 1 (Ethereum)
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.15} color="#6b7280" anchorX="left">
          Verify proof & finalize
        </Text>
      </group>

      {/* L1 Area Background */}
      <mesh position={[0, -2.5, -1]}>
        <planeGeometry args={[16, 2.5]} />
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

      {/* Batch Info */}
      {batchSize > 0 && (
        <group position={[-4, 0.5, 0]}>
          <RoundedBox args={[1.8, 0.8, 0.1]} radius={0.1}>
            <meshStandardMaterial color="#1f2937" />
          </RoundedBox>
          <Text position={[0, 0.1, 0.1]} fontSize={0.12} color="#8b5cf6" anchorX="center">
            Batch Size
          </Text>
          <Text position={[0, -0.15, 0.1]} fontSize={0.2} color="#8b5cf6" anchorX="center">
            {batchSize} TXs
          </Text>
        </group>
      )}

      {/* Info Panel */}
      <group position={[-7, -4.2, 0]}>
        <Text position={[0, 0.4, 0]} fontSize={0.18} color="#8b5cf6" anchorX="left">
          📊 ZK Rollup
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          Block: ~1s | Finality: ~10min (proof)
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          Cryptographic proof = instant validity
        </Text>
      </group>

      {/* Process Flow */}
      <group position={[0, -4.2, 0]}>
        <Text position={[-3, 0, 0]} fontSize={0.12} color={currentStep >= 1 ? "#22c55e" : "#6b7280"} anchorX="center">
          1. Batch TX
        </Text>
        <Text position={[-1.5, 0, 0]} fontSize={0.12} color={currentStep >= 2 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.12} color={currentStep >= 2 ? "#8b5cf6" : "#6b7280"} anchorX="center">
          2. ZK Proof
        </Text>
        <Text position={[1.5, 0, 0]} fontSize={0.12} color={currentStep >= 3 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[3, 0, 0]} fontSize={0.12} color={currentStep >= 3 ? "#22c55e" : "#6b7280"} anchorX="center">
          3. Verify
        </Text>
        <Text position={[4.5, 0, 0]} fontSize={0.12} color={currentStep >= 4 ? "#22c55e" : "#6b7280"} anchorX="center">
          →
        </Text>
        <Text position={[6, 0, 0]} fontSize={0.12} color={currentStep >= 4 ? "#22c55e" : "#6b7280"} anchorX="center">
          4. Finalized
        </Text>
      </group>

      {/* ZK vs Optimistic comparison */}
      <group position={[5.5, -4.2, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          ✓ No challenge period
        </Text>
        <Text position={[0, -0.25, 0]} fontSize={0.1} color="#22c55e" anchorX="left">
          ✓ Math proves validity
        </Text>
      </group>

      <Effects />
    </>
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const ZkScene = memo(ZkSceneComponent);
