import assert from "node:assert/strict";
import test from "node:test";

import { rectanglesOverlap } from "../src/collision.js";

test("rectangles overlap when their filled areas intersect", () => {
  assert.equal(
    rectanglesOverlap(
      { x: 10, y: 10, width: 20, height: 20 },
      { x: 24, y: 18, width: 18, height: 18 },
    ),
    true,
  );
});

test("rectangles do not overlap when only edges touch", () => {
  assert.equal(
    rectanglesOverlap(
      { x: 10, y: 10, width: 20, height: 20 },
      { x: 30, y: 10, width: 18, height: 18 },
    ),
    false,
  );
});
