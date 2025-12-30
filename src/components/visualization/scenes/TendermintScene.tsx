"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface TendermintSceneProps {
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  currentBlock: ChainBlock | null;
  tendermintRound: number;
  tendermintHeight: number;
  prevoteCount: number;
  precommitCount: number;
}

// ==========================================
// COMPONENT
// ==========================================
function TendermintSceneComponent({
  blocks,
  validators,
  transactions,
  currentBlock,
  tendermintRound,
  tendermintHeight,
  prevoteCount,
  precommitCount,
}: TendermintSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 0, 12), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const _proposer = validators.find((v) => v.role === "proposer");
  void _proposer; // Reserved for future proposer highlighting

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[0, 3.8, 0]} fontSize={0.35} color="#2e3148" anchorX="center">
        ⚛️ TENDERMINT - CometBFT Consensus
      </Text>

      {/* Height and Round info */}
      <group position={[-5.5, 2.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.22} color="#6366f1" anchorX="left">
          {t.ui.height}: {tendermintHeight}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.18} color="#8b5cf6" anchorX="left">
          {t.ui.round}: {tendermintRound}
        </Text>
      </group>

      {/* Validator Circle */}
      {validators.map((v, i) => {
        const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const pos = new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 2, 0);
        return (
          <group key={v.id}>
            <Node validator={{ ...v, position: pos }} />
            <Text
              position={[pos.x, pos.y - 0.6, 0]}
              fontSize={0.16}
              color={v.role === "proposer" ? "#6366f1" : "#94a3b8"}
              anchorX="center"
            >
              {v.name} {v.role === "proposer" ? "(Proposer)" : ""}
            </Text>
            {/* Vote indicator */}
            {v.vote !== "none" && (
              <Text
                position={[pos.x, pos.y + 0.6, 0]}
                fontSize={0.14}
                color={v.vote === "prevote" ? "#6366f1" : "#22c55e"}
                anchorX="center"
              >
                {v.vote === "prevote" ? "PREVOTE ✓" : "PRECOMMIT ✓"}
              </Text>
            )}
          </group>
        );
      })}

      {/* Connection lines between validators */}
      {validators.map((v1, i) =>
        validators.slice(i + 1).map((v2, j) => {
          const angle1 = (i / 4) * Math.PI * 2 - Math.PI / 2;
          const angle2 = ((i + j + 1) / 4) * Math.PI * 2 - Math.PI / 2;
          return (
            <Line
              key={`line-${v1.id}-${v2.id}`}
              points={[
                [Math.cos(angle1) * 3, Math.sin(angle1) * 2, 0],
                [Math.cos(angle2) * 3, Math.sin(angle2) * 2, 0],
              ]}
              color="#334155"
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          );
        })
      )}

      {/* Current proposed block in center */}
      {currentBlock && (
        <group position={[0, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
              color={
                currentBlock.status === "precommitted"
                  ? "#22c55e"
                  : currentBlock.status === "prevoted"
                  ? "#6366f1"
                  : "#3b82f6"
              }
              emissive={
                currentBlock.status === "precommitted"
                  ? "#22c55e"
                  : currentBlock.status === "prevoted"
                  ? "#6366f1"
                  : "#3b82f6"
              }
              emissiveIntensity={0.4}
            />
          </mesh>
          <Text position={[0, -0.7, 0]} fontSize={0.14} color="#94a3b8" anchorX="center">
            Block #{currentBlock.blockNumber}
          </Text>
          <Text position={[0, -0.95, 0]} fontSize={0.12} color="#6b7280" anchorX="center">
            {currentBlock.status === "proposed" && "PROPOSED"}
            {currentBlock.status === "prevoted" && "PREVOTED"}
            {currentBlock.status === "precommitted" && "READY TO COMMIT"}
          </Text>
        </group>
      )}

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Vote Progress */}
      <group position={[5.5, 1.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#6366f1" anchorX="left">
          {t.ui.prevote}: {prevoteCount}/4
        </Text>
        <mesh position={[0.8, -0.3, 0]}>
          <planeGeometry args={[2, 0.15]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.2 + (prevoteCount / 4) * 1, -0.3, 0.01]}>
          <planeGeometry args={[(prevoteCount / 4) * 2, 0.15]} />
          <meshBasicMaterial color="#6366f1" />
        </mesh>

        <Text position={[0, -0.7, 0]} fontSize={0.18} color="#22c55e" anchorX="left">
          {t.ui.precommit}: {precommitCount}/4
        </Text>
        <mesh position={[0.8, -1.0, 0]}>
          <planeGeometry args={[2, 0.15]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <mesh position={[-0.2 + (precommitCount / 4) * 1, -1.0, 0.01]}>
          <planeGeometry args={[(precommitCount / 4) * 2, 0.15]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>

        <Text position={[0, -1.5, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {t.ui.need} 2/3+ (3/4)
        </Text>
      </group>

      {/* Committed blocks chain */}
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Chain lines */}
      {blocks.map((block, i) => {
        if (i === 0) return null;
        return (
          <ChainLine
            key={`chain-${block.id}`}
            from={blocks[i - 1].position}
            to={block.position}
            color="#2e3148"
            opacity={0.6}
          />
        );
      })}

      {/* Info Panel */}
      <group position={[-5.5, -2.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#2e3148" anchorX="left">
          {t.networkStats.tendermint.cosmosHub}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.15} color="#94a3b8" anchorX="left">
          {t.networkStats.tendermint.tpsBlockFinality}
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {t.networkStats.tendermint.cosmosEcosystem}
        </Text>
      </group>

      {/* BFT Info */}
      {blocks.length > 0 && (
        <group position={[0, -3.5, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.18} color="#22c55e" anchorX="center">
            {t.ui.instantFinality}
          </Text>
          <Text position={[0, -0.3, 0]} fontSize={0.14} color="#6b7280" anchorX="center">
            {t.networkStats.tendermint.instantFinality}
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
export const TendermintScene = memo(TendermintSceneComponent);
