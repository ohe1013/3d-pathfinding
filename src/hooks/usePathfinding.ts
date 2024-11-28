import { Pathfinding } from "three-pathfinding";
import { useGlobalState } from "../store/state";
import { ThreeEvent, useThree } from "@react-three/fiber";

export const usePathfinding = () => {
  const navMesh = useGlobalState((state) => state.navMesh);
  const pathfinding = new Pathfinding();

  const ZONE = "level1";

  const scene = useThree((state) => state.scene);

  const onCharacterMove = (e: ThreeEvent<MouseEvent>) => {
    const char = scene.getObjectByName("fall_guys");
    if (!char) return;
    pathfinding.setZoneData(ZONE, Pathfinding.createZone(navMesh!.geometry!));
    const groupID = pathfinding.getGroup(ZONE, char.position);
    const path = pathfinding.findPath(char.position, e.point, ZONE, groupID);
    console.log(path);
    return path;
  };
  return { onCharacterMove };
};
