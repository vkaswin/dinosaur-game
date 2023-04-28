import type {
  Horizon,
  Trex,
  Obstacle,
  ObstacleSize,
  Sky,
  SkyPosition,
  TrexPosition,
} from "./types";

const Dino = (() => {
  let fps = 60;
  let gameSpeed = 6;
  let canvasWidth = 670;
  let canvasHeight = 170;
  let spriteWidth: number;
  let spriteHeight: number;
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let intervalId: NodeJS.Timer | null;
  let sprite = new Image();
  let isStarted: boolean;
  let jump: boolean;
  let isKeyUp: boolean;

  let trex = ((): Trex => {
    let size = 50;
    return {
      size,
      width: 0,
      height: 0,
      x: 20,
      y: canvasHeight - size,
      sx: 0,
      sy: 0,
      position: 0,
      type: "straight",
      move: undefined,
      defaultY: canvasHeight - size,
      minY: 50,
    };
  })();

  let sky: Sky = {
    count: 3,
    speed: 6,
    sx: 160,
    width: 100,
    height: 35,
    y: {
      top: 20,
      bottom: 40,
    },
    interval: 300,
    skies: [],
  };

  let horizon: Horizon = {
    width: canvasWidth,
    height: canvasHeight,
    x: 0,
    y: canvasHeight - 20,
    sx: 0,
    sy: 100,
  };

  let obstacle: Obstacle = {
    cactuses: [],
    count: 3,
    height: 75,
    y: {
      small: 120,
      large: 100,
    },
    interval: [250, 275, 300, 325, 350],
    small: [
      {
        sx: 440,
        width: 42,
      },
      {
        sx: 480,
        width: 70,
      },
      {
        sx: 580,
        width: 74,
      },
    ],
    large: [
      {
        sx: 648,
        width: 56,
      },
      {
        sx: 648,
        width: 106,
      },
      {
        sx: 754,
        width: 50,
      },
      {
        sx: 852,
        width: 52,
      },
      {
        sx: 852,
        width: 100,
      },
    ],
  };

  let getStaticPath = (path: string): string => {
    return `${import.meta.env.BASE_URL}${path}`;
  };

  let clearCanvas = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  let renderCanvas = () => {
    clearCanvas();
    drawHorizon();
    drawSky();
    drawObstacle();
    drawTrex();
    checkCollision();
  };

  let start = () => {
    intervalId = setInterval(renderCanvas, 1000 / fps);
  };

  let stop = () => {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
  };

  let drawHorizon = () => {
    horizon.sx = horizon.sx >= spriteWidth ? 0 : horizon.sx + gameSpeed;

    ctx.drawImage(
      sprite,
      horizon.sx,
      horizon.sy,
      horizon.width,
      horizon.height,
      horizon.x,
      horizon.y,
      horizon.width,
      80
    );

    let x = spriteWidth - horizon.sx;

    if (x > canvasWidth) return;

    let width = canvasWidth - x;

    ctx.drawImage(
      sprite,
      0,
      horizon.sy,
      width,
      horizon.height,
      x,
      horizon.y,
      width,
      80
    );
  };

  let generateRandomInterval = (): number => {
    let interval =
      obstacle.interval[Math.floor(Math.random() * obstacle.interval.length)];

    return interval;
  };

  let drawObstacle = () => {
    for (let i = 0; i < obstacle.count; i++) {
      let cactus = obstacle.cactuses[i];

      if (cactus) {
        if (cactus.x === -cactus.width) {
          cactus = null;
        } else {
          cactus.x = Math.max(cactus.x - gameSpeed, -cactus.width);
        }
      } else {
        let prevObstacle =
          obstacle.cactuses[i === 0 ? obstacle.cactuses.length - 1 : i - 1];

        let interval = i === 0 && !isStarted ? 0 : generateRandomInterval();

        let size: ObstacleSize =
          Math.floor(Math.random() * 2 + 1) === 1 ? "small" : "large";

        let obstacles = obstacle[size];

        let randomObstacle =
          obstacles[Math.floor(Math.random() * obstacles.length)];

        let y = obstacle.y[size];

        cactus = {
          size,
          y,
          x: (prevObstacle ? prevObstacle.x : canvasWidth) + interval,
          ...randomObstacle,
        };
      }

      obstacle.cactuses[i] = cactus;

      if (!cactus) continue;

      ctx.drawImage(
        sprite,
        cactus.sx,
        0,
        cactus.width,
        100,
        cactus.x,
        cactus.y,
        cactus.width,
        obstacle.height
      );
    }
  };

  const collision = (
    rect1: {
      right: number;
      top: number;
      bottom: number;
      left: number;
    },
    rect2: {
      right: number;
      top: number;
      bottom: number;
      left: number;
    }
  ) => {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  };

  let checkCollision = () => {
    let { top, left } = canvas.getBoundingClientRect();

    let isCollision = obstacle.cactuses.some((cactus) => {
      if (!cactus) return;

      let cactusRect = {
        top: top + cactus.y,
        left: left + cactus.x,
        bottom: top + cactus.y + obstacle.height,
        right: left + cactus.x + cactus.width,
      };

      let trexRect = {
        top: top + trex.y,
        left: left + trex.x,
        bottom: top + trex.y + trex.size,
        right: left + trex.x + trex.size,
      };

      return collision(trexRect, cactusRect);
    });

    if (!isCollision) return;

    drawGameOver();
    drawRestart();
    stop();
  };

  let drawGameOver = () => {
    let width = 392;
    let height = 30;
    let x = (canvasWidth - width + 100) / 2;
    let y = (canvasHeight - height + 10) / 2;

    ctx.drawImage(
      sprite,
      950,
      24,
      width,
      height,
      x,
      y,
      width - 100,
      height - 10
    );
  };

  let drawRestart = () => {
    let width = 70;
    let height = 64;
    let x = (canvasWidth - width) / 2;
    let y = (canvasHeight - height) / 2 + 50;

    ctx.drawImage(sprite, 0, 0, width, height, x, y, 40, 40);
  };

  let drawSky = () => {
    for (let i = 0; i < sky.count; i++) {
      let item = sky.skies[i];

      if (item) {
        if (item.x === -sky.width) {
          item = null;
        } else {
          item.x = Math.max(item.x - gameSpeed, -sky.width);
        }
      } else {
        let prevSky = sky.skies[i === 0 ? sky.skies.length - 1 : i - 1];

        let position: SkyPosition =
          prevSky?.position === "top" ? "bottom" : "top";

        item = {
          x: (prevSky ? prevSky.x : canvasWidth) + sky.interval,
          y: sky.y[position],
          position,
        };
      }

      sky.skies[i] = item;

      if (!item) continue;

      ctx.drawImage(
        sprite,
        sky.sx,
        0,
        sky.width,
        sky.height,
        item.x,
        item.y,
        sky.width,
        sky.height
      );
    }
  };

  let drawTrex = () => {
    let position: TrexPosition =
      !isStarted || trex.y !== trex.defaultY ? 0 : trex.position === 2 ? 3 : 2;
    let offset = trex.type === "straight" ? 1335 : 1862;
    trex.width = trex.type === "straight" ? 88 : 126;
    trex.sx = offset + trex.width * position;
    trex.position = position;

    if (jump) {
      if (
        trex.move !== "down" &&
        (trex.y <= 0 || (isKeyUp && trex.y <= trex.minY))
      ) {
        trex.move = "down";
      } else if (trex.move !== "up" && trex.y === trex.defaultY) {
        trex.move = "up";
      }

      trex.y =
        trex.move === "up"
          ? Math.max(trex.y - gameSpeed, 0)
          : Math.min(trex.y + gameSpeed, trex.defaultY);

      if (trex.y === trex.defaultY) {
        jump = false;
        trex.move = undefined;
      }
    }

    ctx.drawImage(
      sprite,
      trex.sx,
      trex.sy,
      trex.width,
      trex.height,
      trex.x,
      trex.y,
      trex.size,
      trex.size
    );
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    isKeyUp = false;
    if (isStarted) {
      window.addEventListener("keyup", () => (isKeyUp = true), { once: true });
    }
    switch (event.code) {
      case "Space":
      case "ArrowUp":
        jump = true;
        if (isStarted) return;
        isStarted = true;
        start();
        break;
      case "ArrowDown":
        break;

      default:
        return;
    }
  };

  let render = <T extends Element>(rootNode: T) => {
    container = document.createElement("div");
    container.classList.add("container");
    canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    let context = canvas.getContext("2d");
    if (context) ctx = context;

    sprite.src = getStaticPath("sprite.png");
    sprite.onload = () => {
      spriteWidth = sprite.width;
      spriteHeight = sprite.height;
      trex.height = spriteHeight - 30;
      renderCanvas();
    };

    container.append(canvas);
    window.addEventListener("keydown", handleKeyDown);
    // document.body.append(sprite);
    rootNode.append(container);
  };

  return {
    render,
  };
})();

export default Dino;
