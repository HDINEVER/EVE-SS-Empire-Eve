import React, { useRef, Suspense } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Nebula background sphere - wrapped in Suspense so it won't block render
const NebulaSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  // Using local high-quality galaxy image
  const texture = useLoader(
    THREE.TextureLoader,
    '/images/galaxy-background.webp'
  );

  // Configure texture to eliminate seams
  React.useEffect(() => {
    if (texture) {
      // Use Repeat wrapping with anisotropic filtering to reduce seams
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping; // ClampToEdge on Y-axis to avoid pole seams
      texture.anisotropy = 16; // Maximum anisotropic filtering
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.003;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Increased segments for smoother sphere and better texture mapping */}
      <sphereGeometry args={[120, 128, 128]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
        opacity={0.85}
        transparent
        depthWrite={false}
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
        
        {/* Dense Blue Cluster Core - Enhanced twinkling */}
        <Sparkles 
          count={800}
          scale={40}
          size={3}
          speed={1.2}
          opacity={0.6}
          color="#aaddff"
          noise={10} 
        />
        
        {/* Scattered Red/Gold Particles - Enhanced twinkling */}
        <Sparkles 
          count={200}
          scale={50}
          size={4}
          speed={0.8}
          opacity={0.4}
          color="#ffaa88"
          noise={8}
        />
        
        {/* Additional white sparkles for more depth */}
        <Sparkles 
          count={400}
          scale={60}
          size={2}
          speed={1.5}
          opacity={0.3}
          color="#ffffff"
          noise={12}
        />
      </group>
    </group>
  );
};

export default Starfield;