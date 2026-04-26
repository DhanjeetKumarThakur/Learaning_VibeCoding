import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../store/useStore';
import * as THREE from 'three';

export function Player() {
  const meshRef = useRef<THREE.Group>(null);
  const { input, playerPos, updatePlayerPos, isGameOver, addProjectile } = useStore();
  
  // Movement settings
  const speed = 25;
  const lerpFactor = 0.1;
  const boundX = 10;
  const boundY = 6;
  
  const lastShotRef = useRef(0);
  const shotCooldown = 150; // ms

  useFrame((state, delta) => {
    if (isGameOver) return;
    
    const [currentX, currentY] = [playerPos[0], playerPos[1]];
    let targetX = currentX;
    let targetY = currentY;

    if (input.left) targetX -= speed * delta;
    if (input.right) targetX += speed * delta;
    if (input.forward) targetY += speed * delta;
    if (input.backward) targetY -= speed * delta;

    // Constraints
    targetX = THREE.MathUtils.clamp(targetX, -boundX, boundX);
    targetY = THREE.MathUtils.clamp(targetY, -boundY, boundY);

    // Smooth movement
    const nextX = THREE.MathUtils.lerp(currentX, targetX, lerpFactor);
    const nextY = THREE.MathUtils.lerp(currentY, targetY, lerpFactor);
    
    updatePlayerPos(nextX, nextY);

    if (meshRef.current) {
      meshRef.current.position.set(nextX, nextY, 0);
      // Tilt effect
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, (currentX - nextX) * 2, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (nextY - currentY) * 2, 0.1);
    }

    // Shooting
    if (input.shooting && Date.now() - lastShotRef.current > shotCooldown) {
      addProjectile(new THREE.Vector3(nextX, nextY, -1));
      lastShotRef.current = Date.now();
    }
  });

  return (
    <group ref={meshRef}>
      {/* Toy Ship Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Cockpit */}
      <mesh position={[0, 0.35, 0.2]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.6} />
      </mesh>
      
      {/* Wings */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[4, 0.1, 1]} />
        <meshStandardMaterial color="#98FF98" />
      </mesh>
      
      {/* Tail Fin */}
      <mesh position={[0, 0.4, 0.8]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.5]} />
        <meshStandardMaterial color="#FF7F50" />
      </mesh>
      
      {/* Engines */}
      <mesh position={[-0.5, -0.1, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#FF7F50" />
      </mesh>
      <mesh position={[0.5, -0.1, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
        <meshStandardMaterial color="#FF7F50" />
      </mesh>
      
      {/* Engine Glow */}
      <pointLight position={[0, 0, 1.5]} intensity={1.5} color="#FFD700" />
    </group>
  );
}
