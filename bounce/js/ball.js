// ball.js
// This module defines the Ball class, which encapsulates the ball's properties and movement logic.

import { GAME_WIDTH, GAME_HEIGHT, BALL_RADIUS, INITIAL_BALL_SPEED } from './constants.js';

export class Ball {
    /**
     * Initializes the ball at the center of the game area with no initial movement.
     */
    constructor() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.radius = BALL_RADIUS;
        this.dx = 0; // Initial horizontal speed
        this.dy = 0; // Initial vertical speed
    }

    /**
     * Resets the ball to its initial center position and stops its movement.
     */
    reset() {
        this.x = GAME_WIDTH / 2;
        this.y = GAME_HEIGHT / 2;
        this.dx = 0;
        this.dy = 0;
    }

    /**
     * Sets the ball's initial horizontal and vertical direction with a given speed.
     * @param {number} speed - The initial speed of the ball.
     */
    start(speed) {
        this.dx = (Math.random() < 0.5 ? 1 : -1) * speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * speed;
    }

    /**
     * Updates the ball's position based on its current speed and handles collisions with the top and bottom walls.
     * @param {number} currentBallSpeed - The current speed of the ball.
     */
    update(currentBallSpeed) {
        this.x += Math.sign(this.dx) * currentBallSpeed;
        this.y += Math.sign(this.dy) * currentBallSpeed;

        // Ball collision with top/bottom walls
        if (this.y + this.radius > GAME_HEIGHT || this.y - this.radius < 0) {
            this.dy *= -1; // Reverse vertical direction
        }
    }

    /**
     * Renders the ball on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        ctx.fillStyle = '#f6e05e'; // Yellow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}