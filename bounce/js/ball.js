import { GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, INITIAL_BALL_SPEED } from './constants.js';

export class Ball {
    constructor() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.radius = BALL_RADIUS;
        this.dx = 0;
        this.dy = 0;
    }

    reset() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.dx = 0;
        this.dy = 0;
    }

    start(speed) {
        this.dx = (Math.random() < 0.5 ? 1 : -1) * speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * speed;
    }

    update(currentBallSpeed) {
        this.x += Math.sign(this.dx) * currentBallSpeed;
        this.y += Math.sign(this.dy) * currentBallSpeed;

        // Collision with top/bottom walls
        if (this.y + this.radius > GAME_HEIGHT || this.y - this.radius < 0) {
            this.dy *= -1;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#f6e05e'; // Yellow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}