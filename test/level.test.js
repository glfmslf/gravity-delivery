import assert from "node:assert/strict";
import test from "node:test";

import { createLevel, getVisibleObstacles } from "../src/level.js";

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
