"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, MeshDistortMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";

/**
 * HelmScene — the Three.js centerpiece for the Apex Grid homepage. An abstract
 * helmet built from primitives (distorted sphere shell + cyan visor) lit with
 * racing-red and cyan rim lights, slow auto-rotating. Must be loaded via
 * next/dynamic with ssr:false so WebGL never runs during server render.
 */

function Helmet() {
  const shouldReduce = useReducedMotion();
  return (
    <group>
      {/* Helmet shell */}
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <MeshDistortMaterial
          color="#0A0A0F"
          metalness={0.9}
          roughness={0.1}
          distort={0.1}
          speed={shouldReduce ? 0 : 1.5}
        />
      </mesh>
      {/* Visor */}
      <mesh rotation={[0.3, 0, 0]} position={[0, -0.1, 1]}>
        <sphereGeometry args={[0.85, 32, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color="#00D2FF"
          metalness={1}
          roughness={0}
          opacity={0.4}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function HelmScene() {
  const shouldReduce = useReducedMotion();
  return (
    <Canvas
      className="h-[400px]"
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 2, 2]} color="#E8001C" intensity={2} />
      <pointLight position={[-3, -1, 2]} color="#00D2FF" intensity={1.5} />
      <Helmet />
      <OrbitControls
        autoRotate={!shouldReduce}
        autoRotateSpeed={0.8}
        enableZoom={false}
        enablePan={false}
      />
      <Environment preset="night" />
    </Canvas>
  );
}
