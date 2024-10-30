import { ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

declare module "@react-three/fiber" {
  export const Canvas: ReactThreeFiber.Canvas;
  export function useFrame(
    callback: (state: RootState, delta: number) => void
  ): void;
  export function useThree(): RootState;
  interface RootState {
    clock: THREE.Clock;
    camera: THREE.Camera;
    scene: THREE.Scene;
    mouse: THREE.Vector2;
    size: {
      width: number;
      height: number;
    };
    viewport: {
      width: number;
      height: number;
      factor: number;
    };
  }
}
