import assert from "node:assert/strict";
import test from "node:test";

import { createPlayer, getPlayerHitbox } from "../src/player.js";

test("player hitbox is inset from decorative drawing bounds", () => {
  const hitbox = getPlayerHitbox({
    x: 100,
    y: 200,
    width: 54,
    height: 34,
  });

  assert.deepEqual(hitbox, {
    x: 108,
    y: 206,
    width: 38,
    height: 22,
  });
});

test("player keeps a fixed horizontal lane while level scrolls forward", () => {
  const player = createPlayer();
  const startX = player.x;
  const input = createInputStub({ pressed: ["ArrowLeft"] });

  player.update(input, 0.25, { width: 960, height: 540 });

  assert.equal(player.x, startX);
});

test("player vertical speed is capped after gravity acceleration", () => {
  const player = createPlayer();
  const input = createInputStub();

  player.update(input, 3, { width: 960, height: 540 });

  assert.ok(Math.abs(player.velocityY) <= 420);
});

test("player update reports gravity flip events", () => {
  const player = createPlayer();
  const input = createInputStub({ toggle: true });

  const events = player.update(input, 0.1, { width: 960, height: 540 });

  assert.deepEqual(events, { flipped: true });
});

function createInputStub({ pressed = [], toggle = false } = {}) {
  return {
    isPressed(code) {
      return pressed.includes(code);
    },
    consumeGravityToggle() {
      return toggle;
    },
  };
}
