export function createLevel() {
  return {
    length: 2400,
    speed: 120,
    obstacles: [
      { x: 420, y: 58, width: 62, height: 180 },
      { x: 720, y: 318, width: 70, height: 170 },
      { x: 1040, y: 24, width: 58, height: 150 },
      { x: 1320, y: 360, width: 84, height: 136 },
      { x: 1660, y: 92, width: 66, height: 210 },
      { x: 1980, y: 300, width: 74, height: 190 },
    ],
    pickups: [],
  };
}

export function getVisibleObstacles(obstacles, distance) {
  return obstacles.map((obstacle) => ({
    ...obstacle,
    x: obstacle.x - distance,
  }));
}
