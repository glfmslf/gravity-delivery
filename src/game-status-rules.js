export function getStatusAfterStartRequest(status, startRequested) {
  if (status !== "ready" || !startRequested) {
    return status;
  }

  return "playing";
}

export function getStatusAfterRestartRequest(status, restartRequested) {
  if ((status !== "success" && status !== "failed") || !restartRequested) {
    return status;
  }

  return "playing";
}

export function shouldRestartAfterAction(status, restartRequested) {
  return (status === "success" || status === "failed") && restartRequested;
}
