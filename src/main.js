import { createGame } from "./game.js";

const canvas = document.querySelector("#game-canvas");
const timeValue = document.querySelector("#time-value");
const progressValue = document.querySelector("#progress-value");
const statusText = document.querySelector("#status-text");
const restartButton = document.querySelector("#restart-button");

const game = createGame({
  canvas,
  ui: {
    timeValue,
    progressValue,
    statusText,
  },
});

restartButton.addEventListener("click", () => {
  game.restart();
});

game.start();

