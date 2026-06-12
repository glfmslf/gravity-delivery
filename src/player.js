const PLAYER_WIDTH = 54;
const PLAYER_HEIGHT = 34;
const GRAVITY = 620;
const MAX_VERTICAL_SPEED = 420;
const FLIP_VELOCITY_RETENTION = 0.22;
const BOUNCE_DAMPING = 0.18;
const HITBOX_INSET_X = 8;
const HITBOX_INSET_Y = 6;

export function createPlayer() {
  return {
    x: 150,
    y: 250,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityY: 0,
    gravityDirection: 1,
    update(input, deltaSeconds, canvas) {
      let flipped = false;

      if (input.consumeGravityToggle()) {
        this.gravityDirection *= -1;
        this.velocityY *= FLIP_VELOCITY_RETENTION;
        flipped = true;
      }

      this.velocityY += GRAVITY * this.gravityDirection * deltaSeconds;
      this.velocityY = clamp(this.velocityY, -MAX_VERTICAL_SPEED, MAX_VERTICAL_SPEED);
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

      return { flipped };
    },
  };
}

export function getPlayerHitbox(player) {
  return {
    x: player.x + HITBOX_INSET_X,
    y: player.y + HITBOX_INSET_Y,
    width: player.width - HITBOX_INSET_X * 2,
    height: player.height - HITBOX_INSET_Y * 2,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
