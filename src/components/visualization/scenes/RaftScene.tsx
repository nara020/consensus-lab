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
interface RaftSceneProps {
  validators: Validator[];
  blocks: ChainBlock[];
  transactions: Transaction[];
  logEntries: number;
  replicatedCount: number;
}

// ==========================================
// COMPONENT
// ==========================================
function RaftSceneComponent({
  validators,
  blocks,
  transactions,
  logEntries,
  replicatedCount,
}: RaftSceneProps) {
  const { camera } = useThree();
  const { t } = useI18n();

  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0, 2, 11), 0.02);
    camera.lookAt(0, 0, 0);
  });

  const leader = validators.find((v) => v.role === "leader");
  const followers = validators.filter((v) => v.role === "follower");
  const hasBlocks = blocks.length > 0;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 5, 5]} intensity={0.5} />
      <Stars radius={80} depth={50} count={1000} factor={3} fade speed={0.3} />

      <Text position={[0, 3.5, 0]} fontSize={0.4} color="#2c9ed4" anchorX="center">
        🔷 HYPERLEDGER FABRIC - RAFT
      </Text>

      {/* Log info */}
      <Text position={[-5, 2.5, 0]} fontSize={0.22} color="#2c9ed4" anchorX="left">
        {t.ui.logEntries}: {logEntries}
      </Text>
      <Text position={[-5, 2.1, 0]} fontSize={0.18} color="#22c55e" anchorX="left">
        {t.ui.replicated}: {replicatedCount}/{followers.length} {t.ui.nodes}
      </Text>

      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionParticle key={tx.id} tx={tx} />
      ))}

      {/* Validators */}
      {validators.map((v) => (
        <Node key={v.id} validator={v} />
      ))}

      {/* Connection lines from leader to followers */}
      {leader &&
        followers.map((f) => (
          <ChainLine
            key={`conn-${f.id}`}
            from={leader.position}
            to={f.position}
            color={f.vote === "commit" ? "#22c55e" : "#2c9ed4"}
            opacity={f.vote === "commit" ? 0.6 : 0.2}
            dashed={f.vote !== "commit"}
          />
        ))}

      {/* Committed blocks */}
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

      {/* Right Info Panel - CFT & Heartbeat */}
      <group position={[4, 0.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#f59e0b" anchorX="left">
          ⚙️ {t.networkStats.raft.cft}
        </Text>
        <Text position={[0, -0.3, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          {t.networkStats.raft.cftAllows}
        </Text>
        <Text position={[0, -0.56, 0]} fontSize={0.14} color="#ef4444" anchorX="left">
          {t.networkStats.raft.cftDenies}
        </Text>
        <Text position={[0, -0.84, 0]} fontSize={0.12} color="#6b7280" anchorX="left">
          {t.networkStats.raft.maxFailHeartbeat}
        </Text>
      </group>

      {/* Left Info Panel - Performance */}
      <group position={[-5, -1.5, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.16} color="#2c9ed4" anchorX="left">
          📊 {t.networkStats.raft.performance}
        </Text>
        <Text position={[0, -0.28, 0]} fontSize={0.14} color="#22c55e" anchorX="left">
          {t.networkStats.raft.tpsBlock}
        </Text>
        <Text position={[0, -0.52, 0]} fontSize={0.14} color="#94a3b8" anchorX="left">
          {t.networkStats.raft.finalityNetwork}
        </Text>
      </group>

      {/* Instant Finality */}
      {hasBlocks && (
        <group position={[4, -3.3, 0]}>
          <Text position={[0, 0, 0]} fontSize={0.18} color="#22c55e" anchorX="left">
            ✓ {t.ui.instantFinality}
          </Text>
          <Text position={[0, -0.28, 0]} fontSize={0.12} color="#94a3b8" anchorX="left">
            {t.ui.neverReverted}
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
export const RaftScene = memo(RaftSceneComponent);
