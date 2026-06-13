export function createInput({
  eventTarget = globalThis.window,
  actionTargets = [],
  onFirstInteraction,
  onStartRequest,
} = {}) {
  const keys = new Set();
  let gravityToggleQueued = false;
  let startQueued = false;
  let hasInteracted = false;

  function notifyInteraction() {
    if (hasInteracted) {
      return;
    }

    hasInteracted = true;
    onFirstInteraction?.();
  }

  function handleKeyDown(event) {
    notifyInteraction();

    if (event.code === "Space") {
      event.preventDefault();
      if (!keys.has(event.code)) {
        gravityToggleQueued = true;
      }
      startQueued = true;
      onStartRequest?.();
    }

    if (event.code === "Enter") {
      startQueued = true;
      onStartRequest?.();
    }

    keys.add(event.code);
  }

  function handleKeyUp(event) {
    notifyInteraction();
    keys.delete(event.code);
  }

  function handleAction(event) {
    event.preventDefault?.();
    notifyInteraction();
    gravityToggleQueued = true;
    startQueued = true;
    onStartRequest?.();
  }

  eventTarget.addEventListener("keydown", handleKeyDown);
  eventTarget.addEventListener("keyup", handleKeyUp);
  actionTargets.forEach((target) => {
    target?.addEventListener("pointerdown", handleAction);
  });

  return {
    isPressed(code) {
      return keys.has(code);
    },
    consumeGravityToggle() {
      const shouldToggle = gravityToggleQueued;
      gravityToggleQueued = false;
      return shouldToggle;
    },
    consumeStartRequest() {
      const shouldStart = startQueued;
      startQueued = false;
      return shouldStart;
    },
    destroy() {
      eventTarget.removeEventListener("keydown", handleKeyDown);
      eventTarget.removeEventListener("keyup", handleKeyUp);
      actionTargets.forEach((target) => {
        target?.removeEventListener("pointerdown", handleAction);
      });
    },
  };
}
