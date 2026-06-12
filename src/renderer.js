export function drawScene(context, canvas, state) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(context, canvas, state.distance);
  drawObstacles(context, state.level.obstacles, state.distance, canvas);
  drawPlayer(context, state.player, state.hitCooldown);
}

function drawBackground(context, canvas, distance) {
  context.fillStyle = "#2e3440";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#46505c";
  for (let x = -120; x < canvas.width + 120; x += 160) {
    const offsetX = x - (distance % 160);
    context.fillRect(offsetX, 0, 76, 92);
    context.fillRect(offsetX + 20, canvas.height - 112, 96, 112);
  }

  context.fillStyle = "#f8d16b";
  for (let x = -60; x < canvas.width + 60; x += 120) {
    const offsetX = x - ((distance * 0.8) % 120);
    context.fillRect(offsetX, 116, 34, 10);
    context.fillRect(offsetX + 18, canvas.height - 142, 48, 10);
  }
}

function drawObstacles(context, obstacles, distance, canvas) {
  obstacles.forEach((obstacle) => {
    const x = obstacle.x - distance;

    if (x + obstacle.width < -40 || x > canvas.width + 40) {
      return;
    }

    context.save();
    context.translate(x, obstacle.y);

    context.fillStyle = "#e45d35";
    context.fillRect(0, 0, obstacle.width, obstacle.height);

    context.fillStyle = "#ffb15f";
    context.fillRect(0, 0, obstacle.width, 12);
    context.fillRect(0, obstacle.height - 12, obstacle.width, 12);

    context.strokeStyle = "#6f2c21";
    context.lineWidth = 3;
    context.strokeRect(1.5, 1.5, obstacle.width - 3, obstacle.height - 3);

    context.fillStyle = "rgb(255 249 237 / 58%)";
    for (let y = 24; y < obstacle.height - 20; y += 34) {
      context.fillRect(10, y, obstacle.width - 20, 5);
    }

    context.restore();
  });
}

function drawPlayer(context, player, hitCooldown) {
  context.save();
  context.translate(player.x, player.y);
  context.globalAlpha = hitCooldown > 0 ? 0.55 + Math.sin(hitCooldown * 28) * 0.25 : 1;

  context.fillStyle = "#f5b44b";
  context.fillRect(6, 8, player.width - 12, player.height - 10);

  context.fillStyle = "#d97836";
  context.fillRect(12, 4, player.width - 24, 10);

  context.fillStyle = "#29323d";
  context.fillRect(player.width - 2, 14, 14, 8);

  context.fillStyle = "#1f9e89";
  context.fillRect(0, 14, 12, 8);

  context.strokeStyle = "#3a3028";
  context.lineWidth = 3;
  context.strokeRect(6, 8, player.width - 12, player.height - 10);

  context.restore();
}
