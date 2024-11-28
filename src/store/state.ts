import { NavMesh } from "yuka";
import { create } from "zustand";
import * as THREE from "three";
import { ThreeEvent } from "@react-three/fiber";

interface GlobalState {
  mouseEvent?: ThreeEvent<MouseEvent>;
  navMesh?: NavMesh;
  animation?: THREE.AnimationAction;
  actions: {
    setMouseEvent: (mouseEvent: ThreeEvent<MouseEvent>) => void;
    setNavMesh: (navMesh: NavMesh) => void;
    setAnimation: (animation: THREE.AnimationAction) => void;
  };
}

export const useGlobalState = create<GlobalState>((set) => ({
  mouseEvent: undefined,
  navMesh: undefined,
  animation: undefined,
  actions: {
    setMouseEvent: (mouseEvent) => set(() => ({ mouseEvent })),
    setNavMesh: (navMesh) => set(() => ({ navMesh })),
    setAnimation: (animation) => set(() => ({ animation })),
  },
}));
