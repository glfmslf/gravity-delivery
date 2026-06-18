import assert from "node:assert/strict";
import test from "node:test";

import {
  HIT_EFFECT_SECONDS,
  HIT_PAUSE_SECONDS,
  advanceHitEffect,
  createHitEffect,
  getHitEffectVisuals,
} from "../src/hit-effects.js";

test("hit effect starts with pause, duration, and backward sparks", () => {
  const effect = createHitEffect({ x: 220, y: 180 });

  assert.equal(effect.pauseRemaining, HIT_PAUSE_SECONDS);
  assert.equal(effect.durationRemaining, HIT_EFFECT_SECONDS);
  assert.equal(effect.sparks.length, 10);
  assert.ok(effect.sparks.filter((spark) => spark.velocityX < 0).length >= 8);
});

test("hit pause consumes frame time before simulation resumes", () => {
  const effect = createHitEffect({ x: 220, y: 180 });
  const firstStep = advanceHitEffect(effect, 0.05);
  const secondStep = advanceHitEffect(firstStep.effect, 0.05);

  assert.equal(firstStep.simulationDelta, 0);
  assert.ok(Math.abs(firstStep.effect.pauseRemaining - 0.01) < 1e-9);
  assert.ok(Math.abs(secondStep.simulationDelta - 0.04) < 1e-9);
  assert.equal(secondStep.effect.pauseRemaining, 0);
});

test("shake and flash decay as the effect ages", () => {
  const effect = createHitEffect({ x: 220, y: 180 });
  const early = getHitEffectVisuals(effect);
  const laterEffect = advanceHitEffect(effect, 0.2).effect;
  const later = getHitEffectVisuals(laterEffect);

  assert.ok(early.shakeMagnitude > later.shakeMagnitude);
  assert.ok(early.flashAlpha > later.flashAlpha);
});

test("finished effect returns full simulation delta", () => {
  const effect = createHitEffect({ x: 220, y: 180 });
  const finished = advanceHitEffect(effect, HIT_EFFECT_SECONDS + 0.1);
  const inactive = advanceHitEffect(null, 0.05);

  assert.equal(finished.effect, null);
  assert.ok(Math.abs(finished.simulationDelta - (HIT_EFFECT_SECONDS + 0.1 - HIT_PAUSE_SECONDS)) < 1e-9);
  assert.deepEqual(inactive, { effect: null, simulationDelta: 0.05 });
});
