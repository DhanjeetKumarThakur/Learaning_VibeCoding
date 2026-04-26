import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";

export function Enemies() {
  const { enemies, addEnemy, updateEnemies, isGameOver, score } = useStore();
  const spawnTimer = useRef(0);

  // Difficulty scaling
  const spawnRate = Math.max(0.5, 1.5 - score / 1000);
  const speedMultiplier = 1 + score / 2000;

  useFrame((state, delta) => {
    if (isGameOver) return;

    spawnTimer.current += delta;
    if (spawnTimer.current > spawnRate) {
      addEnemy();
      spawnTimer.current = 0;
    }

    updateEnemies(delta, speedMultiplier);
  });

  return (
    <>
      {enemies.map((enemy) => (
        <Enemy key={enemy.id} position={enemy.position} type={enemy.type} />
      ))}
    </>
  );
}

function Enemy({ position, type }: { position: THREE.Vector3; type: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position);
      meshRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group ref={meshRef}>
      {type === "basic" && (
        <mesh castShadow>
          <coneGeometry args={[0.8, 1.5, 4]} />
          <meshStandardMaterial color="#FF7F50" flatShading />
        </mesh>
      )}
      {type === "speedy" && (
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.5, 2, 8]} />
          <meshStandardMaterial color="#FFD700" flatShading />
        </mesh>
      )}
      {type === "tank" && (
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      )}
    </group>
  );
}
