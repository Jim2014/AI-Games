// paddle.js
// This module defines the Paddle class, which represents a single player paddle in the game.

import { PADDLE_WIDTH, PADDLE_HEIGHT, GAME_HEIGHT, PADDLE_SPEED } from './constants.js';

export class Paddle {
    /**
     * @param {number} x - The initial X-coordinate of the paddle.
     */
    constructor(x) {
        this.x = x;
        this.y = (GAME_HEIGHT - PADDLE_HEIGHT) / 2; // Center vertically
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.dy = 0; // Vertical movement speed
        this.score = 0;
    }

    /**
     * Updates the paddle's vertical position, ensuring it stays within the canvas bounds.
     */
    update() {
        this.y += this.dy;
        // Clamp paddle position within game height
        this.y = Math.max(0, Math.min(this.y, GAME_HEIGHT - this.height));
    }

    /**
     * Renders the paddle on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {string} color - The color to draw the paddle.
     */
    draw(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    /**
     * Sets the paddle's vertical movement speed to move up.
     */
    moveUp() {
        this.dy = -PADDLE_SPEED;
    }

    /**
     * Sets the paddle's vertical movement speed to move down.
     */
    moveDown() {
        this.dy = PADDLE_SPEED;
    }

    /**
     * Stops the paddle's vertical movement.
     */
    stop() {
        this.dy = 0;
    }
}