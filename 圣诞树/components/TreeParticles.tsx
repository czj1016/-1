
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState } from '../src/types';

interface TreeParticlesProps {
  state: TreeMorphState;
  needleCount?: number;
}

const TreeParticles: React.FC<TreeParticlesProps> = ({ state, needleCount = 15000 }) => {
  const needleMeshRef = useRef<THREE.InstancedMesh>(null);
  const ballMeshRef = useRef<THREE.InstancedMesh>(null);
  const bellMeshRef = useRef<THREE.InstancedMesh>(null);
  const starMeshRef = useRef<THREE.InstancedMesh>(null);
  const ribbonMeshRef = useRef<THREE.InstancedMesh>(null);
  const lightMeshRef = useRef<THREE.InstancedMesh>(null);
  const candyCaneMeshRef = useRef<THREE.InstancedMesh>(null);
  const giftMeshRef = useRef<THREE.InstancedMesh>(null);
  
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  
  const ballCount = 150;
  const bellCount = 80;
  const starCount = 60;
  const ribbonCount = 5000; 
  const lightCount = 300;
  const candyCaneParticleCount = 800;
  const giftCount = 12;

  const getTreePos = (height: number) => {
    const treeY = (Math.random()) * height;
    const normalizedY = treeY / height; 
    const tiers = 5;
    const tierExpansion = 1 + Math.sin(normalizedY * Math.PI * tiers) * 0.12;
    const maxRadius = 5.2 * (1 - normalizedY) * tierExpansion;
    const angle = Math.random() * Math.PI * 2;
    const distFactor = 0.7 + Math.random() * 0.3; 
    const currentRadius = distFactor * maxRadius;
    
    return new THREE.Vector3(Math.cos(angle) * currentRadius, treeY, Math.sin(angle) * currentRadius);
  };

  const getScatterPos = (radiusRange: [number, number]) => {
    const radius = radiusRange[0] + Math.random() * radiusRange[1];
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(2 * Math.random() - 1);
    return new THREE.Vector3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
  };

  // Abstract Candy Canes: Clusters of red/white particles
  const candyCaneData = useMemo(() => {
    const data = [];
    for (let i = 0; i < candyCaneParticleCount; i++) {
      const clusterId = Math.floor(i / 20); // 20 particles per cane
      const treePos = getTreePos(11);
      // Offset particles within the cluster to form a small spiral
      const clusterAngle = (i % 20) * 0.6;
      const spiralOffset = new THREE.Vector3(Math.cos(clusterAngle) * 0.15, (i % 20) * 0.04, Math.sin(clusterAngle) * 0.15);
      
      data.push({
        scatterPos: getScatterPos([18, 10]),
        treePos: treePos.add(spiralOffset),
        color: new THREE.Color(i % 2 === 0 ? "#ffffff" : "#ff0000"), // Alternating Red/White
        speed: 0.1 + Math.random() * 0.1,
        offset: Math.random() * Math.PI,
        size: 0.05
      });
    }
    return data;
  }, []);

  const giftData = useMemo(() => {
    return Array.from({ length: giftCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 4;
      return {
        scatterPos: getScatterPos([15, 5]),
        treePos: new THREE.Vector3(Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius),
        color: new THREE.Color(["#065f46", "#dc2626", "#fbbf24"][Math.floor(Math.random() * 3)]),
        size: 0.6 + Math.random() * 0.8,
        rotation: [Math.random() * 0.2, Math.random() * Math.PI, 0]
      };
    });
  }, []);

  // Previous Data structures remain same
  const needleData = useMemo(() => Array.from({ length: needleCount }, () => ({
    scatterPos: getScatterPos([15, 12]),
    treePos: getTreePos(12),
    color: new THREE.Color(["#064e3b", "#065f46", "#047857", "#10b981", "#022c22"][Math.floor(Math.random() * 5)]),
    speed: 0.02 + Math.random() * 0.04,
    offset: Math.random() * Math.PI * 2
  })), [needleCount]);

  const ballData = useMemo(() => Array.from({ length: ballCount }, () => ({
    scatterPos: getScatterPos([20, 15]),
    treePos: getTreePos(11.5),
    color: new THREE.Color(["#fbbf24", "#34d399", "#d97706"][Math.floor(Math.random() * 3)]),
    size: 0.12 + Math.random() * 0.15,
    speed: 0.04 + Math.random() * 0.06,
    offset: Math.random() * Math.PI * 2
  })), []);

  const bellData = useMemo(() => Array.from({ length: bellCount }, () => ({
    scatterPos: getScatterPos([20, 15]),
    treePos: getTreePos(11.5),
    color: new THREE.Color(["#f59e0b", "#fbbf24"][Math.floor(Math.random() * 2)]),
    size: 0.15 + Math.random() * 0.1,
    speed: 0.04 + Math.random() * 0.06,
    offset: Math.random() * Math.PI * 2
  })), []);

  const starData = useMemo(() => Array.from({ length: starCount }, () => ({
    scatterPos: getScatterPos([20, 15]),
    treePos: getTreePos(11.5),
    color: new THREE.Color(["#ffffff", "#fef3c7", "#fbbf24"][Math.floor(Math.random() * 3)]),
    size: 0.1 + Math.random() * 0.1,
    speed: 0.04 + Math.random() * 0.06,
    offset: Math.random() * Math.PI * 2
  })), []);

  const ribbonData = useMemo(() => {
    const data = [];
    for (let i = 0; i < ribbonCount; i++) {
      const t = i / ribbonCount;
      const angle = t * Math.PI * 2 * 8;
      const radius = 5.6 * (1 - t) * 0.98;
      data.push({
        scatterPos: getScatterPos([25, 10]),
        treePos: new THREE.Vector3(Math.cos(angle) * radius, t * 12, Math.sin(angle) * radius),
        targetAngle: angle,
        normalizedY: t,
        color: new THREE.Color("#dc2626"),
        size: 0.04 + Math.random() * 0.06,
        speed: 0.03 + Math.random() * 0.02,
        offset: Math.random() * Math.PI * 2
      });
    }
    return data;
  }, []);

  const lightData = useMemo(() => Array.from({ length: lightCount }, () => ({
    scatterPos: getScatterPos([20, 15]),
    treePos: getTreePos(12),
    color: new THREE.Color(["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"][Math.floor(Math.random() * 5)]),
    size: 0.08,
    speed: 1.5 + Math.random() * 2.0,
    offset: Math.random() * Math.PI * 2
  })), []);

  const lerpState = useRef({
    needle: new Float32Array(needleCount).fill(0),
    ball: new Float32Array(ballCount).fill(0),
    bell: new Float32Array(bellCount).fill(0),
    star: new Float32Array(starCount).fill(0),
    ribbon: new Float32Array(ribbonCount).fill(0),
    light: new Float32Array(lightCount).fill(0),
    candyCane: new Float32Array(candyCaneParticleCount).fill(0),
    gift: new Float32Array(giftCount).fill(0),
  });

  useFrame((stateContext) => {
    const time = stateContext.clock.getElapsedTime();
    const targetLerp = state === TreeMorphState.TREE_SHAPE ? 1 : 0;

    const updateInstances = (meshRef: React.RefObject<THREE.InstancedMesh>, data: any[], lerpArray: Float32Array, type: string) => {
      if (!meshRef.current) return;
      for (let i = 0; i < data.length; i++) {
        const p = data[i];
        lerpArray[i] = THREE.MathUtils.lerp(lerpArray[i], targetLerp, 0.015 + Math.random() * 0.01);
        const pos = new THREE.Vector3().lerpVectors(p.scatterPos, p.treePos, lerpArray[i]);
        
        tempObject.position.copy(pos);

        if (type === 'needle') {
          const scale = 0.045 + lerpArray[i] * 0.06;
          tempObject.scale.set(scale, scale * 3, scale);
          tempObject.rotation.set(Math.sin(time * 0.1 + i), Math.cos(time * 0.1 + i), 0);
        } else if (type === 'candyCane') {
          const breath = (Math.sin(time * 3 + p.offset) + 1) * 0.5;
          const scale = p.size * (0.8 + breath * 0.4) * lerpArray[i];
          tempObject.scale.setScalar(scale);
        } else if (type === 'gift') {
          tempObject.scale.setScalar(p.size * lerpArray[i]);
          tempObject.rotation.set(p.rotation[0], p.rotation[1], p.rotation[2]);
        } else if (type === 'light') {
          const breath = (Math.sin(time * p.speed + p.offset) + 1) / 2;
          tempObject.scale.setScalar(p.size * (0.8 + breath * 0.4) * lerpArray[i]);
        } else if (type === 'ribbon') {
          const bottomFade = Math.min(1, p.normalizedY * 4); 
          tempObject.scale.setScalar(p.size * bottomFade * lerpArray[i]);
          tempObject.rotation.set(time * 0.5, -p.targetAngle, 0);
        } else {
          tempObject.scale.setScalar(p.size);
          tempObject.rotation.set(time * 0.8, time * 0.4, time * 0.2);
        }

        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
        meshRef.current.setColorAt(i, p.color);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
      if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    };

    updateInstances(needleMeshRef, needleData, lerpState.current.needle, 'needle');
    updateInstances(ballMeshRef, ballData, lerpState.current.ball, 'ball');
    updateInstances(bellMeshRef, bellData, lerpState.current.bell, 'bell');
    updateInstances(starMeshRef, starData, lerpState.current.star, 'star');
    updateInstances(ribbonMeshRef, ribbonData, lerpState.current.ribbon, 'ribbon');
    updateInstances(lightMeshRef, lightData, lerpState.current.light, 'light');
    updateInstances(candyCaneMeshRef, candyCaneData, lerpState.current.candyCane, 'candyCane');
    updateInstances(giftMeshRef, giftData, lerpState.current.gift, 'gift');
  });

  return (
    <group>
      <instancedMesh ref={needleMeshRef} args={[undefined, undefined, needleCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial emissive="#064e3b" emissiveIntensity={1.2} roughness={0.1} metalness={0.4} />
      </instancedMesh>

      <instancedMesh ref={ballMeshRef} args={[undefined, undefined, ballCount]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial metalness={1} roughness={0.05} envMapIntensity={2} />
      </instancedMesh>

      <instancedMesh ref={bellMeshRef} args={[undefined, undefined, bellCount]}>
        <coneGeometry args={[0.8, 1.2, 12, 1, true]} />
        <meshStandardMaterial color="#fbbf24" metalness={1} roughness={0.1} side={THREE.DoubleSide} />
      </instancedMesh>

      <instancedMesh ref={starMeshRef} args={[undefined, undefined, starCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#fbbf24" emissiveIntensity={4} metalness={1} roughness={0} />
      </instancedMesh>

      <instancedMesh ref={ribbonMeshRef} args={[undefined, undefined, ribbonCount]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#dc2626" roughness={0.1} metalness={1} side={THREE.DoubleSide} />
      </instancedMesh>

      <instancedMesh ref={lightMeshRef} args={[undefined, undefined, lightCount]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial emissiveIntensity={3} roughness={0} metalness={0} transparent opacity={0.9} />
      </instancedMesh>

      {/* Abstract Candy Canes */}
      <instancedMesh ref={candyCaneMeshRef} args={[undefined, undefined, candyCaneParticleCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial emissiveIntensity={2} roughness={0.2} metalness={0.5} />
      </instancedMesh>

      {/* Pixelated Gifts */}
      <instancedMesh ref={giftMeshRef} args={[undefined, undefined, giftCount]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.7} />
      </instancedMesh>
    </group>
  );
};

export default TreeParticles;
