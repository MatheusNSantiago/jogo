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

export const PATH_LEVEL_2 = [
  { x: -50, y: 640 },
  { x: 640, y: 640 },
  { x: 640, y: 140 },
  { x: 1390, y: 140 },
  { x: 1390, y: 900 },
  { x: 640, y: 900 },
  { x: 640, y: 1400 },
  { x: 1660, y: 1400 },
  { x: 1660, y: 140 },
  { x: 2430, y: 140 },
  { x: 2430, y: 640 },
  { x: 2180, y: 640 },
  { x: 2180, y: 1150 },
  { x: 2870, y: 1150 },
];

// ╭──────────────────────────────────────────────────────────╮
// │                         Enemies                          │
// ╰──────────────────────────────────────────────────────────╯

const skeletonNoise = {
  dx: { lower: -30.0, upper: 30.0 },
  dy: { lower: -30.0, upper: 30.0 },
};

export const skeleton1: EnemyConfig = {
  texture: "skeleton1",
  hp: 60,
  velocity: 180,
  reward: 20,
  damage: 15,
  attackSpeed: 1,
  pathNoise: skeletonNoise,
};

export const skeleton2: EnemyConfig = {
  texture: "skeleton2",
  hp: 70,
  velocity: 180,
  reward: 25,
  damage: 18,
  attackSpeed: 1,
  pathNoise: skeletonNoise,
};

export const skeleton3: EnemyConfig = {
  texture: "skeleton3",
  hp: 85,
  velocity: 180,
  reward: 30,
  damage: 20,
  attackSpeed: 1,
  pathNoise: skeletonNoise,
};

export const ork1: EnemyConfig = {
  texture: "ork1",
  hp: 240,
  velocity: 130,
  reward: 50,
  damage: 40,
  attackSpeed: 1,
  frameRate: 8,
  scale: 0.57,
};

export const ork2: EnemyConfig = {
  texture: "ork2",
  hp: 270,
  velocity: 130,
  reward: 60,
  damage: 40,
  attackSpeed: 1,
  frameRate: 8,
  scale: 0.57,
};

export const ork3: EnemyConfig = {
  texture: "ork3",
  hp: 300,
  velocity: 130,
  reward: 70,
  damage: 40,
  attackSpeed: 1,
  frameRate: 8,
  scale: 0.57,
};

const golemNoise = {
  dx: { lower: 0, upper: 0 },
  // a sprite do gollem é muito grande, então eu puxei ela pra cima pra não ficar esquisito
  dy: { lower: -40.0, upper: -40.0 },
};

export const golem: EnemyConfig = {
  texture: "golem",
  hp: 1000,
  velocity: 100,
  reward: 100,
  damage: 45,
  attackSpeed: 0.75,
  frameRate: 10,
  scale: 1.3,
  pathNoise: golemNoise,
};

// ╭──────────────────────────────────────────────────────────╮
// │                          Towers                          │
// ╰──────────────────────────────────────────────────────────╯

export const ARCHER_TOWER: TowerConfig = {
  type: "archer",
  range: 500,
  damage: 25,
  cost: 100,
};

export const CASTLE_TOWER: TowerConfig = {
  type: "castle",
  range: 500,
  damage: 25,
  cost: 100,
};

export const KNIGHT_FORT: TowerConfig = {
  type: "knight-post",
  range: 500,
  damage: 25,
  cost: 100,
};
