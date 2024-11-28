import { useMemo } from "react";
import { useGlobalState } from "../store/state";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
// import * as THREE from "three";
import { NavMeshLoader } from "yuka";
export const NavMesh = () => {
  const { setNavMesh } = useGlobalState((state) => state.actions);

  useMemo(async () => {
    const loader = new NavMeshLoader();
    await loader.load("/navMesh.glb").then((navMesh) => {
      setNavMesh(navMesh);
    });
  }, [setNavMesh]);

  return null;
};

// export const NavMesh = () => {
//   const { setNavMesh } = useGlobalState((state) => state.actions);

//   useMemo(async () => {
//     const loader = new GLTFLoader();
//     loader.load("/navMesh.glb", (data) => {
//       data.scene.traverse((node) => {
//         if (node instanceof THREE.Mesh) {
//           if (node.isMesh) setNavMesh(node);
//         }
//       });
//     });
//   }, [setNavMesh]);

//   return null;
// };
