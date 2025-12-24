
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FractalStar: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.5;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.2;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef} position={[0, 12.5, 0]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          emissive="#fbbf24" 
          emissiveIntensity={15} 
          metalness={1} 
          roughness={0} 
        />
      </mesh>

      {/* Fractal Arms - Iterative approach using group nesting for visual complexity */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 3, 0]}>
          <mesh position={[1.5, 0, 0]}>
            <boxGeometry args={[2, 0.1, 0.1]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={10} />
          </mesh>
          {/* Fractal branches */}
          <group position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
             <mesh position={[0.4, 0, 0]}>
                <boxGeometry args={[0.8, 0.05, 0.05]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={8} />
             </mesh>
          </group>
          <group position={[1.8, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
             <mesh position={[0.4, 0, 0]}>
                <boxGeometry args={[0.8, 0.05, 0.05]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={8} />
             </mesh>
          </group>
        </group>
      ))}
      
      {/* Vertical Axis Star segments */}
      {[0, 1, 2].map((i) => (
        <group key={`v-${i}`} rotation={[ (i * Math.PI) / 1.5, 0, Math.PI / 2]}>
          <mesh position={[1, 0, 0]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={12} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default FractalStar;
