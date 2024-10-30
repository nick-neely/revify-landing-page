"use client";

import usePageVisibility from "@/hooks/usePageVisibility";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";

const ParticleField = dynamic(
  () => import("./ParticleField").then((mod) => mod.ParticleField),
  {
    ssr: false,
  }
);

const MemoizedParticleField = memo(ParticleField);

export function Background() {
  const [isMounted, setIsMounted] = useState(false);
  const isVisible = usePageVisibility();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {isVisible && (
        <MemoizedParticleField
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      )}
    </div>
  );
}
