import { PADDLE_WIDTH, PADDLE_HEIGHT, GAME_HEIGHT, PADDLE_SPEED } from './constants.js';

export class Paddle {
    constructor(x) {
        this.x = x;
        this.y = (GAME_HEIGHT - PADDLE_HEIGHT) / 2;
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.dy = 0;
        this.score = 0;
    }

    update() {
        this.y += this.dy;
        this.y = Math.max(0, Math.min(this.y, GAME_HEIGHT - this.height));
    }

    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveUp() {
        this.dy = -PADDLE_SPEED;
    }

    moveDown() {
        this.dy = PADDLE_SPEED;
    }

    stop() {
        this.dy = 0;
    }
}