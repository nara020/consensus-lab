"use client";

import { memo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Text, Line, Stars } from "@react-three/drei";
import * as THREE from "three";
import type { ChainBlock, Validator, Transaction, MiningData } from "@/types/consensus";
import { REGIONS } from "@/constants/consensusInfo";
import { useI18n } from "@/i18n";
import { Block, Node, ChainLine, TransactionParticle, Effects } from "../index";

// ==========================================
// PROPS
// ==========================================
interface PoWSceneProps {
  blocks: ChainBlock[];
  miners: Validator[];
  transactions: Transaction[];
  forkLengths: number[];
  winningBranch: number;
  miningData: MiningData;
}

// ==========================================
// COMPONENT
// ==========================================
function PoWSceneComponent({
  blocks,
  miners,
  transactions,
  forkLengths,
  winningBranch,
  miningData,
}: PoWSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(3, 2, 16), 0.02);
    camera.lookAt(3, 0, 0);
  });

  const isMining = miningData.mining.some((m) => m);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      {/* Title */}
      <Text position={[2, 4, 0]} fontSize={0.4} color="#f7931a" anchorX="center">
        ₿ BITCOIN - Proof of Work
      </Text>

      {/* Region labels with fork info */}
      {REGIONS.map((region, i) => (
        <group key={region.name}>
          <Text
            position={[-6.5, region.yOffset, 0]}
            fontSize={0.22}
            color={winningBranch === i ? "#22c55e" : region.color}
            anchorX="left"
          >
            {region.name}
          </Text>
          <Text
            position={[10, region.yOffset, 0]}
            fontSize={0.22}
            color={winningBranch === i ? "#22c55e" : "#6b7280"}
            anchorX="left"
          >
            {forkLengths[i]} {t.ui.blocks}{" "}
            {winningBranch === i
              ? `✓ ${t.ui.main}`
              : winningBranch >= 0
              ? `✗ ${t.ui.orphan}`
              : ""}
          </Text>
          {i < 2 && (
            <Line
              points={[
                [-6, region.yOffset - 0.9, 0],
                [10, region.yOffset - 0.9, 0],
              ]}
              color="#333"
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          )}
        </group>
      ))}

      {/* Genesis block - positioned between labels and first blocks */}
      <group position={[-4, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color="#f7931a"
            emissive="#f7931a"
            emissiveIntensity={0.4}
          />
        </mesh>
        <Text position={[0, -0.8, 0]} fontSize={0.14} color="#f7931a" anchorX="center">
          Genesis
        </Text>
      </group>

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Miners */}
      {miners.map((m) => (
        <Node key={m.id} validator={m} />
      ))}

      {/* Mining Status Display */}
      {isMining && (
        <group>
          <Text position={[-6.5, 3.2, 0]} fontSize={0.18} color="#f7931a" anchorX="left">
            Target: hash must start with "0000..."
          </Text>
          {REGIONS.map((region, i) => (
            <group key={`mining-${i}`}>
              {miningData.mining[i] && (
                <>
                  <Text
                    position={[5, region.yOffset + 0.3, 0]}
                    fontSize={0.16}
                    color={miningData.found === i ? "#22c55e" : "#94a3b8"}
                    anchorX="left"
                  >
                    Nonce: {miningData.nonce[i].toLocaleString()}
                  </Text>
                  <Text
                    position={[5, region.yOffset - 0.15, 0]}
                    fontSize={0.14}
                    color={
                      miningData.found === i
                        ? "#22c55e"
                        : miningData.hash[i].startsWith("0000")
                        ? "#22c55e"
                        : "#ef4444"
                    }
                    anchorX="left"
                  >
                    {miningData.hash[i]
                      ? `${miningData.hash[i].slice(0, 14)}...`
                      : "computing..."}
                  </Text>
                  {miningData.found === i && (
                    <Text
                      position={[5, region.yOffset - 0.5, 0]}
                      fontSize={0.18}
                      color="#22c55e"
                      anchorX="left"
                    >
                      ✓ FOUND!
                    </Text>
                  )}
                </>
              )}
            </group>
          ))}
        </group>
      )}

      {/* Blocks */}
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}

      {/* Chain lines */}
      {blocks.map((block, i) => {
        const sameBranch = blocks.filter((b) => b.branch === block.branch);
        const idx = sameBranch.indexOf(block);
        const regionColor = REGIONS[block.branch]?.color || "#f7931a";
        const lineColor = block.status === "orphaned" ? "#ef4444" : regionColor;

        if (idx === 0) {
          return (
            <ChainLine
              key={`line-${block.id}`}
              from={new THREE.Vector3(-4, 0, 0)}
              to={block.position}
              color={lineColor}
              opacity={block.status === "orphaned" ? 0.15 : 0.6}
            />
          );
        } else {
          return (
            <ChainLine
              key={`line-${block.id}`}
              from={sameBranch[idx - 1].position}
              to={block.position}
              color={lineColor}
              opacity={block.status === "orphaned" ? 0.15 : 0.6}
            />
          );
        }
      })}

      {/* Info Panel */}
      <group position={[-6.5, -3.2, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#f7931a" anchorX="left">
          {t.networkStats.pow.blockReward}
        </Text>
        <Text position={[0, -0.35, 0]} fontSize={0.15} color="#94a3b8" anchorX="left">
          {t.networkStats.pow.tpsBlockFinality}
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.14} color="#6b7280" anchorX="left">
          {t.networkStats.pow.networkDelay}
        </Text>
      </group>

      {/* Warning about orphan blocks */}
      {winningBranch >= 0 && (
        <group>
          <Text position={[3, -3.0, 0]} fontSize={0.2} color="#ef4444" anchorX="center">
            ⚠️ {t.steps.pow.orphaned}
          </Text>
          {REGIONS.map((region, i) => {
            if (i === winningBranch) return null;
            const lostBlocks = forkLengths[i];
            const lostAmount = lostBlocks * 310000;
            return (
              <Text
                key={`orphan-${i}`}
                position={[3, -3.35 - (i > winningBranch ? i - 1 : i) * 0.3, 0]}
                fontSize={0.15}
                color="#ef4444"
                anchorX="center"
              >
                {region.name}: -${(lostAmount / 1000).toFixed(0)}K ({lostBlocks} {t.ui.blocks})
              </Text>
            );
          })}
          <Text position={[3, -4.0, 0]} fontSize={0.13} color="#6b7280" anchorX="center">
            {t.networkStats.pow.lostRewards}
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
export const PoWScene = memo(PoWSceneComponent);
