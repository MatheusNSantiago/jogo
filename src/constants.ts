import { EnemyConfig } from "./sprites/Enemy";
import { TowerConfig } from "./sprites/Tower";

export const TILE_SIZE = 256;
export const CANVAS_HEIGHT = TILE_SIZE * 6;
export const CANVAS_WIDTH = TILE_SIZE * 11;
export const ASSETS_PATH = "/assets";

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

// ╭──────────────────────────────────────────────────────────╮
// │                         Enemies                          │
// ╰──────────────────────────────────────────────────────────╯

export const enemy1: EnemyConfig = {
  texture: "enemy1",
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
  attackSpeed: 1,
};

export const enemy2: EnemyConfig = {
  texture: "enemy2",
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
  attackSpeed: 1,
};

export const enemy3: EnemyConfig = {
  texture: "enemy3",
  hp: 100,
  velocity: 180,
  reward: 20,
  damage: 20,
  attackSpeed: 1,
};

// ╭──────────────────────────────────────────────────────────╮
// │                          Towers                          │
// ╰──────────────────────────────────────────────────────────╯

export const ARCHER_TOWER: TowerConfig = {
  type: "archer",
  range: 500,
  damage: 20,
  cost: 100,
};

export const CASTLE_TOWER: TowerConfig = {
  type: "castle",
  range: 500,
  damage: 20,
  cost: 100,
};

export const KNIGHT_FORT: TowerConfig = {
  type: "knight-post",
  range: 500,
  damage: 20,
  cost: 100,
};
