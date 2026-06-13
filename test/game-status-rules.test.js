import assert from "node:assert/strict";
import test from "node:test";

import {
  getStatusAfterRestartRequest,
  getStatusAfterStartRequest,
  shouldRestartAfterAction,
} from "../src/game-status-rules.js";

test("ready state starts playing when a start request arrives", () => {
  assert.equal(getStatusAfterStartRequest("ready", true), "playing");
});

test("ready state stays ready without a start request", () => {
  assert.equal(getStatusAfterStartRequest("ready", false), "ready");
});

test("non-ready states ignore start requests", () => {
  assert.equal(getStatusAfterStartRequest("failed", true), "failed");
  assert.equal(getStatusAfterStartRequest("success", true), "success");
});

test("success state restarts into playing when restart is requested", () => {
  assert.equal(getStatusAfterRestartRequest("success", true), "playing");
});

test("failed state restarts into playing when restart is requested", () => {
  assert.equal(getStatusAfterRestartRequest("failed", true), "playing");
});

test("ended states stay ended without a restart request", () => {
  assert.equal(getStatusAfterRestartRequest("success", false), "success");
  assert.equal(getStatusAfterRestartRequest("failed", false), "failed");
});

test("non-ended states ignore restart requests", () => {
  assert.equal(getStatusAfterRestartRequest("ready", true), "ready");
  assert.equal(getStatusAfterRestartRequest("playing", true), "playing");
});

test("restart action is only active in ended states", () => {
  assert.equal(shouldRestartAfterAction("success", true), true);
  assert.equal(shouldRestartAfterAction("failed", true), true);
  assert.equal(shouldRestartAfterAction("playing", true), false);
  assert.equal(shouldRestartAfterAction("ready", true), false);
  assert.equal(shouldRestartAfterAction("success", false), false);
});
