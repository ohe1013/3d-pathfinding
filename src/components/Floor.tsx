import { useLoader } from "@react-three/fiber";
import { useGlobalState } from "../store/state";
import { useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

interface FloorMeshData {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  geometry: THREE.BufferGeometry;
  material: THREE.Material | THREE.Material[];
  rotation: THREE.Euler;
}

const FloorMeshes = (prps: FloorMeshData) => {
  const { material, position, scale, rotation, geometry } = prps;
  if (Array.isArray(material)) {
    return null;
  }
  return (
    <RigidBody type="fixed">
      <group>
        <mesh position={position} scale={scale} rotation={rotation} receiveShadow>
          <bufferGeometry attach="geometry" {...geometry} />
          <meshStandardMaterial attach="material" {...material} />
        </mesh>
      </group>
    </RigidBody>
  );
};

export const Floors = () => {
  const [floors, setFloors] = useState<FloorMeshData[]>();

  const gltf = useLoader(GLTFLoader, "/floors.glb");
  const { setMouseEvent } = useGlobalState((state) => state.actions);

  useEffect(() => {
    const tmpArray: FloorMeshData[] = [];
    const { children } = gltf.scene;
    children.forEach((model) => {
      if (model.type === "Mesh") {
        const { position, scale, geometry, material, rotation } = model as THREE.Mesh;
        tmpArray.push({ position, scale, geometry, material, rotation });
      }

      if (model.type === "Group") {
        for (const model2 of model.children) {
          if (model2.type === "Mesh") {
            const { position, scale, geometry, material, rotation } = model2 as THREE.Mesh;
            tmpArray.push({ position, scale, geometry, material, rotation });
          }
        }
      }
      setFloors(tmpArray);
    });
  }, [gltf]);

  return (
    <group
      onClick={(e) => {
        console.log(e);
        setMouseEvent(e);
      }}
    >
      {floors && floors.length && floors.map((data, i) => <FloorMeshes key={i} {...data} />)}
    </group>
  );
};
