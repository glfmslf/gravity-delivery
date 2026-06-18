import assert from "node:assert/strict";
import test from "node:test";

import { calculateDeliveryRating } from "../src/rating.js";

test("zero hits and full combo earns S", () => {
  assert.deepEqual(
    calculateDeliveryRating({
      timeLeft: 12,
      maxCombo: 4,
      hitCount: 0,
      totalDeliveries: 4,
    }),
    { grade: "S", label: "完美送达" },
  );
});

test("one hit with 30 seconds earns A", () => {
  assert.deepEqual(
    calculateDeliveryRating({
      timeLeft: 30,
      maxCombo: 2,
      hitCount: 1,
      totalDeliveries: 4,
    }),
    { grade: "A", label: "准时送达" },
  );
});

test("15 seconds earns B", () => {
  assert.deepEqual(
    calculateDeliveryRating({
      timeLeft: 15,
      maxCombo: 1,
      hitCount: 2,
      totalDeliveries: 4,
    }),
    { grade: "B", label: "顺利送达" },
  );
});

test("slower successful delivery earns C", () => {
  assert.deepEqual(
    calculateDeliveryRating({
      timeLeft: 14.9,
      maxCombo: 1,
      hitCount: 2,
      totalDeliveries: 4,
    }),
    { grade: "C", label: "完成送达" },
  );
});
