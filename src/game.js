import { createPlayer, getPlayerHitbox } from "./player.js";
import { createLevel, getLevelCount, getVisibleDeliveries, getVisibleObstacles, getVisiblePickups } from "./level.js";
import { drawScene } from "./renderer.js";
import { createInput } from "./input.js";
import { rectanglesOverlap } from "./collision.js";
import { applyObstaclePenalty } from "./game-rules.js";
import { applyDeliveryReward, determineDeliveryOutcome } from "./delivery-rules.js";
import { applyPickupReward } from "./pickup-rules.js";
import { createAudio } from "./audio.js";
import { addLeaderboardEntry, calculateScore, loadLeaderboard, saveLeaderboard } from "./leaderboard.js";
import {
  getStatusAfterRestartRequest,
  getStatusAfterStartRequest,
  shouldRestartAfterAction,
} from "./game-status-rules.js";

const INITIAL_TIME = 60;

export function createGame({ canvas, ui, assets = {} }) {
  const context = canvas.getContext("2d");
  const audio = createAudio();
  const input = createInput({
    actionTargets: [canvas, ui.controlButton],
    onFirstInteraction: audio.unlock,
    onStartRequest: handleStartRequest,
  });
  let leaderboard = loadLeaderboard();
  let animationFrameId = 0;
  let previousTime = 0;
  let currentLevelIndex = 0;
  let state = createInitialState(currentLevelIndex);

  function createInitialState(levelIndex) {
    return {
      player: createPlayer(),
      level: createLevel(levelIndex),
      levelIndex,
      timeLeft: INITIAL_TIME,
      status: "ready",
      distance: 0,
      hitCooldown: 0,
      completedDeliveries: new Set(),
      collectedPickups: new Set(),
      currentCombo: 0,
      maxCombo: 0,
      hitCount: 0,
    };
  }

  function start() {
    previousTime = performance.now();
    renderLeaderboard();
    renderAudioUi();
    animationFrameId = requestAnimationFrame(tick);
  }

  function restart() {
    restartToReady();
  }

  function restartToReady() {
    audio.stopMusic();
    state = createInitialState(currentLevelIndex);
    previousTime = performance.now();
    ui.statusText.textContent = `第 ${state.levelIndex + 1}/${getLevelCount()} 关：${state.level.name}。按空格或 Enter 开始。`;
    renderUi();
    drawScene(context, canvas, state, assets);
  }

  function restartToPlaying() {
    state = createInitialState(currentLevelIndex);
    state.status = "playing";
    previousTime = performance.now();
    input.consumeGravityToggle();
    ui.statusText.textContent = "按空格翻转重力，贴近门牌完成投递。";
    audio.startMusic();
  }

  function handleStartRequest() {
    if (shouldRestartAfterAction(state.status, true)) {
      restartToPlaying();
    }
  }

  function tick(now) {
    const deltaSeconds = Math.min((now - previousTime) / 1000, 0.05);
    previousTime = now;

    update(deltaSeconds);
    drawScene(context, canvas, state, assets);
    renderUi();

    animationFrameId = requestAnimationFrame(tick);
  }

  function update(deltaSeconds) {
    if (state.status === "ready") {
      const nextStatus = getStatusAfterStartRequest(state.status, input.consumeStartRequest());
      if (nextStatus === "playing") {
        state.status = nextStatus;
        input.consumeGravityToggle();
        ui.statusText.textContent = "按空格翻转重力，贴近门牌完成投递。";
        audio.startMusic();
      }
      return;
    }

    if (state.status !== "playing") {
      const nextStatus = getStatusAfterRestartRequest(state.status, input.consumeStartRequest());
      if (nextStatus === "playing") {
        restartToPlaying();
      }
      return;
    }

    input.consumeStartRequest();
    state.timeLeft -= deltaSeconds;
    state.distance += state.level.speed * deltaSeconds;
    state.hitCooldown = Math.max(state.hitCooldown - deltaSeconds, 0);
    const playerEvents = state.player.update(input, deltaSeconds, canvas);
    if (playerEvents.flipped) {
      audio.flip();
    }
    updateObstacleCollisions();
    updateDeliveries();
    updatePickups();

    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.status = "failed";
      ui.statusText.textContent = "时间耗尽，配送失败。";
      audio.stopMusic();
      audio.failed();
      return;
    }

    if (state.distance >= state.level.length) {
      state.status = determineDeliveryOutcome({
        reachedFinish: true,
        completedCount: state.completedDeliveries.size,
        totalCount: state.level.deliveries.length,
      });

      if (state.status === "success") {
        ui.statusText.textContent = "配送成功。";
        recordSuccess();
        audio.stopMusic();
        audio.success();
        currentLevelIndex = (currentLevelIndex + 1) % getLevelCount();
      } else {
        ui.statusText.textContent = "漏送订单，配送失败。";
        audio.stopMusic();
        audio.failed();
      }
    }
  }

  function updatePickups() {
    const visiblePickups = getVisiblePickups(state.level.pickups, state.distance);
    const playerHitbox = getPlayerHitbox(state.player);
    const pickup = visiblePickups.find((item) => rectanglesOverlap(playerHitbox, item));
    const result = applyPickupReward({
      timeLeft: state.timeLeft,
      collectedPickups: state.collectedPickups,
      pickup,
    });

    state.timeLeft = result.timeLeft;
    state.collectedPickups = result.collectedPickups;

    if (result.wasCollected) {
      ui.statusText.textContent = `拾取时间包，增加 ${pickup.reward} 秒。`;
      audio.pickup();
    }
  }

  function updateDeliveries() {
    const visibleDeliveries = getVisibleDeliveries(state.level.deliveries, state.distance);
    const playerHitbox = getPlayerHitbox(state.player);
    const delivery = visibleDeliveries.find((item) => rectanglesOverlap(playerHitbox, item));
    const result = applyDeliveryReward({
      timeLeft: state.timeLeft,
      completedDeliveries: state.completedDeliveries,
      delivery,
    });

    state.timeLeft = result.timeLeft;
    state.completedDeliveries = result.completedDeliveries;

    if (result.wasDelivered) {
      state.currentCombo += 1;
      state.maxCombo = Math.max(state.maxCombo, state.currentCombo);
      ui.statusText.textContent = `完成 ${delivery.id} 投递，连击 x${state.currentCombo}，奖励 ${delivery.reward} 秒。`;
      audio.delivery();
    }
  }

  function updateObstacleCollisions() {
    const visibleObstacles = getVisibleObstacles(state.level.obstacles, state.distance);
    const playerHitbox = getPlayerHitbox(state.player);
    const hasHit = visibleObstacles.some((obstacle) => rectanglesOverlap(playerHitbox, obstacle));
    const result = applyObstaclePenalty({
      timeLeft: state.timeLeft,
      hitCooldown: state.hitCooldown,
      hasHit,
    });

    state.timeLeft = result.timeLeft;
    state.hitCooldown = result.hitCooldown;

    if (result.wasPenalized) {
      state.hitCount += 1;
      state.currentCombo = 0;
      state.player.velocityY *= -0.35;
      ui.statusText.textContent = "撞到障碍，连击中断，扣除 4 秒。";
      audio.hit();
    }
  }

  function renderUi() {
    const progress = Math.min(state.distance / state.level.length, 1);
    ui.timeValue.textContent = state.timeLeft.toFixed(1);
    ui.progressValue.textContent = `第 ${state.levelIndex + 1}/${getLevelCount()} 关 · ${Math.round(progress * 100)}% · ${state.completedDeliveries.size}/${state.level.deliveries.length}`;
    if (ui.comboValue) {
      ui.comboValue.textContent = String(state.currentCombo);
    }
  }

  function recordSuccess() {
    const entry = {
      score: calculateScore({
        levelIndex: state.levelIndex,
        completedDeliveries: state.completedDeliveries.size,
        timeLeft: state.timeLeft,
        maxCombo: state.maxCombo,
        hitCount: state.hitCount,
      }),
      levelName: state.level.name,
      timeLeft: Number(state.timeLeft.toFixed(1)),
      completedDeliveries: state.completedDeliveries.size,
      maxCombo: state.maxCombo,
      hitCount: state.hitCount,
      createdAt: new Date().toISOString(),
    };

    leaderboard = addLeaderboardEntry(leaderboard, entry);
    saveLeaderboard(leaderboard);
    renderLeaderboard();
  }

  function renderLeaderboard() {
    if (!ui.leaderboardList) {
      return;
    }

    if (leaderboard.length === 0) {
      ui.leaderboardList.innerHTML = "<li>暂无通关记录</li>";
      return;
    }

    ui.leaderboardList.replaceChildren(
      ...leaderboard.map((entry) => {
        const item = document.createElement("li");
        const maxCombo = entry.maxCombo ?? 0;
        const hitCount = entry.hitCount ?? 0;
        item.textContent = `${entry.score} 分 · ${entry.levelName} · 连击 x${maxCombo} · 撞击 ${hitCount} 次`;
        return item;
      }),
    );
  }

  function renderAudioUi() {
    if (!ui.audioButton) {
      return;
    }

    const isMuted = audio.isMuted();
    ui.audioButton.textContent = isMuted ? "声音关" : "声音开";
    ui.audioButton.setAttribute("aria-pressed", String(isMuted));
  }

  return {
    start,
    restart,
    toggleAudio() {
      audio.toggleMuted();
      if (!audio.isMuted() && state.status === "playing") {
        audio.startMusic();
      }
      renderAudioUi();
    },
    stop() {
      audio.stopMusic();
      cancelAnimationFrame(animationFrameId);
      input.destroy();
    },
  };
}
