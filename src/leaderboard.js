const LEADERBOARD_KEY = "gravity-delivery-leaderboard";
const MAX_ENTRIES = 5;

export function calculateScore({ levelIndex, completedDeliveries, timeLeft, maxCombo = 0, hitCount = 0 }) {
  const baseScore = (levelIndex + 1) * 1000 + completedDeliveries * 200 + Math.floor(timeLeft * 10);
  const comboBonus = maxCombo * 150;
  const hitPenalty = hitCount * 80;

  return Math.max(baseScore + comboBonus - hitPenalty, 0);
}

export function addLeaderboardEntry(entries, entry) {
  return [...entries, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
}

export function loadLeaderboard(storage = globalThis.localStorage) {
  if (!storage) {
    return [];
  }

  try {
    const value = storage.getItem(LEADERBOARD_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries, storage = globalThis.localStorage) {
  if (!storage) {
    return;
  }

  storage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}
