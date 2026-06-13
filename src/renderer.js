export function drawScene(context, canvas, state) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(context, canvas, state.distance);
  drawObstacles(context, state.level.obstacles, state.distance, canvas);
  drawDeliveries(context, state.level.deliveries, state.distance, canvas, state.completedDeliveries);
  drawPickups(context, state.level.pickups, state.distance, canvas, state.collectedPickups);
  drawPlayer(context, state.player, state.hitCooldown);
  drawStartOverlay(context, canvas, state);
  drawEndOverlay(context, canvas, state);
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

function drawPickups(context, pickups, distance, canvas, collectedPickups) {
  pickups.forEach((pickup) => {
    const x = pickup.x - distance;

    if (collectedPickups.has(pickup.id) || x + pickup.width < -40 || x > canvas.width + 40) {
      return;
    }

    const centerX = x + pickup.width / 2;
    const centerY = pickup.y + pickup.height / 2;

    context.save();
    context.translate(centerX, centerY);

    context.fillStyle = "#f8d16b";
    context.beginPath();
    context.arc(0, 0, pickup.width / 2, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "#74541f";
    context.lineWidth = 3;
    context.stroke();

    context.fillStyle = "#2e3440";
    context.fillRect(-4, -10, 8, 20);
    context.fillRect(-10, -4, 20, 8);

    context.restore();
  });
}

function drawDeliveries(context, deliveries, distance, canvas, completedDeliveries) {
  deliveries.forEach((delivery) => {
    const x = delivery.x - distance;

    if (x + delivery.width < -40 || x > canvas.width + 40) {
      return;
    }

    const isCompleted = completedDeliveries.has(delivery.id);

    context.save();
    context.translate(x, delivery.y);
    context.globalAlpha = isCompleted ? 0.35 : 1;

    context.fillStyle = "#1f9e89";
    context.fillRect(0, 0, delivery.width, delivery.height);

    context.fillStyle = "#d7fff2";
    context.fillRect(8, 10, delivery.width - 16, 10);
    context.fillRect(8, delivery.height - 18, delivery.width - 16, 8);

    context.strokeStyle = "#0c544b";
    context.lineWidth = 3;
    context.strokeRect(1.5, 1.5, delivery.width - 3, delivery.height - 3);

    context.fillStyle = "#102f2b";
    context.font = "bold 13px sans-serif";
    context.textAlign = "center";
    context.fillText(delivery.id, delivery.width / 2, delivery.height / 2 + 5);

    if (isCompleted) {
      context.strokeStyle = "#d7fff2";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(16, delivery.height / 2);
      context.lineTo(28, delivery.height / 2 + 12);
      context.lineTo(delivery.width - 14, 18);
      context.stroke();
    }

    context.restore();
  });
}

function drawStartOverlay(context, canvas, state) {
  if (state.status !== "ready") {
    return;
  }

  context.save();
  context.fillStyle = "rgb(20 24 30 / 68%)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#fff9ed";
  context.textAlign = "center";
  context.font = "bold 40px sans-serif";
  context.fillText("反重力快递", canvas.width / 2, canvas.height / 2 - 104);

  context.font = "18px sans-serif";
  context.fillText("按空格或点击画面翻转重力，贴近绿色门牌完成全部投递。", canvas.width / 2, canvas.height / 2 - 54);
  context.fillText("黄色时间包加时，橙红障碍会扣时。漏送订单也会失败。", canvas.width / 2, canvas.height / 2 - 22);

  context.fillStyle = "#1f9e89";
  context.fillRect(canvas.width / 2 - 112, canvas.height / 2 + 22, 224, 44);
  context.strokeStyle = "#fff9ed";
  context.lineWidth = 3;
  context.strokeRect(canvas.width / 2 - 112, canvas.height / 2 + 22, 224, 44);

  context.fillStyle = "#fff9ed";
  context.font = "bold 18px sans-serif";
  context.fillText("Space / Enter / 点击开始", canvas.width / 2, canvas.height / 2 + 51);

  context.restore();
}

function drawEndOverlay(context, canvas, state) {
  if (state.status !== "success" && state.status !== "failed") {
    return;
  }

  const isSuccess = state.status === "success";
  const title = isSuccess ? "配送成功" : "配送失败";
  const detail = isSuccess
    ? `完成 ${state.completedDeliveries.size}/${state.level.deliveries.length} 单，剩余 ${state.timeLeft.toFixed(1)} 秒`
    : getFailureDetail(state);

  context.save();
  context.fillStyle = "rgb(20 24 30 / 72%)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = isSuccess ? "#1f9e89" : "#e45d35";
  context.fillRect(canvas.width / 2 - 170, canvas.height / 2 - 76, 340, 132);

  context.strokeStyle = "#fff9ed";
  context.lineWidth = 4;
  context.strokeRect(canvas.width / 2 - 170, canvas.height / 2 - 76, 340, 132);

  context.fillStyle = "#fff9ed";
  context.textAlign = "center";
  context.font = "bold 34px sans-serif";
  context.fillText(title, canvas.width / 2, canvas.height / 2 - 22);

  context.font = "16px sans-serif";
  context.fillText(detail, canvas.width / 2, canvas.height / 2 + 14);
  context.fillText(isSuccess ? "Space / Enter / 点击进入下一关" : "Space / Enter / 点击直接重开", canvas.width / 2, canvas.height / 2 + 42);

  context.restore();
}

function getFailureDetail(state) {
  if (state.timeLeft <= 0) {
    return `完成 ${state.completedDeliveries.size}/${state.level.deliveries.length} 单，时间耗尽`;
  }

  return `完成 ${state.completedDeliveries.size}/${state.level.deliveries.length} 单，漏送订单`;
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
