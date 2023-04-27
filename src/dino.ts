import type { Horizon, Trex, Obstacle } from "./types";

const Dino = (() => {
  let fps = 60;
  let canvasWidth = 670;
  let canvasHeight = 150;
  let spriteWidth: number;
  let spriteHeight: number;
  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let intervalId: NodeJS.Timer;
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
      type: "straight",
      position: 0,
      move: undefined,
      defaultY: canvasHeight - size,
      speed: 7,
      minY: 50,
    };
  })();
  let horizon: Horizon = {
    width: canvasWidth,
    height: canvasHeight,
    x: 0,
    y: canvasHeight - 20,
    sx: 0,
    sy: 100,
    speed: 5,
  };
  let obstacle: Obstacle = {
    list: [],
    speed: 5,
    count: 4,
    y: 80,
    interval: [175, 450, 650],
    small: [
      {
        sx: 440,
        width: 42,
      },
      {
        sx: 480,
        width: 36,
      },
      {
        sx: 514,
        width: 36,
      },
      {
        sx: 546,
        width: 38,
      },
      {
        sx: 580,
        width: 38,
      },
      {
        sx: 616,
        width: 38,
      },
    ],
    large: [],
  };

  let getStaticPath = (path: string): string => {
    return `${import.meta.env.BASE_URL}${path}`;
  };

  let clearCanvas = () => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  let update = () => {
    clearCanvas();
    horizon.sx = horizon.sx >= spriteWidth ? 0 : horizon.sx + horizon.speed;
    drawHorizon();
    drawTrex();
    drawObstacle();
  };

  let start = () => {
    intervalId = setInterval(update, 1000 / fps);
  };

  let stop = () => {
    if (intervalId) clearInterval(intervalId);
  };

  let drawHorizon = () => {
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

    // To loop the horizon
    if (spriteWidth - horizon.sx <= canvasWidth) {
      let x = spriteWidth - horizon.sx;
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
    }
  };

  let drawObstacle = () => {
    for (let i = 0; i < obstacle.count; i++) {
      let obstacles = obstacle.small;

      let randomObstacle =
        obstacles[Math.floor(Math.random() * obstacles.length)];

      let item = obstacle.list[i];

      if (item) {
        if (item.x === -item.width) {
          item = null;
        } else {
          item.x = Math.max(item.x - obstacle.speed, -item.width);
        }
      } else {
        let prevItem =
          obstacle.list[i === 0 ? obstacle.list.length - 1 : i - 1];

        let randomNum = (): number => {
          let num =
            obstacle.interval[
              Math.floor(Math.random() * obstacle.interval.length)
            ];

          if (prevItem && prevItem.interval === num) return randomNum();

          return num;
        };

        let interval = i !== 0 ? randomNum() : 0;

        item = {
          interval,
          x: canvasWidth + randomObstacle.width + interval,
          ...randomObstacle,
        };
      }

      obstacle.list[i] = item;

      if (!item) continue;

      ctx.drawImage(
        sprite,
        item.sx,
        0,
        item.width,
        100,
        item.x,
        obstacle.y,
        item.width,
        100
      );
    }
  };

  let drawTrex = () => {
    let offset = trex.type === "straight" ? 1335 : 1862;
    trex.width = trex.type === "straight" ? 88 : 126;
    trex.sx = offset + trex.width * trex.position;

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
          ? Math.max(trex.y - trex.speed, 0)
          : Math.min(trex.y + trex.speed, trex.defaultY);

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
      drawHorizon();
      drawTrex();
      drawObstacle();
    };

    container.append(canvas);
    window.addEventListener("keydown", handleKeyDown);
    document.body.append(sprite);
    rootNode.append(container);
  };

  return {
    render,
  };
})();

export default Dino;
