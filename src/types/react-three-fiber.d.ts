import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  export const Canvas: ReactThreeFiber.Canvas;
  export function useFrame(
    callback: (state: RootState, delta: number) => void
  ): void;

  interface RootState {
    clock: THREE.Clock;
    camera: THREE.Camera;
    scene: THREE.Scene;
  }
}
