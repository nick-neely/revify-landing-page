import { ReactThreeFiber } from "@react-three/fiber";

declare module "@react-three/fiber" {
  export const Canvas: ReactThreeFiber.Canvas;
  export function useFrame(callback: (state: any, delta: number) => void): void;
}
