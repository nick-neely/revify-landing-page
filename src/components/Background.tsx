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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {isVisible && <MemoizedParticleField />}
    </div>
  );
}
