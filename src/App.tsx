import { Html, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Avatar } from "./components/Avatar";
import { NavMesh } from "./components/NavMesh";
import { Manager } from "./hooks/useYuka";
import { TranslationLogic } from "./components/TranslateLogic";
import { Suspense } from "react";
import { Floors } from "./components/Floor";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <>
      <Canvas camera={{ position: [5, 7.5, 11], near: 1.5, zoom: 1, far: 3000 }}>
        <OrbitControls />
        <pointLight position={[-30, 30, 30]} />
        <directionalLight position={[5, 10, -10]} intensity={5} color="#fcfabb" />
        <ambientLight intensity={1} />
        <Suspense fallback={<Html>loading</Html>}>
          <Physics>
            <Manager>
              <Avatar />
              <TranslationLogic />
            </Manager>
            <NavMesh />
            <Floors />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
