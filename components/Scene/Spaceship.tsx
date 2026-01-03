import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// Draco 解码器路径 (Google CDN)
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

// 默认模型URL（Imperial Issue），从 R2 CDN 加载
const DEFAULT_MODEL_URL = 'https://pub-ef918f4135654b1caa2833736c639ae1.r2.dev/eve-ss-empire-eve/models/ship_optimized.glb';

interface SpaceshipProps {
  modelPath?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const Spaceship: React.FC<SpaceshipProps> = ({ 
  modelPath, 
  scale = 2.5, 
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
   const group = useRef<Group>(null);
   
   // 如果提供了本地路径，使用本地模型；否则使用默认的R2模型
   const modelUrl = modelPath || DEFAULT_MODEL_URL;
   const { scene } = useGLTF(modelUrl, DRACO_PATH);

   // Subtle hover + slow roll to keep the model alive.
   useFrame(({ clock }) => {
      if (!group.current) return;
      const t = clock.elapsedTime;
      group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.2;
      group.current.rotation.y = rotation[1] + t * 0.1;
   });

   return (
      <primitive
         ref={group}
         object={scene}
         scale={scale}
         position={position}
         rotation={rotation}
         castShadow
         receiveShadow
         dispose={null}
      />
   );
};

// 预加载默认模型
useGLTF.preload(DEFAULT_MODEL_URL, DRACO_PATH);

export default Spaceship;