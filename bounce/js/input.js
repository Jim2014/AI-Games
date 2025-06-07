// input.js
// This module defines the InputHandler class, responsible for capturing and processing user input from keyboard and touch events.

import { PADDLE_SPEED, GAME_WIDTH, PADDLE_HEIGHT } from './constants.js';

export class InputHandler {
    /**
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {Paddle} player1 - The Paddle object for player 1.
     * @param {Paddle} player2 - The Paddle object for player 2.
     * @param {Game} game - The Game object.
     */
    constructor(canvas, player1, player2, game) {
        this.keysPressed = {}; // Object to track pressed keys
        this.canvas = canvas;
        this.player1 = player1;
        this.player2 = player2;
        this.game = game;

        // Event listeners for keyboard and touch input
        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        canvas.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event));
    }

    /**
     * Handles key down events.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyDown(event) {
        this.keysPressed[event.key] = true; // Mark key as pressed

        // Start game on Enter key press if not already started
        if (event.key === 'Enter' && !this.game.gameStarted) {
            this.game.startGame();
        }

        // Prevent default browser behavior for specific keys to stop page scrolling
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'w' || event.key === 's') {
            event.preventDefault();
        }
        this.updatePaddleMovement(); // Update paddle movement based on pressed keys
    }

    /**
     * Handles key up events.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyUp(event) {
        delete this.keysPressed[event.key]; // Mark key as released
        this.updatePaddleMovement(); // Update paddle movement based on released keys
    }

    /**
     * Updates paddle's dy (vertical movement speed) based on currently pressed keys.
     */
    updatePaddleMovement() {
        // Player 1 controls (W, S)
        if (this.keysPressed['w'] || this.keysPressed['W']) {
            this.player1.moveUp();
        } else if (this.keysPressed['s'] || this.keysPressed['S']) {
            this.player1.moveDown();
        } else {
            this.player1.stop();
        }

        // Player 2 controls (ArrowUp, ArrowDown)
        if (this.keysPressed['ArrowUp']) {
            this.player2.moveUp();
        } else if (this.keysPressed['ArrowDown']) {
            this.player2.moveDown();
        } else {
            this.player2.stop();
        }
    }

    /**
     * Handles touch start events.
     * @param {TouchEvent} event - The touch event.
     */
    handleTouchStart(event) {
        event.preventDefault(); // Prevent default browser touch behavior (like scrolling)

        if (!this.game.gameStarted) { // If game not started, a touch can act like 'Enter'
            this.game.startGame();
        }

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            // Determine if touch is for Player 1 or Player 2 based on horizontal position
            if (touchX < GAME_WIDTH / 2) { // Left half for Player 1
                if (touchY < this.player1.y + PADDLE_HEIGHT / 2) {
                    this.player1.moveUp(); // Move up
                } else {
                    this.player1.moveDown(); // Move down
                }
            } else { // Right half for Player 2
                if (touchY < this.player2.y + PADDLE_HEIGHT / 2) {
                    this.player2.moveUp(); // Move up
                } else {
                    this.player2.moveDown(); // Move down
                }
            }
        }
    }

    /**
     * Handles touch end events.
     * @param {TouchEvent} event - The touch event.
     */
    handleTouchEnd(event) {
        event.preventDefault();
        // Stop movement for paddles if no touches remain
        if (event.touches.length === 0) {
            this.player1.stop();
            this.player2.stop();
        }
    }
}