export function calculateDeliveryRating({ timeLeft, maxCombo, hitCount, totalDeliveries }) {
  if (hitCount === 0 && maxCombo >= totalDeliveries) {
    return { grade: "S", label: "完美送达" };
  }

  if (hitCount <= 1 && timeLeft >= 30) {
    return { grade: "A", label: "准时送达" };
  }

  if (timeLeft >= 15) {
    return { grade: "B", label: "顺利送达" };
  }

  return { grade: "C", label: "完成送达" };
}
