import assert from "node:assert/strict";
import test from "node:test";

import { applyObstaclePenalty } from "../src/game-rules.js";

test("obstacle hit deducts time once and starts cooldown", () => {
  const result = applyObstaclePenalty({
    timeLeft: 20,
    hitCooldown: 0,
    hasHit: true,
  });

  assert.equal(result.timeLeft, 16);
  assert.equal(result.hitCooldown, 1.2);
  assert.equal(result.wasPenalized, true);
});

test("obstacle hit during cooldown does not deduct time again", () => {
  const result = applyObstaclePenalty({
    timeLeft: 20,
    hitCooldown: 0.6,
    hasHit: true,
  });

  assert.equal(result.timeLeft, 20);
  assert.equal(result.hitCooldown, 0.6);
  assert.equal(result.wasPenalized, false);
});
