export function createInput() {
  const keys = new Set();
  let gravityToggleQueued = false;

  function handleKeyDown(event) {
    if (event.code === "Space") {
      event.preventDefault();
      if (!keys.has(event.code)) {
        gravityToggleQueued = true;
      }
    }

    keys.add(event.code);
  }

  function handleKeyUp(event) {
    keys.delete(event.code);
  }

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    isPressed(code) {
      return keys.has(code);
    },
    consumeGravityToggle() {
      const shouldToggle = gravityToggleQueued;
      gravityToggleQueued = false;
      return shouldToggle;
    },
    destroy() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    },
  };
}

