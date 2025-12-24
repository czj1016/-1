
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import TreeParticles from './TreeParticles';
import EnvironmentParticles from './EnvironmentParticles';
import Aurora from './Aurora';
import FractalStar from './FractalStar';
import { TreeMorphState } from '../src/types';

interface ExperienceProps {
  treeState: TreeMorphState;
}

const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  return (
    <Canvas
      camera={{ position: [0, 6, 22], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000a08"]} />
      
      <ambientLight intensity={0.1} />
      {/* Warm Gold Highlight */}
      <pointLight position={[10, 15, 10]} intensity={2.5} color="#fbbf24" distance={50} />
      {/* Cool Emerald Fill */}
      <pointLight position={[-10, 5, -10]} intensity={1.5} color="#059669" distance={40} />
      
      {/* Volumetric Beam Simulation: Center Tree Light */}
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.25} 
        penumbra={1} 
        intensity={5} 
        color="#fbbf24" 
        castShadow
      />

      {/* Atmospheric Rim Light */}
      <spotLight 
        position={[0, 30, -10]} 
        angle={0.5} 
        penumbra={0.5} 
        intensity={4} 
        color="#ffffff" 
      />

      <Suspense fallback={null}>
        <Environment preset="night" />
        
        {/* Sky Elements */}
        <Aurora />
        <Stars radius={120} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        <group position={[0, -5, 0]}>
          <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
            <TreeParticles state={treeState} />
            
            {/* Fractal Star Topper */}
            {treeState === TreeMorphState.TREE_SHAPE && (
              <FractalStar />
            )}
          </Float>

          {/* Environment (Snow and Ground) */}
          <EnvironmentParticles treeState={treeState} />
        </group>
        
        <ContactShadows 
          opacity={0.6} 
          scale={30} 
          blur={2} 
          far={15} 
          resolution={256} 
          color="#000000" 
          position={[0, -5, 0]}
        />

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.4} 
            mipmapBlur 
            intensity={2.8} 
            radius={0.7} 
          />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.3} />
        </EffectComposer>
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={45} 
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.85}
        autoRotate={treeState === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
};

export default Experience;
