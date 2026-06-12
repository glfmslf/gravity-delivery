import assert from "node:assert/strict";
import test from "node:test";

import { applyDeliveryReward, determineDeliveryOutcome } from "../src/delivery-rules.js";

test("delivery reward adds time and records completed id once", () => {
  const result = applyDeliveryReward({
    timeLeft: 20,
    completedDeliveries: new Set(),
    delivery: { id: "3F-07", reward: 3 },
  });

  assert.equal(result.timeLeft, 23);
  assert.equal(result.wasDelivered, true);
  assert.deepEqual([...result.completedDeliveries], ["3F-07"]);
});

test("completed delivery does not reward time again", () => {
  const result = applyDeliveryReward({
    timeLeft: 20,
    completedDeliveries: new Set(["3F-07"]),
    delivery: { id: "3F-07", reward: 3 },
  });

  assert.equal(result.timeLeft, 20);
  assert.equal(result.wasDelivered, false);
  assert.deepEqual([...result.completedDeliveries], ["3F-07"]);
});

test("run succeeds only when all deliveries are completed at the finish", () => {
  assert.equal(
    determineDeliveryOutcome({
      reachedFinish: true,
      completedCount: 4,
      totalCount: 4,
    }),
    "success",
  );
});

test("run fails at the finish when deliveries are missed", () => {
  assert.equal(
    determineDeliveryOutcome({
      reachedFinish: true,
      completedCount: 2,
      totalCount: 4,
    }),
    "failed",
  );
});

test("run stays playing before the finish", () => {
  assert.equal(
    determineDeliveryOutcome({
      reachedFinish: false,
      completedCount: 4,
      totalCount: 4,
    }),
    "playing",
  );
});
