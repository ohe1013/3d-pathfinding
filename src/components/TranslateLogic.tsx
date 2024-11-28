import { useContext, useEffect } from "react";
import { entityContext } from "../store/entity";
import { useThree } from "@react-three/fiber";
import { useGlobalState } from "../store/state";
import { NewGameEntity } from "../hooks/useYuka";
import * as THREE from "three";
import { FollowPathBehavior, NavMesh, OnPathBehavior, Vector3 } from "yuka";

function findPathTo(target: Vector3, vehicle: NewGameEntity, navMesh: NavMesh) {
  const from = vehicle.position;
  const path = navMesh.findPath(from, target);

  const followPathBehavior = vehicle.steering!.behaviors[0] as FollowPathBehavior;
  const onPathBehavior = vehicle.steering!.behaviors[1] as OnPathBehavior;

  followPathBehavior.active = true;
  followPathBehavior.path.clear();
  onPathBehavior.active = true;
  onPathBehavior.path.clear();
  path.forEach((point) => {
    followPathBehavior.path.add(point);
    onPathBehavior.path.add(point);
  });
}

export const TranslationLogic = () => {
  const mgr = useContext(entityContext);

  const { camera, gl } = useThree();

  const mouseEvent = useGlobalState((state) => state.mouseEvent);

  useEffect(() => {
    if (mouseEvent && Object.keys(mouseEvent).length) {
      const avatar = mgr!.getEntityByName("Avatar") as NewGameEntity;
      if (!avatar)
        return () => {
          mgr?.clear();
        };
      const {
        animationActions: { walk },
      } = avatar;
      walk!.play();
      const { navMesh, navMeshConvexRegion } = avatar;
      const raycaster = new THREE.Raycaster();
      const mouseCoordinates = new THREE.Vector2();
      mouseCoordinates.x = (mouseEvent.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouseCoordinates.y = -(mouseEvent.clientY / gl.domElement.clientHeight) * 2 + 1;
      raycaster.setFromCamera(mouseCoordinates, camera);
      const intersects = raycaster.intersectObject(navMeshConvexRegion as THREE.Mesh, true);
      if (intersects.length > 0)
        findPathTo(new Vector3().copy(intersects[0].point as unknown as Vector3), avatar, navMesh!);
    }
  }, [mouseEvent, camera, gl, mgr]);

  return null;
};
