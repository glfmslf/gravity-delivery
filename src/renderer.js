import { getHitEffectVisuals } from "./hit-effects.js";

export function drawScene(context, canvas, state, assets = {}) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#2e3440";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const hitVisuals = getHitEffectVisuals(state.hitEffect);

  context.save();
  context.translate(hitVisuals.shakeX, hitVisuals.shakeY);
  drawBackground(context, canvas, state.distance);
  drawRouteFrame(context, canvas);
  drawGravityIndicator(context, canvas, state.player.gravityDirection);
  drawObstacles(context, state.level.obstacles, state.distance, canvas, assets);
  drawDeliveries(context, state.level.deliveries, state.distance, canvas, state.completedDeliveries, assets);
  drawPickups(context, state.level.pickups, state.distance, canvas, state.collectedPickups, assets);
  drawFinishLine(context, canvas, state.level.length, state.distance);
  drawPlayer(context, state.player, state.hitCooldown, assets);
  drawHitSparks(context, hitVisuals.sparks);
  context.restore();

  drawHitFlash(context, canvas, hitVisuals.flashAlpha);
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

function drawRouteFrame(context, canvas) {
  context.save();

  context.fillStyle = "#202832";
  context.fillRect(0, 0, canvas.width, 24);
  context.fillRect(0, canvas.height - 24, canvas.width, 24);

  context.fillStyle = "#53616f";
  for (let x = 0; x < canvas.width; x += 56) {
    context.fillRect(x, 10, 32, 4);
    context.fillRect(x + 24, canvas.height - 14, 32, 4);
  }

  context.strokeStyle = "rgb(255 249 237 / 18%)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, 24.5);
  context.lineTo(canvas.width, 24.5);
  context.moveTo(0, canvas.height - 24.5);
  context.lineTo(canvas.width, canvas.height - 24.5);
  context.stroke();

  context.restore();
}

function drawGravityIndicator(context, canvas, gravityDirection) {
  const centerX = canvas.width - 72;
  const centerY = gravityDirection > 0 ? 72 : canvas.height - 72;
  const arrowTipY = gravityDirection > 0 ? centerY + 22 : centerY - 22;
  const arrowBaseY = gravityDirection > 0 ? centerY - 20 : centerY + 20;

  context.save();

  context.fillStyle = "rgb(20 24 30 / 42%)";
  context.fillRect(centerX - 34, centerY - 36, 68, 72);
  context.strokeStyle = "rgb(255 249 237 / 35%)";
  context.lineWidth = 2;
  context.strokeRect(centerX - 34.5, centerY - 36.5, 69, 73);

  context.strokeStyle = "#f8d16b";
  context.lineWidth = 5;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(centerX, arrowBaseY);
  context.lineTo(centerX, arrowTipY);
  context.stroke();

  context.fillStyle = "#f8d16b";
  context.beginPath();
  context.moveTo(centerX, arrowTipY + gravityDirection * 8);
  context.lineTo(centerX - 10, arrowTipY - gravityDirection * 7);
  context.lineTo(centerX + 10, arrowTipY - gravityDirection * 7);
  context.closePath();
  context.fill();

  context.fillStyle = "#fff9ed";
  context.font = "bold 12px sans-serif";
  context.textAlign = "center";
  context.fillText("重力", centerX, centerY + (gravityDirection > 0 ? -24 : 30));

  context.restore();
}

function drawPickups(context, pickups, distance, canvas, collectedPickups, assets) {
  pickups.forEach((pickup) => {
    const x = pickup.x - distance;

    if (collectedPickups.has(pickup.id) || x + pickup.width < -40 || x > canvas.width + 40) {
      return;
    }

    const centerX = x + pickup.width / 2;
    const centerY = pickup.y + pickup.height / 2;

    context.save();
    context.translate(centerX, centerY);

    if (isReadyImage(assets.pickup)) {
      context.drawImage(assets.pickup, -pickup.width / 2 - 3, -pickup.height / 2 - 3, pickup.width + 6, pickup.height + 6);
      context.restore();
      return;
    }

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

function drawDeliveries(context, deliveries, distance, canvas, completedDeliveries, assets) {
  deliveries.forEach((delivery) => {
    const x = delivery.x - distance;

    if (x + delivery.width < -40 || x > canvas.width + 40) {
      return;
    }

    const isCompleted = completedDeliveries.has(delivery.id);

    context.save();
    context.translate(x, delivery.y);
    context.globalAlpha = isCompleted ? 0.35 : 1;

    if (isReadyImage(assets.delivery)) {
      context.drawImage(assets.delivery, 0, 0, delivery.width, delivery.height);
    } else {
      context.fillStyle = "#1f9e89";
      context.fillRect(0, 0, delivery.width, delivery.height);

      context.fillStyle = "#d7fff2";
      context.fillRect(8, 10, delivery.width - 16, 10);
      context.fillRect(8, delivery.height - 18, delivery.width - 16, 8);

      context.strokeStyle = "#0c544b";
      context.lineWidth = 3;
      context.strokeRect(1.5, 1.5, delivery.width - 3, delivery.height - 3);
    }

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

  context.save();
  context.fillStyle = "rgb(20 24 30 / 72%)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (state.status === "success") {
    drawSuccessOverlay(context, canvas, state);
  } else {
    drawFailureOverlay(context, canvas, state);
  }

  context.restore();
}

function drawSuccessOverlay(context, canvas, state) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const rating = state.finalRating ?? { grade: "--", label: "配送完成" };
  const score = state.finalScore ?? 0;

  context.fillStyle = "#171d24";
  context.fillRect(centerX - 220, centerY - 178, 440, 326);

  context.strokeStyle = "#53616f";
  context.lineWidth = 3;
  context.strokeRect(centerX - 220, centerY - 178, 440, 326);

  context.fillStyle = "#55c6ad";
  context.textAlign = "center";
  context.font = "bold 22px sans-serif";
  context.fillText("配送成功", centerX, centerY - 136);

  context.fillStyle = "#f8d16b";
  context.font = "bold 112px sans-serif";
  context.fillText(rating.grade, centerX, centerY - 24);

  context.fillStyle = "#fff9ed";
  context.font = "bold 22px sans-serif";
  context.fillText(rating.label, centerX, centerY + 14);

  context.fillStyle = "#b9c2ca";
  context.font = "15px sans-serif";
  context.fillText(
    `${score} 分 · ${state.timeLeft.toFixed(1)} 秒 · 连击 x${state.maxCombo} · 撞击 ${state.hitCount} 次`,
    centerX,
    centerY + 54,
  );

  context.fillStyle = "#e45d35";
  context.fillRect(centerX - 152, centerY + 82, 304, 42);

  context.fillStyle = "#fff9ed";
  context.font = "bold 16px sans-serif";
  context.fillText("Space / Enter / 点击进入下一关", centerX, centerY + 109);
}

function drawFailureOverlay(context, canvas, state) {
  context.fillStyle = "#e45d35";
  context.fillRect(canvas.width / 2 - 170, canvas.height / 2 - 76, 340, 132);

  context.strokeStyle = "#fff9ed";
  context.lineWidth = 4;
  context.strokeRect(canvas.width / 2 - 170, canvas.height / 2 - 76, 340, 132);

  context.fillStyle = "#fff9ed";
  context.textAlign = "center";
  context.font = "bold 34px sans-serif";
  context.fillText("配送失败", canvas.width / 2, canvas.height / 2 - 22);

  context.font = "16px sans-serif";
  context.fillText(getFailureDetail(state), canvas.width / 2, canvas.height / 2 + 14);
  context.fillText("Space / Enter / 点击直接重开", canvas.width / 2, canvas.height / 2 + 42);
}

function getFailureDetail(state) {
  if (state.timeLeft <= 0) {
    return `完成 ${state.completedDeliveries.size}/${state.level.deliveries.length} 单，时间耗尽`;
  }

  return `完成 ${state.completedDeliveries.size}/${state.level.deliveries.length} 单，漏送订单`;
}

function drawFinishLine(context, canvas, levelLength, distance) {
  const x = levelLength - distance;

  if (x < -40 || x > canvas.width + 80) {
    return;
  }

  context.save();
  context.translate(x, 24);

  context.fillStyle = "rgb(255 249 237 / 72%)";
  context.fillRect(0, 0, 10, canvas.height - 48);

  for (let y = 0; y < canvas.height - 48; y += 28) {
    context.fillStyle = y % 56 === 0 ? "#202832" : "#fff9ed";
    context.fillRect(10, y, 26, 28);
  }

  context.fillStyle = "#fff9ed";
  context.font = "bold 14px sans-serif";
  context.textAlign = "center";
  context.save();
  context.translate(52, (canvas.height - 48) / 2);
  context.rotate(-Math.PI / 2);
  context.fillText("终点", 0, 0);
  context.restore();

  context.restore();
}

function drawObstacles(context, obstacles, distance, canvas, assets) {
  obstacles.forEach((obstacle) => {
    const x = obstacle.x - distance;

    if (x + obstacle.width < -40 || x > canvas.width + 40) {
      return;
    }

    context.save();
    context.translate(x, obstacle.y);

    if (isReadyImage(assets.obstacle)) {
      context.drawImage(assets.obstacle, 0, 0, obstacle.width, obstacle.height);
      context.restore();
      return;
    }

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

function drawPlayer(context, player, hitCooldown, assets) {
  context.save();
  context.translate(player.x, player.y);
  context.globalAlpha = hitCooldown > 0 ? 0.55 + Math.sin(hitCooldown * 28) * 0.25 : 1;

  if (isReadyImage(assets.player)) {
    context.save();
    context.translate(-22, -8);
    context.drawImage(assets.player, 0, 0, player.width + 44, player.height + 22);
    context.restore();
    context.restore();
    return;
  }

  context.fillStyle = player.gravityDirection > 0 ? "#f8d16b" : "#78d6ff";
  context.beginPath();
  context.moveTo(-8, player.height / 2);
  context.lineTo(-26, player.height / 2 - 8);
  context.lineTo(-20, player.height / 2);
  context.lineTo(-26, player.height / 2 + 8);
  context.closePath();
  context.fill();

  context.fillStyle = "#f5b44b";
  context.fillRect(6, 8, player.width - 12, player.height - 10);

  context.fillStyle = "#d97836";
  context.fillRect(12, 4, player.width - 24, 10);

  context.fillStyle = "#fff1c8";
  context.fillRect(16, 13, 16, 8);

  context.strokeStyle = "#8b5a2b";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(16, 17);
  context.lineTo(32, 17);
  context.moveTo(24, 13);
  context.lineTo(24, 21);
  context.stroke();

  context.fillStyle = "#29323d";
  context.fillRect(player.width - 2, 14, 14, 8);

  context.fillStyle = "#1f9e89";
  context.fillRect(0, 14, 12, 8);

  context.strokeStyle = "#3a3028";
  context.lineWidth = 3;
  context.strokeRect(6, 8, player.width - 12, player.height - 10);

  context.restore();
}

function drawHitSparks(context, sparks) {
  sparks.forEach((spark) => {
    if (spark.size <= 0 || spark.alpha <= 0) {
      return;
    }

    context.save();
    context.translate(spark.x, spark.y);
    context.rotate(Math.PI / 4);
    context.globalAlpha = spark.alpha;
    context.fillStyle = spark.color;
    context.fillRect(-spark.size / 2, -spark.size / 2, spark.size, spark.size);
    context.restore();
  });
}

function drawHitFlash(context, canvas, flashAlpha) {
  if (flashAlpha <= 0) {
    return;
  }

  context.save();
  context.globalAlpha = flashAlpha;
  context.fillStyle = "#e45d35";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = Math.min(flashAlpha * 1.8, 0.8);
  context.strokeStyle = "#7d1f1a";
  context.lineWidth = 24;
  context.strokeRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function isReadyImage(image) {
  return image && image.complete !== false && image.naturalWidth !== 0;
}
