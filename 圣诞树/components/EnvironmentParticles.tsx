
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { TreeMorphState } from '../src/types';

interface EnvironmentParticlesProps {
  treeState: TreeMorphState;
}

const EnvironmentParticles: React.FC<EnvironmentParticlesProps> = ({ treeState }) => {
  const snowRef = useRef<THREE.Points>(null);
  const groundRef = useRef<THREE.Points>(null);

  const snowCount = 9000;
  const groundCount = 60000;

  const snowData = useMemo(() => {
    const positions = new Float32Array(snowCount * 3);
    const velocities = new Float32Array(snowCount);
    for (let i = 0; i < snowCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      velocities[i] = 0.02 + Math.random() * 0.05;
    }
    return { positions, velocities };
  }, []);

  const groundData = useMemo(() => {
    const positions = new Float32Array(groundCount * 3);
    const colors = new Float32Array(groundCount * 3);
    const gridSize = Math.sqrt(groundCount);
    const spacing = 1.2;
    const offset = (gridSize * spacing) / 2;

    for (let i = 0; i < groundCount; i++) {
      const x = (i % gridSize) * spacing - offset;
      const z = Math.floor(i / gridSize) * spacing - offset;
      positions[i * 3] = x;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = z;

      const brightness = 0.7 + Math.random() * 0.3;
      colors[i * 3] = brightness * 0.6; // Deep emerald base
      colors[i * 3 + 1] = brightness * 0.9;
      colors[i * 3 + 2] = brightness * 0.8;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const isTree = treeState === TreeMorphState.TREE_SHAPE;

    // Update Snow
    if (snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        positions[i * 3 + 1] -= snowData.velocities[i];
        positions[i * 3] += Math.sin(time + i) * 0.01;
        if (positions[i * 3 + 1] < -0.5) {
          positions[i * 3 + 1] = 35;
        }
      }
      snowRef.current.geometry.attributes.position.needsUpdate = true;
      
      const targetOpacity = isTree ? 0.2 : 0.6;
      (snowRef.current.material as THREE.PointsMaterial).opacity = THREE.MathUtils.lerp(
        (snowRef.current.material as THREE.PointsMaterial).opacity,
        targetOpacity,
        0.05
      );
    }

    // Update Ground undulation
    if (groundRef.current) {
      const positions = groundRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < groundCount; i++) {
        const x = positions[i * 3];
        const z = positions[i * 3 + 2];
        const h = Math.sin(x * 0.08 + time * 0.4) * Math.cos(z * 0.08 + time * 0.2) * 1.2;
        positions[i * 3 + 1] = h;
      }
      groundRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -5, 0]}>
      {/* Snow Particles */}
      <points ref={snowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={snowCount} array={snowData.positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#ffffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Ground Particles - Texture Layer */}
      <points ref={groundRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={groundCount} array={groundData.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={groundCount} array={groundData.colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Reflective Ice Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[100, 100]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={50}
          roughness={0.05}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#011f16"
          metalness={0.9}
          mirror={0.8}
        />
      </mesh>
    </group>
  );
};

export default EnvironmentParticles;
