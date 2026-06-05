"use client";

import dynamic from "next/dynamic";

/**
 * HelmSceneLoader — client boundary that dynamically imports the Three.js
 * HelmScene with ssr:false. `ssr:false` dynamic imports are only permitted
 * inside Client Components, so this thin wrapper lets the Server Component
 * homepage render the WebGL centerpiece safely.
 */
const HelmScene = dynamic(() => import("@/components/HelmScene"), {
  ssr: false,
  loading: () => <div className="h-[400px] animate-pulse rounded bg-[#080810]" />,
});

export function HelmSceneLoader() {
  return <HelmScene />;
}
