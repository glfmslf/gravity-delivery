export function applyDeliveryReward({ timeLeft, completedDeliveries, delivery }) {
  if (!delivery || completedDeliveries.has(delivery.id)) {
    return {
      timeLeft,
      completedDeliveries,
      wasDelivered: false,
    };
  }

  const nextCompletedDeliveries = new Set(completedDeliveries);
  nextCompletedDeliveries.add(delivery.id);

  return {
    timeLeft: timeLeft + delivery.reward,
    completedDeliveries: nextCompletedDeliveries,
    wasDelivered: true,
  };
}

export function determineDeliveryOutcome({ reachedFinish, completedCount, totalCount }) {
  if (!reachedFinish) {
    return "playing";
  }

  return completedCount >= totalCount ? "success" : "failed";
}
