import { EnemyConfig } from "./sprites/Enemy";

export const TILE_SIZE = 256;
export const CANVAS_HEIGHT = TILE_SIZE * 6;
export const CANVAS_WIDTH = TILE_SIZE * 11;
export const ASSETS_PATH = 'public/assets';

export const PATH_LEVEL_1 = [
  { x: -50, y: 640 },
  { x: 640, y: 640 },
  { x: 640, y: 1400 },
  { x: 1410, y: 1400 },
  { x: 1410, y: 140 },
  { x: 2430, y: 140 },
  { x: 2430, y: 1150 },
  { x: 2870, y: 1150 },
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
