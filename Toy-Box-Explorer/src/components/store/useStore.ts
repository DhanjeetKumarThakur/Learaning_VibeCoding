import { create } from 'zustand';
import * as THREE from 'three';

interface GameState {
  score: number;
  isGameOver: boolean;
  gameStarted: boolean;
  
  // Player state
  playerPos: [number, number, number];
  playerVelocity: [number, number]; // [x, y]
  
  // Entities
  projectiles: Array<{ id: string; position: THREE.Vector3 }>;
  enemies: Array<{ id: string; position: THREE.Vector3; type: 'basic' | 'speedy' | 'tank' }>;
  particles: Array<{ id: string; position: THREE.Vector3; color: string; velocity: THREE.Vector3; scale: number; life: number }>;
  
  // Input
  input: {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    shooting: boolean;
  };
  
  // Actions
  addScore: (pts: number) => void;
  setGameOver: (status: boolean) => void;
  startGame: () => void;
  restartGame: () => void;
  
  setInput: (key: keyof GameState['input'], value: boolean) => void;
  updatePlayerPos: (x: number, y: number) => void;
  
  addProjectile: (pos: THREE.Vector3) => void;
  removeProjectile: (id: string) => void;
  updateProjectiles: (delta: number) => void;
  
  addEnemy: () => void;
  removeEnemy: (id: string) => void;
  updateEnemies: (delta: number, speedMultiplier: number) => void;
  
  addExplosion: (pos: THREE.Vector3, color: string) => void;
  updateParticles: (delta: number) => void;
  
  checkCollisions: () => void;
}

export const useStore = create<GameState>((set, get) => ({
  score: 0,
  isGameOver: false,
  gameStarted: false,
  
  playerPos: [0, 0, 0],
  playerVelocity: [0, 0],
  
  projectiles: [],
  enemies: [],
  particles: [],
  
  input: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    shooting: false,
  },
  
  addScore: (pts) => set((state) => ({ score: state.score + pts })),
  setGameOver: (status) => set({ isGameOver: status }),
  startGame: () => set({ gameStarted: true, isGameOver: false, score: 0 }),
  restartGame: () => set({ 
    isGameOver: false, 
    score: 0, 
    enemies: [], 
    projectiles: [], 
    particles: [],
    playerPos: [0, 0, 0]
  }),
  
  setInput: (key, value) => set((state) => ({
    input: { ...state.input, [key]: value }
  })),
  
  updatePlayerPos: (x, y) => set({ playerPos: [x, y, 0] }),
  
  addProjectile: (pos) => set((state) => ({
    projectiles: [...state.projectiles, { id: Math.random().toString(), position: pos.clone() }]
  })),
  
  removeProjectile: (id) => set((state) => ({
    projectiles: state.projectiles.filter(p => p.id !== id)
  })),
  
  updateProjectiles: (delta) => set((state) => ({
    projectiles: state.projectiles
      .map(p => ({ ...p, position: p.position.clone().add(new THREE.Vector3(0, 0, -40 * delta)) }))
      .filter(p => p.position.z > -100)
  })),
  
  addEnemy: () => {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 12;
    const type = Math.random() > 0.8 ? 'speedy' : (Math.random() > 0.9 ? 'tank' : 'basic');
    set((state) => ({
      enemies: [...state.enemies, { 
        id: Math.random().toString(), 
        position: new THREE.Vector3(x, y, -80),
        type
      }]
    }));
  },
  
  removeEnemy: (id) => set((state) => ({
    enemies: state.enemies.filter(e => e.id !== id)
  })),
  
  updateEnemies: (delta, speedMultiplier) => set((state) => ({
    enemies: state.enemies
      .map(e => {
        let speed = 20;
        if (e.type === 'speedy') speed = 35;
        if (e.type === 'tank') speed = 12;
        return { ...e, position: e.position.clone().add(new THREE.Vector3(0, 0, speed * speedMultiplier * delta)) };
      })
      .filter(e => e.position.z < 10)
  })),
  
  addExplosion: (pos, color) => {
    const newParticles = Array.from({ length: 12 }).map(() => ({
      id: Math.random().toString(),
      position: pos.clone(),
      color,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      ),
      scale: Math.random() * 0.5 + 0.2,
      life: 1.0
    }));
    set((state) => ({ particles: [...state.particles, ...newParticles] }));
  },
  
  updateParticles: (delta) => set((state) => ({
    particles: state.particles
      .map(p => ({
        ...p,
        position: p.position.clone().add(p.velocity.clone().multiplyScalar(delta)),
        life: p.life - delta * 1.5,
        scale: p.scale * 0.95
      }))
      .filter(p => p.life > 0)
  })),
  
  checkCollisions: () => {
    const { projectiles, enemies, playerPos, removeEnemy, removeProjectile, addScore, addExplosion, setGameOver } = get();
    
    const pPosVec = new THREE.Vector3(...playerPos);
    
    // Enemy vs Projectile
    enemies.forEach(enemy => {
      projectiles.forEach(proj => {
        if (enemy.position.distanceTo(proj.position) < 1.5) {
          removeEnemy(enemy.id);
          removeProjectile(proj.id);
          addScore(enemy.type === 'tank' ? 50 : (enemy.type === 'speedy' ? 30 : 10));
          addExplosion(enemy.position, enemy.type === 'tank' ? '#ff4444' : '#44ff44');
        }
      });
      
      // Enemy vs Player
      if (enemy.position.distanceTo(pPosVec) < 1.8) {
        setGameOver(true);
        addExplosion(pPosVec, '#ffffff');
      }
    });
  }
}));
