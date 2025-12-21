"use client";

import { memo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// ==========================================
// PROPS
// ==========================================
interface ChainLineProps {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  opacity?: number;
  dashed?: boolean;
}

// ==========================================
// COMPONENT
// ==========================================
function ChainLineComponent({
  from,
  to,
  color,
  opacity = 0.5,
  dashed = false,
}: ChainLineProps) {
  return (
    <Line
      points={[from.toArray(), to.toArray()]}
      color={color}
      lineWidth={dashed ? 1 : 2}
      transparent
      opacity={opacity}
      dashed={dashed}
      dashSize={0.1}
      dashScale={2}
    />
  );
}

// ==========================================
// MEMOIZED EXPORT
// ==========================================
export const ChainLine = memo(ChainLineComponent);
