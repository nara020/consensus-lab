"use client";

import { memo } from "react";

// Temporarily disabled due to WebGL context issues with React 19
// Will be re-enabled when @react-three/postprocessing is compatible
function EffectsComponent() {
  // PostProcessing disabled - returning null
  return null;
}

export const Effects = memo(EffectsComponent);
