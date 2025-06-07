import { Game } from './game.js';
import { setCanvasDimensions } from './utils.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const gameTimeDisplay = document.getElementById('gameTimeDisplay');
const ballSpeedDisplay = document.getElementById('ballSpeedDisplay');

const game = new Game(canvas, ctx, player1ScoreDisplay, player2ScoreDisplay, gameTimeDisplay, ballSpeedDisplay);

window.addEventListener('load', () => {
    setCanvasDimensions(canvas);
    game.resetGame();
    game.gameLoop();
});