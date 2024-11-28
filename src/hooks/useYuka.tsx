import { useFrame } from "@react-three/fiber";
import { ReactNode, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  EntityManager,
  FollowPathBehavior,
  GameEntity,
  NavMesh,
  OnPathBehavior,
  SteeringManager,
} from "yuka";
import { entityContext } from "../store/entity";
import { createConvexRegionHelper } from "../util/createConvexRegionHelper";
import * as THREE from "three";

export function Manager({ children }: { children: ReactNode }) {
  const [mgr] = useState(() => new EntityManager());
  useFrame((_, delta) => {
    mgr.update(delta);
  });
  return <entityContext.Provider value={mgr}>{children}</entityContext.Provider>;
}

export type NewGameEntity = GameEntity & {
  animationActions: Partial<Record<AnimationType, THREE.AnimationAction>>;
  currentAnimation: AnimationType;
  navMesh?: NavMesh;
  navMeshConvexRegion?: THREE.Mesh;
  maxSpeed?: number;
  maxForce?: number;
  steering?: SteeringManager;
};

export type AnimationType = "idle" | "walk" | "run" | "jump_up" | "dive" | "wave";
export function useYukaInitializeEntity({
  type = GameEntity,
  position = [0, 0, 0] as [number, number, number],
  name = "",
  animations,
  navMesh,
}: {
  type: typeof GameEntity;
  position: [number, number, number];
  name: string;
  animations: THREE.AnimationClip[];
  navMesh: NavMesh;
}) {
  const ref = useRef<THREE.Group>(null);
  const mgr = useContext(entityContext);
  const [entity] = useState<NewGameEntity>(() => new type());
  const mixer = useMemo(() => new THREE.AnimationMixer(ref.current!), []);
  const animationActions = useRef<Partial<Record<AnimationType, THREE.AnimationAction>>>({});

  useEffect(() => {
    if (animations && mixer && ref.current) {
      animations.forEach((item) => {
        if (animationActions.current) {
          if (!animationActions.current[item.name as AnimationType]) {
            animationActions.current[item.name as AnimationType] = mixer.clipAction(
              item,
              ref.current!
            );
          }
        }
      });
      animationActions.current.idle?.play();
      entity.currentAnimation = "idle";
      entity.animationActions = animationActions.current;
    }
  }, [mixer, animations, entity]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });
  useEffect(() => {
    if (!navMesh) return;
    const onPathBehavior = new OnPathBehavior();
    const followPathBehavior = new FollowPathBehavior();

    entity.position.set(...position);

    entity.name = name;
    entity.navMesh = navMesh;
    const navMeshConvexRegion = createConvexRegionHelper(navMesh);
    entity.navMeshConvexRegion = navMeshConvexRegion;

    entity.maxSpeed = 4;
    entity.maxForce = 30;

    followPathBehavior.active = false;
    entity.steering.add(followPathBehavior);

    onPathBehavior.active = false;
    onPathBehavior.predictionFactor = 0.1;
    entity.steering.add(onPathBehavior);
    const _arrive = entity.steering.behaviors[0]._arrive;
    _arrive.tolerance = 0.4;

    entity.setRenderComponent(ref, (entity) => {
      ref.current!.position.copy(entity.position);
      ref.current!.quaternion.copy(entity.rotation);
    });
    mgr!.add(entity);
    return () => {
      mgr!.remove(entity);
    };
  }, [navMesh, entity, mgr, name, position]);

  return [ref, entity] as const;
}
