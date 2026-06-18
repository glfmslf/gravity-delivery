import assert from "node:assert/strict";
import test from "node:test";

import { addLeaderboardEntry, calculateScore } from "../src/leaderboard.js";

test("score rewards level, completed deliveries, and remaining time", () => {
  assert.equal(
    calculateScore({
      levelIndex: 1,
      completedDeliveries: 4,
      timeLeft: 28.4,
    }),
    3084,
  );
});

test("score rewards max combo and penalizes hits", () => {
  assert.equal(
    calculateScore({
      levelIndex: 0,
      completedDeliveries: 4,
      timeLeft: 30,
      maxCombo: 4,
      hitCount: 2,
    }),
    2540,
  );
});

test("leaderboard keeps entries sorted by score descending", () => {
  const entries = addLeaderboardEntry(
    [
      { score: 1200, levelName: "楼道急件", timeLeft: 12.2, completedDeliveries: 4, createdAt: "old" },
      { score: 2400, levelName: "管线夜班", timeLeft: 24.1, completedDeliveries: 4, createdAt: "best" },
    ],
    { score: 1800, levelName: "楼道急件", timeLeft: 18.1, completedDeliveries: 4, createdAt: "new" },
  );

  assert.deepEqual(entries.map((entry) => entry.score), [2400, 1800, 1200]);
});

test("leaderboard keeps only the top five entries", () => {
  const entries = [100, 200, 300, 400, 500].map((score) => ({
    score,
    levelName: "楼道急件",
    timeLeft: 10,
    completedDeliveries: 4,
    createdAt: String(score),
  }));

  const nextEntries = addLeaderboardEntry(entries, {
    score: 350,
    levelName: "管线夜班",
    timeLeft: 20,
    completedDeliveries: 4,
    createdAt: "new",
  });

  assert.deepEqual(nextEntries.map((entry) => entry.score), [500, 400, 350, 300, 200]);
});
