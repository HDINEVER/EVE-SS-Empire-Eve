import React, { useRef, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Nebula background sphere - wrapped in Suspense so it won't block render
const NebulaSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Using a public domain space image that's reliable
  const texture = useLoader(
    THREE.TextureLoader,
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=2048&q=80'
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[120, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        opacity={0.8}
        transparent
      />
    </mesh>
  );
};

const Starfield = () => {
  const starsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Parallax effect for the 3D stars layer
    if (starsRef.current) {
       starsRef.current.rotation.y -= delta * 0.01;
    }
  });

  return (
    <group>
      {/* Nebula background - isolated in its own Suspense */}
      <Suspense fallback={null}>
        <NebulaSphere />
      </Suspense>

      <group ref={starsRef}>
        {/* Standard Starfield */}
        <Stars 
          radius={90} 
          depth={20} 
          count={5000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={0.5} 
        />
        
        {/* Dense Blue Cluster Core */}
        <Sparkles 
          count={800}
          scale={40}
          size={3}
          speed={0.4}
          opacity={0.6}
          color="#aaddff"
          noise={10} 
        />
        
        {/* Scattered Red/Gold Particles */}
        <Sparkles 
          count={200}
          scale={50}
          size={4}
          speed={0.1}
          opacity={0.4}
          color="#ffaa88"
        />
      </group>
    </group>
  );
};

export default Starfield;