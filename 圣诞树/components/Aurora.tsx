
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Aurora: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorGreen: { value: new THREE.Color("#10b981") },
    uColorPurple: { value: new THREE.Color("#7c3aed") },
  }), []);

  const shader = useMemo(() => ({
    vertexShader: `
      varying vec2 vUv;
      varying float vNoise;
      uniform float uTime;
      
      // Simple 2D Noise
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        vUv = uv;
        vec3 pos = position;
        float n = noise(vec2(pos.x * 0.1 + uTime * 0.2, pos.z * 0.1));
        pos.y += n * 5.0;
        vNoise = n;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vNoise;
      uniform float uTime;
      uniform vec3 uColorGreen;
      uniform vec3 uColorPurple;

      void main() {
        float alpha = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
        alpha *= (vNoise * 0.5 + 0.5);
        
        vec3 color = mix(uColorGreen, uColorPurple, vUv.y + sin(uTime * 0.5) * 0.2);
        gl_FragColor = vec4(color, alpha * 0.4);
      }
    `
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 15, -40]} rotation={[0.2, 0, 0]}>
      <planeGeometry args={[150, 40, 64, 64]} />
      <shaderMaterial 
        uniforms={uniforms}
        vertexShader={shader.vertexShader}
        fragmentShader={shader.fragmentShader}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Aurora;
