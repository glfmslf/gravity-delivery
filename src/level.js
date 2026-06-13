const LEVELS = [
  {
    name: "楼道急件",
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
  },
  {
    name: "管线夜班",
    length: 2800,
    speed: 135,
    obstacles: [
      { x: 380, y: 332, width: 72, height: 164 },
      { x: 670, y: 38, width: 76, height: 208 },
      { x: 990, y: 312, width: 70, height: 188 },
      { x: 1280, y: 54, width: 86, height: 210 },
      { x: 1580, y: 328, width: 80, height: 168 },
      { x: 1900, y: 28, width: 74, height: 230 },
      { x: 2220, y: 338, width: 82, height: 158 },
      { x: 2520, y: 72, width: 72, height: 184 },
    ],
    deliveries: [
      { id: "7F-04", x: 520, y: 372, width: 68, height: 72, reward: 4 },
      { id: "1F-16", x: 1120, y: 108, width: 68, height: 72, reward: 4 },
      { id: "9F-25", x: 1740, y: 366, width: 68, height: 72, reward: 4 },
      { id: "4F-33", x: 2380, y: 112, width: 68, height: 72, reward: 5 },
    ],
    pickups: [
      { id: "N-01", x: 830, y: 248, width: 34, height: 34, reward: 5 },
      { id: "N-02", x: 1440, y: 246, width: 34, height: 34, reward: 5 },
      { id: "N-03", x: 2120, y: 250, width: 34, height: 34, reward: 7 },
    ],
  },
];

export function createLevel(index = 0) {
  const level = LEVELS[((index % LEVELS.length) + LEVELS.length) % LEVELS.length];
  return structuredClone(level);
}

export function getLevelCount() {
  return LEVELS.length;
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
