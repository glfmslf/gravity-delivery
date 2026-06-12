const PLAYER_WIDTH = 54;
const PLAYER_HEIGHT = 34;
const HORIZONTAL_SPEED = 260;
const GRAVITY = 920;
const BOUNCE_DAMPING = 0.35;

export function createPlayer() {
  return {
    x: 150,
    y: 250,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    gravityDirection: 1,
    update(input, deltaSeconds, canvas) {
      if (input.consumeGravityToggle()) {
        this.gravityDirection *= -1;
        this.velocityY *= 0.45;
      }

      if (input.isPressed("ArrowLeft")) {
        this.x -= HORIZONTAL_SPEED * deltaSeconds;
      }

      if (input.isPressed("ArrowRight")) {
        this.x += HORIZONTAL_SPEED * deltaSeconds;
      }

      this.velocityY += GRAVITY * this.gravityDirection * deltaSeconds;
      this.y += this.velocityY * deltaSeconds;

      this.x = clamp(this.x, 24, canvas.width - this.width - 24);

      if (this.y < 24) {
        this.y = 24;
        this.velocityY = Math.abs(this.velocityY) * BOUNCE_DAMPING;
      }

      if (this.y + this.height > canvas.height - 24) {
        this.y = canvas.height - this.height - 24;
        this.velocityY = -Math.abs(this.velocityY) * BOUNCE_DAMPING;
      }
    },
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

