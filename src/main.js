import { createGame } from "./game.js";
import { loadImageAssets } from "./assets.js";

const canvas = document.querySelector("#game-canvas");
const timeValue = document.querySelector("#time-value");
const progressValue = document.querySelector("#progress-value");
const comboValue = document.querySelector("#combo-value");
const statusText = document.querySelector("#status-text");
const restartButton = document.querySelector("#restart-button");
const audioButton = document.querySelector("#audio-button");
const controlButton = document.querySelector("#control-button");
const leaderboardList = document.querySelector("#leaderboard-list");

const assets = await loadImageAssets();

const game = createGame({
  canvas,
  assets,
  ui: {
    timeValue,
    progressValue,
    comboValue,
    statusText,
    audioButton,
    controlButton,
    leaderboardList,
  },
});

restartButton.addEventListener("click", () => {
  game.restart();
});

audioButton.addEventListener("click", () => {
  game.toggleAudio();
});

game.start();
