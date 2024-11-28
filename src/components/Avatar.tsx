import { NewGameEntity, useYukaInitializeEntity } from "../hooks/useYuka";
import { useGlobalState } from "../store/state";
import { Vehicle } from "yuka";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/Addons.js";
import { ObjectMap, useFrame } from "@react-three/fiber";
import { entityContext } from "../store/entity";
import { useContext } from "react";

export function Avatar() {
  const { nodes, materials, animations } = useGLTF("/character.glb") as unknown as GLTF &
    ObjectMap & {
      nodes: {
        body: THREE.SkinnedMesh; // 명시적 타입 정의
        eye: THREE.SkinnedMesh;
        "hand-": THREE.SkinnedMesh;
        leg: THREE.SkinnedMesh;
      };
    };
  const navMesh = useGlobalState((state) => state.navMesh);
  const [ref] = useYukaInitializeEntity({
    type: Vehicle,
    position: [0, 0, 0],
    name: "Avatar",
    animations,
    navMesh: navMesh!,
  });
  const mgr = useContext(entityContext);
  useFrame(() => {
    const avatar = mgr!.getEntityByName("Avatar") as NewGameEntity;
    if (!avatar.steering) return;
    const speed = avatar.steering.vehicle.velocity.length();
    switch (true) {
      case speed > 2: {
        if (avatar.currentAnimation === "run") return;
        avatar.animationActions[avatar.currentAnimation]?.fadeOut(0.2);
        avatar.currentAnimation = "run";
        avatar.animationActions.run!.reset().fadeIn(0.2).play();
        break;
      }
      case speed > 1: {
        if (avatar.currentAnimation === "walk") return;
        avatar.animationActions[avatar.currentAnimation]?.fadeOut(0.2);
        avatar.currentAnimation = "walk";
        avatar.animationActions.walk!.reset().fadeIn(0.2).play();
        break;
      }
      default: {
        if (avatar.currentAnimation === "idle") return;
        avatar.animationActions[avatar.currentAnimation]?.fadeOut(0.2);
        avatar.currentAnimation = "idle";
        avatar.animationActions.idle!.reset().fadeIn(0.2).play();
      }
    }
  });
  return (
    <group ref={ref} dispose={null}>
      <group name="Scene">
        <group name="fall_guys">
          <primitive object={nodes._rootJoint} />
          <mesh>
            <skinnedMesh
              name="body"
              geometry={nodes.body.geometry}
              material={materials.Material}
              skeleton={nodes.body.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="eye"
              geometry={nodes.eye.geometry}
              material={materials.Material}
              skeleton={nodes.eye.skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="hand-"
              geometry={nodes["hand-"].geometry}
              material={materials.Material}
              skeleton={nodes["hand-"].skeleton}
              castShadow
              receiveShadow
            />
            <skinnedMesh
              name="leg"
              geometry={nodes.leg.geometry}
              material={materials.Material}
              skeleton={nodes.leg.skeleton}
              castShadow
              receiveShadow
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
