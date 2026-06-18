export const HIT_PAUSE_SECONDS = 0.06;
export const HIT_EFFECT_SECONDS = 0.32;

const FLASH_SECONDS = 0.18;
const SHAKE_PIXELS = 12;
const SPARK_GRAVITY = 520;
const SPARK_VELOCITIES = [
  [-270, -190],
  [-235, -125],
  [-300, -55],
  [-250, 20],
  [-215, 85],
  [-175, 145],
  [-145, -220],
  [-110, -95],
  [55, -155],
  [-75, 190],
];

export function createHitEffect({ x, y }) {
  return {
    x,
    y,
    pauseRemaining: HIT_PAUSE_SECONDS,
    durationRemaining: HIT_EFFECT_SECONDS,
    sparks: SPARK_VELOCITIES.map(([velocityX, velocityY], index) => ({
      velocityX,
      velocityY,
      size: 3 + (index % 3) * 1.5,
      color: index % 3 === 0 ? "#fff9ed" : index % 2 === 0 ? "#f8d16b" : "#e45d35",
    })),
  };
}

export function advanceHitEffect(effect, deltaSeconds) {
  if (!effect) {
    return { effect: null, simulationDelta: deltaSeconds };
  }

  const pausedSeconds = Math.min(effect.pauseRemaining, deltaSeconds);
  const nextEffect = {
    ...effect,
    pauseRemaining: Math.max(effect.pauseRemaining - deltaSeconds, 0),
    durationRemaining: Math.max(effect.durationRemaining - deltaSeconds, 0),
  };

  return {
    effect: nextEffect.durationRemaining > 0 ? nextEffect : null,
    simulationDelta: deltaSeconds - pausedSeconds,
  };
}

export function getHitEffectVisuals(effect) {
  if (!effect) {
    return {
      shakeX: 0,
      shakeY: 0,
      shakeMagnitude: 0,
      flashAlpha: 0,
      sparks: [],
    };
  }

  const elapsed = HIT_EFFECT_SECONDS - effect.durationRemaining;
  const lifeRatio = effect.durationRemaining / HIT_EFFECT_SECONDS;
  const shakeMagnitude = SHAKE_PIXELS * lifeRatio * lifeRatio;
  const flashAlpha = Math.max(1 - elapsed / FLASH_SECONDS, 0) * 0.48;

  return {
    shakeX: Math.sin(elapsed * 126) * shakeMagnitude,
    shakeY: Math.cos(elapsed * 97) * shakeMagnitude * 0.65,
    shakeMagnitude,
    flashAlpha,
    sparks: effect.sparks.map((spark) => ({
      x: effect.x + spark.velocityX * elapsed,
      y: effect.y + spark.velocityY * elapsed + SPARK_GRAVITY * elapsed * elapsed * 0.5,
      size: spark.size * lifeRatio,
      alpha: lifeRatio,
      color: spark.color,
    })),
  };
}
