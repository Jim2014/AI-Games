import { PADDLE_SPEED, GAME_WIDTH, PADDLE_HEIGHT } from './constants.js';

export class InputHandler {
    constructor(canvas, player1, player2, game) {
        this.keysPressed = {};
        this.canvas = canvas;
        this.player1 = player1;
        this.player2 = player2;
        this.game = game;

        document.addEventListener('keydown', (event) => this.handleKeyDown(event));
        document.addEventListener('keyup', (event) => this.handleKeyUp(event));
        canvas.addEventListener('touchstart', (event) => this.handleTouchStart(event));
        canvas.addEventListener('touchend', (event) => this.handleTouchEnd(event));
    }

    handleKeyDown(event) {
        this.keysPressed[event.key] = true;

        if (event.key === 'Enter' && !this.game.gameStarted) {
            this.game.startGame();
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'w' || event.key === 's') {
            event.preventDefault();
        }
        this.updatePaddleMovement();
    }

    handleKeyUp(event) {
        delete this.keysPressed[event.key];
        this.updatePaddleMovement();
    }

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

    handleTouchStart(event) {
        event.preventDefault();

        if (!this.game.gameStarted) {
            this.game.startGame();
        }

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            if (touchX < GAME_WIDTH / 2) { // Left half for Player 1
                if (touchY < this.player1.y + PADDLE_HEIGHT / 2) {
                    this.player1.moveUp();
                } else {
                    this.player1.moveDown();
                }
            } else { // Right half for Player 2
                if (touchY < this.player2.y + PADDLE_HEIGHT / 2) {
                    this.player2.moveUp();
                } else {
                    this.player2.moveDown();
                }
            }
        }
    }

    handleTouchEnd(event) {
        event.preventDefault();
        if (event.touches.length === 0) {
            this.player1.stop();
            this.player2.stop();
        }
    }
}