import { EnemyConfig } from './sprites/enemy';

export const TILE_SIZE = 256;
export const CANVAS_HEIGHT = TILE_SIZE * 6;
export const CANVAS_WIDTH = TILE_SIZE * 11;

export const PATH_LEVEL_1 = [
  { x: -50, y: 640 },
  { x: 650, y: 640 },
  { x: 650, y: 1380 },
  { x: 1400, y: 1380 },
  { x: 1400, y: 150 },
  { x: 2400, y: 150 },
  { x: 2400, y: 1125 },
  { x: 2870, y: 1125 },
];

export const enemy1: EnemyConfig = {
  texture: 'enemy1',
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
};

export const enemy2: EnemyConfig = {
  texture: 'enemy2',
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
};

export const enemy3: EnemyConfig = {
  texture: 'enemy3',
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
};
