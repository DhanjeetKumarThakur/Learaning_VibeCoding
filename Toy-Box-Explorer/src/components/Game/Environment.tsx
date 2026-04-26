import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useStore } from "../store/useStore";
import * as THREE from "three";

export function Environment() {
  const { score } = useStore();
  const speedMultiplier = 1 + score / 5000;

  return (
    <>
      <Clouds speed={speedMultiplier} />
      <Mountains speed={speedMultiplier} />
      <Stars />
    </>
  );
}

function Clouds({ speed }: { speed: number }) {
  const group = useRef<THREE.Group>(null);
  const cloudData = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 80,
        Math.random() * 10 + 15,
        -Math.random() * 200 - 50,
      ),
      scale: Math.random() * 5 + 2,
    }));
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.children.forEach((child) => {
        child.position.z += 20 * speed * delta;
        if (child.position.z > 50) {
          child.position.z = -250;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {cloudData.map((data, i) => (
        <group key={i} position={data.position} scale={data.scale}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[1, 7, 7]} />
            <meshStandardMaterial color="white" flatShading />
          </mesh>
          <mesh position={[0.8, 0, 0]} scale={0.7}>
            <sphereGeometry args={[1, 7, 7]} />
            <meshStandardMaterial color="white" flatShading />
          </mesh>
          <mesh position={[-0.8, 0, 0]} scale={0.7}>
            <sphereGeometry args={[1, 7, 7]} />
            <meshStandardMaterial color="white" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Mountains({ speed }: { speed: number }) {
  const group = useRef<THREE.Group>(null);
  const mountainData = useMemo(() => {
    return Array.from({ length: 10 }).map(() => ({
      position: new THREE.Vector3(
        (Math.random() > 0.5 ? 40 : -40) + (Math.random() - 0.5) * 10,
        -15,
        -Math.random() * 300,
      ),
      scale: [
        Math.random() * 20 + 20,
        Math.random() * 40 + 30,
        Math.random() * 20 + 10,
      ] as [number, number, number],
      color: "#98FF98",
    }));
  }, []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.children.forEach((child) => {
        child.position.z += 15 * speed * delta;
        if (child.position.z > 100) {
          child.position.z = -300;
        }
      });
    }
  });

  return (
    <group ref={group}>
      {mountainData.map((data, i) => (
        <mesh key={i} position={data.position} scale={data.scale}>
          <coneGeometry args={[1, 1, 4]} />
          <meshStandardMaterial color={data.color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Stars() {
  const points = useMemo(() => {
    const p = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      p[i] = (Math.random() - 0.5) * 400;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.4}
      />
    </points>
  );
}
