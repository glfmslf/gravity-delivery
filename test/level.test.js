import assert from "node:assert/strict";
import test from "node:test";

import { createLevel, getVisibleDeliveries, getVisibleObstacles, getVisiblePickups } from "../src/level.js";

test("level defines obstacles with world positions and sizes", () => {
  const level = createLevel();

  assert.ok(level.obstacles.length >= 4);
  assert.deepEqual(Object.keys(level.obstacles[0]).sort(), ["height", "width", "x", "y"].sort());
});

test("visible obstacles are projected from world distance to screen coordinates", () => {
  const obstacle = { x: 360, y: 80, width: 54, height: 150 };

  assert.deepEqual(getVisibleObstacles([obstacle], 120), [
    { x: 240, y: 80, width: 54, height: 150 },
  ]);
});

test("level defines delivery doors as route targets", () => {
  const level = createLevel();

  assert.ok(level.deliveries.length >= 3);
  assert.deepEqual(Object.keys(level.deliveries[0]).sort(), ["height", "id", "reward", "width", "x", "y"].sort());
});

test("visible deliveries are projected from world distance to screen coordinates", () => {
  const delivery = { id: "A-12", x: 520, y: 86, width: 60, height: 78, reward: 3 };

  assert.deepEqual(getVisibleDeliveries([delivery], 170), [
    { id: "A-12", x: 350, y: 86, width: 60, height: 78, reward: 3 },
  ]);
});

test("level defines time pickups with rewards", () => {
  const level = createLevel();

  assert.ok(level.pickups.length >= 3);
  assert.deepEqual(Object.keys(level.pickups[0]).sort(), ["height", "id", "reward", "width", "x", "y"].sort());
});

test("visible pickups are projected from world distance to screen coordinates", () => {
  const pickup = { id: "T1", x: 640, y: 180, width: 34, height: 34, reward: 5 };

  assert.deepEqual(getVisiblePickups([pickup], 220), [
    { id: "T1", x: 420, y: 180, width: 34, height: 34, reward: 5 },
  ]);
});
