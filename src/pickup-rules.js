export function applyPickupReward({ timeLeft, collectedPickups, pickup }) {
  if (!pickup || collectedPickups.has(pickup.id)) {
    return {
      timeLeft,
      collectedPickups,
      wasCollected: false,
    };
  }

  const nextCollectedPickups = new Set(collectedPickups);
  nextCollectedPickups.add(pickup.id);

  return {
    timeLeft: timeLeft + pickup.reward,
    collectedPickups: nextCollectedPickups,
    wasCollected: true,
  };
}
