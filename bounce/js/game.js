import { Paddle } from './paddle.js';
import { Ball } from './ball.js';
import { InputHandler } from './input.js';
import { GAME_WIDTH, GAME_HEIGHT, INITIAL_BALL_SPEED, BALL_SPEED_INCREASE_RATE } from './constants.js';

export class Game {
    constructor(canvas, ctx, player1ScoreDisplay, player2ScoreDisplay, gameTimeDisplay, ballSpeedDisplay) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.player1ScoreDisplay = player1ScoreDisplay;
        this.player2ScoreDisplay = player2ScoreDisplay;
        this.gameTimeDisplay = gameTimeDisplay;
        this.ballSpeedDisplay = ballSpeedDisplay;

        this.player1 = new Paddle(0);
        this.player2 = new Paddle(GAME_WIDTH - 15); // PADDLE_WIDTH is 15
        this.ball = new Ball();
        this.inputHandler = new InputHandler(canvas, this.player1, this.player2, this);

        this.gameStarted = false;
        this.gameTime = 0;
        this.lastFrameTime = performance.now();
        this.currentBallSpeed = INITIAL_BALL_SPEED;
    }

    resetGame() {
        this.player1.score = 0;
        this.player2.score = 0;
        this.ball.reset();
        this.gameStarted = false;
        this.gameTime = 0;
        this.currentBallSpeed = INITIAL_BALL_SPEED;
        this.draw(); // Draw initial state
    }

    startGame() {
        this.gameStarted = true;
        this.ball.start(INITIAL_BALL_SPEED);
        this.lastFrameTime = performance.now();
    }

    update() {
        if (!this.gameStarted) {
            return;
        }

        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;

        this.gameTime += deltaTime;
        this.currentBallSpeed = INITIAL_BALL_SPEED * (1 + this.gameTime * BALL_SPEED_INCREASE_RATE);

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

    draw() {
        this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.player1.draw(this.ctx, '#63b3ed');
        this.player2.draw(this.ctx, '#fc8181');
        this.ball.draw(this.ctx);

        this.player1ScoreDisplay.textContent = this.player1.score;
        this.player2ScoreDisplay.textContent = this.player2.score;
        this.gameTimeDisplay.textContent = this.gameTime.toFixed(1);
        this.ballSpeedDisplay.textContent = this.currentBallSpeed.toFixed(1);

        if (!this.gameStarted) {
            this.ctx.fillStyle = '#a0aec0';
            this.ctx.font = '40px "Inter"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press Enter to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}