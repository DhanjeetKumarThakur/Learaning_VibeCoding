import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sky, Stars } from '@react-three/drei';
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing';
import { Player } from './Player';
import { Enemies } from './Enemies';
import { Projectiles, Effects } from './Projectiles';
import { Environment } from './Environment';
import { useStore } from '../store/useStore'
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function GameLogic() {
  const { checkCollisions, isGameOver } = useStore();
  
  useFrame(() => {
    if (!isGameOver) {
      checkCollisions();
    }
  });

  return null;
}

export function GameScene() {
  const { isGameOver, setInput, gameStarted } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setInput('forward', true); break;
        case 's': case 'arrowdown': setInput('backward', true); break;
        case 'a': case 'arrowleft': setInput('left', true); break;
        case 'd': case 'arrowright': setInput('right', true); break;
        case ' ': setInput('shooting', true); break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w': case 'arrowup': setInput('forward', false); break;
        case 's': case 'arrowdown': setInput('backward', false); break;
        case 'a': case 'arrowleft': setInput('left', false); break;
        case 'd': case 'arrowright': setInput('right', false); break;
        case ' ': setInput('shooting', false); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInput]);

  return (
    <Canvas shadows dpr={[1, 2]}>
      <color attach="background" args={['#007FFF']} />
      
      <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={60} />
      {/* Dynamic Camera Shake could be added here */}
      
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <fog attach="fog" args={['#007FFF', 30, 200]} />

      {gameStarted && (
        <>
          <Player />
          <Enemies />
          <Projectiles />
          <Effects />
          <GameLogic />
        </>
      )}
      
      <Environment />

      <EffectComposer>
        <SSAO intensity={20} radius={0.1} luminanceInfluence={0.5} color={new THREE.Color('black')} />
        <Bloom luminanceThreshold={1} intensity={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
