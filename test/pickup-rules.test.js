import assert from "node:assert/strict";
import test from "node:test";

import { applyPickupReward } from "../src/pickup-rules.js";

test("pickup reward adds time and records collected id once", () => {
  const result = applyPickupReward({
    timeLeft: 18,
    collectedPickups: new Set(),
    pickup: { id: "T-01", reward: 5 },
  });

  assert.equal(result.timeLeft, 23);
  assert.equal(result.wasCollected, true);
  assert.deepEqual([...result.collectedPickups], ["T-01"]);
});

test("collected pickup does not reward time again", () => {
  const result = applyPickupReward({
    timeLeft: 18,
    collectedPickups: new Set(["T-01"]),
    pickup: { id: "T-01", reward: 5 },
  });

  assert.equal(result.timeLeft, 18);
  assert.equal(result.wasCollected, false);
  assert.deepEqual([...result.collectedPickups], ["T-01"]);
});
