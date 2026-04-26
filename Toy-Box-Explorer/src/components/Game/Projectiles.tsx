import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";

export function Projectiles() {
  const { projectiles, updateProjectiles, isGameOver } = useStore();

  useFrame((state, delta) => {
    if (isGameOver) return;
    updateProjectiles(delta);
  });

  return (
    <>
      {projectiles.map((p) => (
        <Projectile key={p.id} position={p.position} />
      ))}
    </>
  );
}

function Projectile({ position }: { position: THREE.Vector3 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color="#FFD700"
        emissive="#FFD700"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

export function Effects() {
  const { particles, updateParticles } = useStore();

  useFrame((state, delta) => {
    updateParticles(delta);
  });

  return (
    <>
      {particles.map((p) => (
        <mesh key={p.id} position={p.position} scale={p.scale}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color={p.color} transparent opacity={p.life} />
        </mesh>
      ))}
    </>
  );
}
