import test from "node:test";
import assert from "node:assert/strict";

import { IMAGE_ASSETS, loadImageAssets } from "../src/assets.js";

test("image asset manifest contains core gameplay sprites", () => {
  assert.deepEqual(Object.keys(IMAGE_ASSETS).sort(), ["delivery", "obstacle", "pickup", "player"]);
});

test("image asset loader returns successfully loaded images", async () => {
  const assets = await loadImageAssets({
    imageFactory: () => ({
      set src(value) {
        this.loadedSrc = value;
        this.onload();
      },
    }),
  });

  assert.equal(assets.player.loadedSrc, IMAGE_ASSETS.player);
  assert.equal(assets.obstacle.loadedSrc, IMAGE_ASSETS.obstacle);
});
