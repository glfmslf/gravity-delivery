import assert from "node:assert/strict";
import test from "node:test";

import { createAudio } from "../src/audio.js";

test("background music schedules and clears its loop", () => {
  const timers = [];
  const clearedTimers = [];
  const audio = createAudio({
    AudioContext: createFakeAudioContext,
    setTimer(callback, interval) {
      timers.push({ callback, interval });
      return timers.length;
    },
    clearTimer(timerId) {
      clearedTimers.push(timerId);
    },
  });

  audio.startMusic();
  audio.startMusic();
  audio.stopMusic();

  assert.equal(timers.length, 1);
  assert.equal(timers[0].interval, 480);
  assert.deepEqual(clearedTimers, [1]);
});

test("muting stops music and prevents new music loops", () => {
  const clearedTimers = [];
  let timerCount = 0;
  const audio = createAudio({
    AudioContext: createFakeAudioContext,
    setTimer() {
      timerCount += 1;
      return timerCount;
    },
    clearTimer(timerId) {
      clearedTimers.push(timerId);
    },
  });

  audio.startMusic();
  assert.equal(audio.toggleMuted(), true);
  audio.startMusic();

  assert.equal(timerCount, 1);
  assert.deepEqual(clearedTimers, [1]);
});

function createFakeAudioContext() {
  return {
    currentTime: 0,
    destination: {},
    state: "running",
    resume() {},
    createOscillator() {
      return {
        frequency: createFakeParam(),
        type: "sine",
        connect() {},
        start() {},
        stop() {},
      };
    },
    createGain() {
      return {
        gain: createFakeParam(),
        connect() {},
      };
    },
  };
}

function createFakeParam() {
  return {
    setValueAtTime() {},
    exponentialRampToValueAtTime() {},
  };
}
