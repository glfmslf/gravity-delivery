export const OBSTACLE_TIME_PENALTY = 4;
export const HIT_COOLDOWN_SECONDS = 1.2;

export function applyObstaclePenalty({ timeLeft, hitCooldown, hasHit }) {
  if (!hasHit || hitCooldown > 0) {
    return {
      timeLeft,
      hitCooldown,
      wasPenalized: false,
    };
  }

  return {
    timeLeft: Math.max(timeLeft - OBSTACLE_TIME_PENALTY, 0),
    hitCooldown: HIT_COOLDOWN_SECONDS,
    wasPenalized: true,
  };
}
