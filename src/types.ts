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
  y: number;
  interval: number[];
  list: ({ x: number; width: number; sx: number; interval: number } | null)[];
  small: { sx: number; width: number }[];
  large: { sx: number; width: number }[];
}
