import { createPlayer } from "./player.js";
import { createLevel, getVisibleObstacles } from "./level.js";
import { drawScene } from "./renderer.js";
import { createInput } from "./input.js";
import { rectanglesOverlap } from "./collision.js";
import { applyObstaclePenalty } from "./game-rules.js";

const INITIAL_TIME = 60;

export function createGame({ canvas, ui }) {
  const context = canvas.getContext("2d");
  const input = createInput();
  let animationFrameId = 0;
  let previousTime = 0;
  let state = createInitialState();

  function createInitialState() {
    return {
      player: createPlayer(),
      level: createLevel(),
      timeLeft: INITIAL_TIME,
      status: "playing",
      distance: 0,
      hitCooldown: 0,
    };
  }

  function start() {
    previousTime = performance.now();
    animationFrameId = requestAnimationFrame(tick);
  }

  function restart() {
    state = createInitialState();
    previousTime = performance.now();
    ui.statusText.textContent = "方向键左右移动，空格切换重力。";
    renderUi();
    drawScene(context, canvas, state);
  }

  function tick(now) {
    const deltaSeconds = Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;

    update(deltaSeconds);
    drawScene(context, canvas, state);
    renderUi();

    animationFrameId = requestAnimationFrame(tick);
  }

  function update(deltaSeconds) {
    if (state.status !== "playing") {
      return;
    }

    state.timeLeft -= deltaSeconds;
    state.distance += state.level.speed * deltaSeconds;
    state.hitCooldown = Math.max(state.hitCooldown - deltaSeconds, 0);
    state.player.update(input, deltaSeconds, canvas);
    updateObstacleCollisions();

    if (state.distance >= state.level.length) {
      state.status = "success";
      ui.statusText.textContent = "配送成功。";
    }

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.status = "failed";
      ui.statusText.textContent = "时间耗尽，配送失败。";
    }
  }

  function updateObstacleCollisions() {
    const visibleObstacles = getVisibleObstacles(state.level.obstacles, state.distance);
    const hasHit = visibleObstacles.some((obstacle) => rectanglesOverlap(state.player, obstacle));
    const result = applyObstaclePenalty({
      timeLeft: state.timeLeft,
      hitCooldown: state.hitCooldown,
      hasHit,
    });

    state.timeLeft = result.timeLeft;
    state.hitCooldown = result.hitCooldown;

    if (result.wasPenalized) {
      state.player.velocityY *= -0.35;
      ui.statusText.textContent = "撞到障碍，扣除 4 秒。";
    }
  }

  function renderUi() {
    const progress = Math.min(state.distance / state.level.length, 1);
    ui.timeValue.textContent = state.timeLeft.toFixed(1);
    ui.progressValue.textContent = `${Math.round(progress * 100)}%`;
  }

  return {
    start,
    restart,
    stop() {
      cancelAnimationFrame(animationFrameId);
      input.destroy();
    },
  };
}
