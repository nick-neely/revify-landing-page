"use client";

import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { useCallback, useMemo, useRef } from "react";
import * as THREE from "three";
interface ParticleFieldProps {
  mouseX: number;
  mouseY: number;
}
function ParticleFieldContent({ count = 1500, mouseX = 0, mouseY = 0 }) {
  const { theme, systemTheme } = useTheme();
  const points = useRef<THREE.Points>(null);
  const lastUpdateTime = useRef(0);

  // Get the effective theme
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  const updateParticles = useCallback(
    (time: number) => {
      if (points.current) {
        const positions = points.current.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          positions[i3] += Math.sin(time + i3 + mouseX * 0.01) * 0.0005;
          positions[i3 + 1] += Math.cos(time + i3 + 1 + mouseY * 0.01) * 0.0005;
          positions[i3 + 2] += Math.sin(time + i3 + 2) * 0.0005;
        }
        points.current.geometry.attributes.position.needsUpdate = true;
      }
    },
    [count, mouseX, mouseY]
  );

  useFrame((state: { clock: { getElapsedTime: () => number } }) => {
    const time = state.clock.getElapsedTime();
    if (time - lastUpdateTime.current > 0.016) {
      // Throttle updates to 60fps
      updateParticles(time);
      lastUpdateTime.current = time;
    }
  });

  return (
    <Points
      ref={points}
      positions={particlePositions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color={effectiveTheme === "dark" ? "#8080ff" : "#0f172a"} // Use effectiveTheme instead of theme
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

export function ParticleField({ mouseX, mouseY }: ParticleFieldProps) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ParticleFieldContent mouseX={mouseX} mouseY={mouseY} />
    </Canvas>
  );
}
