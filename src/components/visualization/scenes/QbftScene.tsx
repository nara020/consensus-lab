"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface QbftSceneProps {
  validators: Validator[];
  currentBlock: ChainBlock | null;
  transactions: Transaction[];
  prepareCount: number;
  commitCount: number;
  blocks: ChainBlock[];
}

// ==========================================
// COMPONENT
// ==========================================
function QbftSceneComponent({
  validators,
  currentBlock,
  transactions,
  prepareCount,
  commitCount,
  blocks,
}: QbftSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 11), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const required = Math.ceil((validators.length * 2) / 3);
  const hasBlocks = blocks.length > 0;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.4} color="#3c3c3d" anchorX="center">
        🛡️ HYPERLEDGER BESU - IBFT 2.0
      </Text>

      {/* Vote counts */}
      <group position={[-5.5, 2.2, 0]}>
        <Text position={[0, 0.35, 0]} fontSize={0.2} color="#3b82f6" anchorX="left">
          {t.ui.prepare}: {prepareCount}/{validators.length} ({t.ui.need} {required})
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.2} color="#22c55e" anchorX="left">
          {t.ui.commit}: {commitCount}/{validators.length} ({t.ui.need} {required})
        </Text>
      </group>

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Validators in a circle */}
      {validators.map((v) => (
        <Node key={v.id} validator={v} />
      ))}

      {/* Current proposed block in center */}
      {currentBlock && (
        <group position={[0, 0, 0]}>
          <Block block={currentBlock} showLabel={false} />
          <Text position={[0, 0.5, 0]} fontSize={0.14} color="#fbbf24" anchorX="center">
            {t.ui.proposed} Block
          </Text>
        </group>
      )}

      {/* Vote lines from validators to center */}
      {validators
        .filter((v) => v.vote !== "none")
        .map((v) => (
          <ChainLine
            key={`vote-${v.id}`}
            from={v.position}
            to={new THREE.Vector3(0, 0, 0)}
            color={v.vote === "commit" ? "#22c55e" : "#3b82f6"}
            opacity={0.4}
          />
        ))}

      {/* Finalized blocks chain */}
      {blocks.map((b) => (
        <Block key={b.id} block={b} />
      ))}
      {blocks.map((b, i) => {
        if (i === 0) return null;
        return (
          <ChainLine
            key={`bline-${b.id}`}
            from={blocks[i - 1].position}
            to={b.position}
            color="#22c55e"
            opacity={0.6}
          />
        );
      })}

      {/* Right Info Panel - BFT & Performance */}
      <group position={[4.2, 0.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#ef4444" anchorX="left">
          🛡️ {t.networkStats.qbft.bft}
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.14} color="#22c55e" anchorX="left">
          {t.networkStats.qbft.bftAllows}
        </Text>
        <Text position={[0, -0.56, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          {t.networkStats.qbft.quorumFormula}
        </Text>
        <Text position={[0, -0.82, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          {t.networkStats.qbft.tpsBlockInstant}
        </Text>
      </group>

      {/* Left Info Panel - Comparison */}
      <group position={[-5, -1.8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#f59e0b" anchorX="left">
          ⚡ {t.networkStats.qbft.bftVsCft}
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.14} color="#22c55e" anchorX="left">
          {t.networkStats.qbft.ibftTolerance}
        </Text>
        <Text position={[0, -0.52, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          {t.networkStats.qbft.raftTolerance}
        </Text>
      </group>

      {/* Instant Finality */}
      {hasBlocks && (
        <group position={[-5, -2.6, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.18} color="#22c55e" anchorX="left">
            ✓ {t.ui.instantFinality}
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.12} color="#94a3b8" anchorX="left">
            {t.ui.noForkPossible}
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
export const QbftScene = memo(QbftSceneComponent);
