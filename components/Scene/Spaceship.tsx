import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

// 优化后的模型：Draco 几何体压缩 + WebP 纹理压缩 (254MB → 6.3MB)
const MODEL_URL = 'https://pub-ef918f4135654b1caa2833736c639ae1.r2.dev/models/ship_optimized.glb';

// Draco 解码器路径 (Google CDN)
const DRACO_PATH = 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

const Spaceship = () => {
   const group = useRef<Group>(null);
   const { scene } = useGLTF(MODEL_URL, DRACO_PATH);

   // Subtle hover + slow roll to keep the model alive.
   useFrame(({ clock }) => {
      if (!group.current) return;
      const t = clock.elapsedTime;
      group.current.position.y = Math.sin(t * 0.5) * 0.2;
      group.current.rotation.y = t * 0.1;
   });

   return (
      <primitive
         ref={group}
         object={scene}
         scale={2.5}
         position={[0, 0, 0]}
         castShadow
         receiveShadow
         dispose={null}
      />
   );
};

useGLTF.preload(MODEL_URL, DRACO_PATH);

export default Spaceship;