import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Lightformer, Environment } from '@react-three/drei';
import Spaceship from './Spaceship';
import Starfield from './Starfield';
import LoadingScreen from '../UI/LoadingScreen';
import { ViewMode } from '../../types';

interface SceneViewerProps {
  mode: ViewMode;
  isRotating: boolean;
}

const SceneViewer: React.FC<SceneViewerProps> = ({ mode, isRotating }) => {
  return (
    <div className="w-full h-full bg-black">
      {/* Loading Progress Overlay */}
      <LoadingScreen />
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={45} />

        {/* Lighting - Dramatic Space Lighting */}
        <ambientLight intensity={0.8} />
        {/* Key Light (Sun) */}
        <directionalLight position={[10, 10, 5]} intensity={3} color="#fff" castShadow />
        {/* Rim Light (Blue) */}
        <spotLight position={[-10, 0, -10]} intensity={8} color="#0ea5e9" angle={0.5} penumbra={1} />
        {/* Bounce/Fill Light (Warm) */}
        <pointLight position={[0, -10, 0]} intensity={1} color="#d97706" />
        {/* Front Fill Light */}
        <pointLight position={[0, 5, 10]} intensity={2} color="#ffffff" />
        {/* Back Rim Light */}
        <pointLight position={[0, 2, -10]} intensity={1.5} color="#06b6d4" />

        {/* HDR Environment for realistic reflections */}
        <Suspense fallback={null}>
          <Environment
            files="/hdri/qwantani_night_puresky_2k.hdr"
            background={false}
          />
        </Suspense>
        
        {/* Additional Lightformers for EVE style */}
        <Environment background={false}>
          <Lightformer intensity={1.5} position={[5, 5, 5]} scale={[5, 5, 1]} color="#fff" />
          <Lightformer intensity={2} position={[-10, 2, 0]} scale={[1, 10, 10]} color="#0ea5e9" />
        </Environment>

        {/* Background */}
        <Starfield />

        {/* The Subject (only the model should suspend while loading) */}
        <Suspense fallback={null}>
          <group>
            <Spaceship />
          </group>
        </Suspense>

        {/* Tactical Grid (Only visible in Tactical Mode) */}
        {mode === ViewMode.TACTICAL && (
          <group position={[0, -1.5, 0]}>
            <Grid
              renderOrder={-1}
              position={[0, 0, 0]}
              infiniteGrid
              cellSize={1}
              sectionSize={5}
              fadeDistance={30}
              sectionColor="#0ea5e9"
              cellColor="#0ea5e9"
              sectionThickness={1.5}
              cellThickness={0.6}
            />
          </group>
        )}



        {/* Controls */}
        <OrbitControls
          enablePan={mode === ViewMode.TACTICAL}
          enableZoom={true}
          minDistance={3}
          maxDistance={20}
          autoRotate={isRotating}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default SceneViewer;