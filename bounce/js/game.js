// game.js
// This module defines the Game class, which is the core of the game logic.

import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { InputHandler } from './input.js';
import { GAME_WIDTH, GAME_HEIGHT, INITIAL_BALL_SPEED, BALL_SPEED_INCREASE_RATE } from './constants.js';

export class Game {
    /**
     * @param {HTMLCanvasElement} canvas - The game canvas element.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {HTMLElement} player1ScoreDisplay - The HTML element to display player 1's score.
     * @param {HTMLElement} player2ScoreDisplay - The HTML element to display player 2's score.
     * @param {HTMLElement} gameTimeDisplay - The HTML element to display the game time.
     * @param {HTMLElement} ballSpeedDisplay - The HTML element to display the ball speed.
     */
    constructor(canvas, ctx, player1ScoreDisplay, player2ScoreDisplay, gameTimeDisplay, ballSpeedDisplay) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player1ScoreDisplay = player1ScoreDisplay;
        this.player2ScoreDisplay = player2ScoreDisplay;
        this.gameTimeDisplay = gameTimeDisplay;
        this.ballSpeedDisplay = ballSpeedDisplay;

        // Initialize game objects
        this.player1 = new Paddle(0);
        this.player2 = new Paddle(GAME_WIDTH - 15); // PADDLE_WIDTH is 15
        this.ball = new Ball();
        this.inputHandler = new InputHandler(canvas, this.player1, this.player2, this);

        // Game state variables
        this.gameStarted = false;
        this.gameTime = 0;
        this.lastFrameTime = performance.now();
        this.currentBallSpeed = INITIAL_BALL_SPEED;
    }

    /**
     * Resets the game state.
     */
    resetGame() {
        this.player1.score = 0;
        this.player2.score = 0;
        this.ball.reset();
        this.gameStarted = false;
        this.gameTime = 0;
        this.currentBallSpeed = INITIAL_BALL_SPEED;
        this.draw(); // Draw initial state
    }

    /**
     * Starts the game.
     */
    startGame() {
        this.gameStarted = true;
        this.ball.start(INITIAL_BALL_SPEED);
        this.lastFrameTime = performance.now();
    }

    /**
     * Updates the game state for each frame.
     */
    update() {
        if (!this.gameStarted) {
            return;
        }

        // Calculate delta time for consistent updates across different frame rates
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        // Update game time and ball speed
        this.gameTime += deltaTime;
        this.currentBallSpeed = INITIAL_BALL_SPEED * (1 + this.gameTime * BALL_SPEED_INCREASE_RATE);

        // Update game objects
        this.player1.update();
        this.player2.update();
        this.ball.update(this.currentBallSpeed);

        // Ball collision with paddles
        if (this.ball.dx < 0 &&
            this.ball.x - this.ball.radius < this.player1.x + this.player1.width &&
            this.ball.y + this.ball.radius > this.player1.y &&
            this.ball.y - this.ball.radius < this.player1.y + this.player1.height) {
            this.ball.dx *= -1;
            this.ball.x = this.player1.x + this.player1.width + this.ball.radius;
        }

        if (this.ball.dx > 0 &&
            this.ball.x + this.ball.radius > this.player2.x &&
            this.ball.y + this.ball.radius > this.player2.y &&
            this.ball.y - this.ball.radius < this.player2.y + this.player2.height) {
            this.ball.dx *= -1;
            this.ball.x = this.player2.x - this.ball.radius;
        }

        // Scoring
        if (this.ball.x - this.ball.radius < 0) {
            this.player2.score++;
            this.ball.reset();
            this.gameStarted = false;
            this.gameTime = 0;
            this.currentBallSpeed = INITIAL_BALL_SPEED;
        }

        if (this.ball.x + this.ball.radius > GAME_WIDTH) {
            this.player1.score++;
            this.ball.reset();
            this.gameStarted = false;
            this.gameTime = 0;
            this.currentBallSpeed = INITIAL_BALL_SPEED;
        }
    }

    /**
     * Draws the game elements on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // Draw paddles and ball
        this.player1.draw(this.ctx, '#63b3ed');
        this.player2.draw(this.ctx, '#fc8181');
        this.ball.draw(this.ctx);

        // Update score, time, and speed displays
        this.player1ScoreDisplay.textContent = this.player1.score;
        this.player2ScoreDisplay.textContent = this.player2.score;
        this.gameTimeDisplay.textContent = this.gameTime.toFixed(1);
        this.ballSpeedDisplay.textContent = this.currentBallSpeed.toFixed(1);

        // Draw "Press Enter to Start" message if the game is not started
        if (!this.gameStarted) {
            this.ctx.fillStyle = '#a0aec0';
            this.ctx.font = '40px "Inter"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press Enter to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
        }
    }

    /**
     * The main game loop.
     */
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}