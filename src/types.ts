export interface Trex {
  width: number;
  height: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  defaultY: number;
  size: number;
  speed: number;
  minY: number;
  type: "straight" | "bend";
  position: 0 | 1 | 2 | 3;
  move?: "up" | "down";
}

export interface Horizon {
  width: number;
  height: number;
  x: number;
  y: number;
  sx: number;
  sy: number;
  speed: number;
}

export interface Obstacle {
  count: number;
  speed: number;
  height: {
    small: number;
    large: number;
  };
  y: {
    small: number;
    large: number;
  };
  interval: number[];
  cactuses: ({
    width: number;
    height: number;
    x: number;
    y: number;
    sx: number;
    size: ObstacleSize;
  } | null)[];
  small: { sx: number; width: number }[];
  large: { sx: number; width: number }[];
}

export type ObstacleSize = "small" | "large";
