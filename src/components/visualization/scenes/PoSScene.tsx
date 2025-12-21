"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, StakeData } from "@/types/consensus";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface PoSSceneProps {
  blocks: ChainBlock[];
  validators: Validator[];
  transactions: Transaction[];
  currentSlot: number;
  currentEpoch: number;
  attestations: number;
  stakeData: StakeData;
}

// ==========================================
// COMPONENT
// ==========================================
function PoSSceneComponent({
  blocks,
  validators,
  transactions,
  currentSlot,
  currentEpoch,
  attestations,
  stakeData,
}: PoSSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 12), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const hasFinalized = blocks.some((b) => b.status === "finalized");

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.4} color="#627eea" anchorX="center">
        ◆ ETHEREUM - Proof of Stake
      </Text>

      {/* Epoch/Slot info */}
      <Text position={[-5, 2.5, 0]} fontSize={0.22} color="#8b5cf6" anchorX="left">
        {t.ui.epoch} {currentEpoch} | {t.ui.slot} {currentSlot}
      </Text>
      <Text position={[-5, 2.1, 0]} fontSize={0.18} color="#6b7280" anchorX="left">
        {t.ui.attestations}: {attestations}/{validators.length}
      </Text>

      {/* Stake info for each validator */}
      {stakeData.selectedProposer >= 0 &&
        validators.map((v, i) => (
          <group key={`stake-${i}`}>
            <Text
              position={[v.position.x, v.position.y + 0.9, 0]}
              fontSize={0.14}
              color={stakeData.selectedProposer === i ? "#22c55e" : "#94a3b8"}
              anchorX="center"
            >
              {stakeData.stakes[i]} ETH
            </Text>
            <Text
              position={[v.position.x, v.position.y + 0.7, 0]}
              fontSize={0.12}
              color={stakeData.selectedProposer === i ? "#22c55e" : "#6b7280"}
              anchorX="center"
            >
              ({((stakeData.stakes[i] / stakeData.totalStake) * 100).toFixed(0)}%)
            </Text>
            {stakeData.selectedProposer === i && (
              <Text
                position={[v.position.x, v.position.y - 0.7, 0]}
                fontSize={0.13}
                color="#22c55e"
                anchorX="center"
              >
                ✓ {t.steps.pos.selected}
              </Text>
            )}
          </group>
        ))}

      {/* Status legend */}
      <group position={[5, 2, 0]}>
        <Text position={[0, 0.6, 0]} fontSize={0.15} color="#a855f7" anchorX="left">
          ● {t.ui.finalized}
        </Text>
        <Text position={[0, 0.3, 0]} fontSize={0.15} color="#8b5cf6" anchorX="left">
          ● {t.ui.justified}
        </Text>
        <Text position={[0, 0, 0]} fontSize={0.15} color="#3b82f6" anchorX="left">
          ● {t.ui.proposed}
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.15} color="#6b7280" anchorX="left">
          ● {t.ui.pending}
        </Text>
      </group>

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Validators */}
      {validators.map((v) => (
        <Node key={v.id} validator={v} />
      ))}

      {/* Blocks */}
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Chain lines */}
      {blocks.map((block, i) => {
        if (i === 0) return null;
        const color =
          block.status === "finalized"
            ? "#a855f7"
            : block.status === "justified"
            ? "#8b5cf6"
            : block.status === "proposed"
            ? "#3b82f6"
            : "#6b7280";
        return (
          <ChainLine
            key={`line-${block.id}`}
            from={blocks[i - 1].position}
            to={block.position}
            color={color}
          />
        );
      })}

      {/* Attestation lines from validators to current block */}
      {blocks.length > 0 &&
        validators
          .filter((v) => v.vote === "attest")
          .map((v) => (
            <ChainLine
              key={`attest-${v.id}`}
              from={v.position}
              to={blocks[blocks.length - 1].position}
              color="#8b5cf6"
              opacity={0.3}
              dashed
            />
          ))}

      {/* Left Info Panel - Performance & Economics */}
      <group position={[-5.5, -1.8, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#627eea" anchorX="left">
          {t.networkStats.pos.networkStats}
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          {t.networkStats.pos.tpsBlockFinality}
        </Text>
        <Text position={[0, -0.52, 0]} fontSize={0.14} color="#22c55e" anchorX="left">
          {t.networkStats.pos.aprValidatorsStaked}
        </Text>
        <Text position={[0, -0.78, 0]} fontSize={0.14} color="#ef4444" anchorX="left">
          {t.networkStats.pos.slashingWarning}
        </Text>
      </group>

      {/* Finality Guarantee */}
      {hasFinalized && (
        <group position={[-5.5, -2.9, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.16} color="#22c55e" anchorX="left">
            {t.networkStats.pos.finalizedIrreversible}
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.12} color="#94a3b8" anchorX="left">
            {t.networkStats.pos.revertCost}
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
export const PoSScene = memo(PoSSceneComponent);
