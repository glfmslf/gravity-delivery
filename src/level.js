export function createLevel() {
  return {
    length: 2400,
    speed: 120,
    obstacles: [
      { x: 430, y: 44, width: 70, height: 190 },
      { x: 720, y: 320, width: 76, height: 176 },
      { x: 1010, y: 24, width: 68, height: 220 },
      { x: 1300, y: 306, width: 82, height: 190 },
      { x: 1600, y: 54, width: 74, height: 210 },
      { x: 1900, y: 332, width: 78, height: 164 },
      { x: 2180, y: 74, width: 70, height: 190 },
    ],
    deliveries: [
      { id: "3F-07", x: 560, y: 92, width: 68, height: 72, reward: 3 },
      { id: "B1-18", x: 1160, y: 374, width: 68, height: 72, reward: 3 },
      { id: "6F-22", x: 1760, y: 102, width: 68, height: 72, reward: 3 },
      { id: "2F-31", x: 2260, y: 356, width: 68, height: 72, reward: 4 },
    ],
    pickups: [
      { id: "T-01", x: 860, y: 250, width: 34, height: 34, reward: 5 },
      { id: "T-02", x: 1460, y: 224, width: 34, height: 34, reward: 5 },
      { id: "T-03", x: 2060, y: 248, width: 34, height: 34, reward: 6 },
    ],
  };
}

export function getVisibleObstacles(obstacles, distance) {
  return obstacles.map((obstacle) => ({
    ...obstacle,
    x: obstacle.x - distance,
  }));
}

export function getVisibleDeliveries(deliveries, distance) {
  return deliveries.map((delivery) => ({
    ...delivery,
    x: delivery.x - distance,
  }));
}

export function getVisiblePickups(pickups, distance) {
  return pickups.map((pickup) => ({
    ...pickup,
    x: pickup.x - distance,
  }));
}
