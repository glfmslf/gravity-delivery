import assert from "node:assert/strict";
import test from "node:test";

import { createInput } from "../src/input.js";

test("pointer action queues start and gravity toggle", () => {
  const keyboardTarget = createFakeEventTarget();
  const actionTarget = createFakeEventTarget();
  let startRequests = 0;
  const input = createInput({
    eventTarget: keyboardTarget,
    actionTargets: [actionTarget],
    onStartRequest() {
      startRequests += 1;
    },
  });

  actionTarget.dispatch("pointerdown", createFakeEvent());

  assert.equal(input.consumeStartRequest(), true);
  assert.equal(input.consumeGravityToggle(), true);
  assert.equal(startRequests, 1);
  input.destroy();
});

test("destroy removes pointer action listeners", () => {
  const keyboardTarget = createFakeEventTarget();
  const actionTarget = createFakeEventTarget();
  const input = createInput({ eventTarget: keyboardTarget, actionTargets: [actionTarget] });

  input.destroy();
  actionTarget.dispatch("pointerdown", createFakeEvent());

  assert.equal(input.consumeStartRequest(), false);
  assert.equal(input.consumeGravityToggle(), false);
});

test("start requests can be consumed without affecting gravity toggles", () => {
  const keyboardTarget = createFakeEventTarget();
  const input = createInput({ eventTarget: keyboardTarget });

  keyboardTarget.dispatch("keydown", {
    code: "Space",
    preventDefault() {},
  });

  assert.equal(input.consumeStartRequest(), true);
  assert.equal(input.consumeStartRequest(), false);
  assert.equal(input.consumeGravityToggle(), true);
  input.destroy();
});

function createFakeEventTarget() {
  const listeners = new Map();

  return {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    removeEventListener(type, listener) {
      if (listeners.get(type) === listener) {
        listeners.delete(type);
      }
    },
    dispatch(type, event) {
      listeners.get(type)?.(event);
    },
  };
}

function createFakeEvent() {
  return {
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
  };
}
