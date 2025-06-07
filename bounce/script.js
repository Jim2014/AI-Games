// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Get score and game info display elements
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const gameTimeDisplay = document.getElementById('gameTimeDisplay');
const ballSpeedDisplay = document.getElementById('ballSpeedDisplay');

// Game dimensions and elements
const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const INITIAL_BALL_SPEED = 5; // Initial speed of the ball

// Game state variables
let gameStarted = false;
let gameTime = 0; // in seconds
let lastFrameTime = performance.now(); // For tracking time and speed
const BALL_SPEED_INCREASE_RATE = 0.005; // Rate at which ball speed increases per second
let currentBallSpeed = INITIAL_BALL_SPEED; // This will be dynamically updated

// Player 1 paddle object
let player1 = {
    x: 0,
    y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2, // Center vertically
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0, // Vertical movement speed
    score: 0
};

// Player 2 paddle object
let player2 = {
    x: GAME_WIDTH - PADDLE_WIDTH, // Right edge
    y: (GAME_HEIGHT - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0,
    score: 0
};

// Ball object
let ball = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: BALL_RADIUS,
    dx: 0, // Initial horizontal speed (starts at 0, set on Enter)
    dy: 0 // Initial vertical speed (starts at 0, set on Enter)
};

// Object to track pressed keys
let keysPressed = {};

/**
 * Resets the ball's position and direction after a point is scored or game restarts.
 * The ball always starts from the center with no initial movement.
 */
function resetBall() {
    ball.x = GAME_WIDTH / 2;
    ball.y = GAME_HEIGHT / 2;
    ball.dx = 0; // Stop ball
    ball.dy = 0; // Stop ball
    gameStarted = false; // Game is paused until 'Enter' is pressed
    gameTime = 0; // Reset game time
    currentBallSpeed = INITIAL_BALL_SPEED; // Reset ball speed
}

/**
 * Draws the game elements (paddles, ball, scores, info) on the canvas.
 */
function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw player 1 paddle
    ctx.fillStyle = '#63b3ed'; /* Blue */
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

    // Draw player 2 paddle
    ctx.fillStyle = '#fc8181'; /* Red */
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw the ball
    ctx.fillStyle = '#f6e05e'; /* Yellow */
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Update score displays
    player1ScoreDisplay.textContent = player1.score;
    player2ScoreDisplay.textContent = player2.score;

    // Update time and speed displays
    gameTimeDisplay.textContent = gameTime.toFixed(1);
    ballSpeedDisplay.textContent = currentBallSpeed.toFixed(1);

    // Draw "Press Enter to Start" message if game is not started
    if (!gameStarted) {
        ctx.fillStyle = '#a0aec0'; /* Light grey */
        ctx.font = '40px "Inter"';
        ctx.textAlign = 'center';
        ctx.fillText('Press Enter to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }
}

/**
 * Updates the game state, including ball movement, paddle movement, and collision detection.
 */
function update() {
    // Only update game elements if the game has started
    if (!gameStarted) {
        return;
    }

    // Calculate delta time for consistent updates across different frame rates
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000; // time in seconds
    lastFrameTime = currentTime;

    // Update game time
    gameTime += deltaTime;

    // Increase ball speed over time
    currentBallSpeed = INITIAL_BALL_SPEED * (1 + gameTime * BALL_SPEED_INCREASE_RATE);

    // Move paddles based on their dy (movement speed)
    player1.y += player1.dy;
    player2.y += player2.dy;

    // Keep paddles within canvas bounds
    player1.y = Math.max(0, Math.min(player1.y, GAME_HEIGHT - player1.height));
    player2.y = Math.max(0, Math.min(player2.y, GAME_HEIGHT - player2.height));

    // Move the ball, applying the current speed while preserving direction
    ball.x += Math.sign(ball.dx) * currentBallSpeed;
    ball.y += Math.sign(ball.dy) * currentBallSpeed;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > GAME_HEIGHT || ball.y - ball.radius < 0) {
        ball.dy *= -1; // Reverse vertical direction
    }

    // Ball collision with paddles
    // Player 1 paddle collision (left paddle)
    if (ball.dx < 0 && // Ball is moving left
        ball.x - ball.radius < player1.x + player1.width && // Ball's left edge is past paddle's right edge
        ball.y + ball.radius > player1.y && // Ball's bottom edge is below paddle's top edge
        ball.y - ball.radius < player1.y + player1.height) { // Ball's top edge is above paddle's bottom edge
        ball.dx *= -1; // Reverse horizontal direction
        // Adjust ball position to prevent sticking inside the paddle
        ball.x = player1.x + player1.width + ball.radius;
    }

    // Player 2 paddle collision (right paddle)
    if (ball.dx > 0 && // Ball is moving right
        ball.x + ball.radius > player2.x && // Ball's right edge is past paddle's left edge
        ball.y + ball.radius > player2.y && // Ball's bottom edge is below paddle's top edge
        ball.y - ball.radius < player2.y + player2.height) { // Ball's top edge is above paddle's bottom edge
        ball.dx *= -1; // Reverse horizontal direction
        // Adjust ball position to prevent sticking inside the paddle
        ball.x = player2.x - ball.radius;
    }

    // Scoring
    // Ball goes past player 1 (left side) - Player 2 scores
    if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall(); // Reset ball position and game state
    }
    // Ball goes past player 2 (right side) - Player 1 scores
    if (ball.x + ball.radius > GAME_WIDTH) {
        player1.score++;
        resetBall(); // Reset ball position and game state
    }
}

/**
 * The main game loop. Calls update and draw functions repeatedly.
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Request next frame for smooth animation
}

/**
 * Handles key presses for paddle movement and game start.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true; // Mark key as pressed

    // Start game on Enter key press if not already started
    if (event.key === 'Enter' && !gameStarted) {
        gameStarted = true;
        // Give ball random initial direction
        ball.dx = (Math.random() < 0.5 ? 1 : -1) * INITIAL_BALL_SPEED; // Random horizontal direction
        ball.dy = (Math.random() < 0.5 ? 1 : -1) * INITIAL_BALL_SPEED; // Random vertical direction
        lastFrameTime = performance.now(); // Start timing for speed calculation
    }

    // Prevent default browser behavior for specific keys to stop page scrolling
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'w' || event.key === 's') {
        event.preventDefault();
    }
    updatePaddleMovement();
});

/**
 * Handles key releases, stopping paddle movement.
 * @param {KeyboardEvent} event - The keyboard event object.
 */
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key]; // Mark key as released
    updatePaddleMovement();
});

/**
 * Updates paddle's dy (vertical movement speed) based on currently pressed keys.
 */
function updatePaddleMovement() {
    // Player 1 controls (W, S)
    if (keysPressed['w'] || keysPressed['W']) {
        player1.dy = -7;
    } else if (keysPressed['s'] || keysPressed['S']) {
        player1.dy = 7;
    } else {
        player1.dy = 0;
    }

    // Player 2 controls (ArrowUp, ArrowDown)
    if (keysPressed['ArrowUp']) {
        player2.dy = -7;
    } else if (keysPressed['ArrowDown']) {
        player2.dy = 7;
    } else {
        player2.dy = 0;
    }
}

/**
 * Handles touch input for paddle movement.
 * Tapping on the left half controls player 1, right half controls player 2.
 * A tap moves the paddle towards the tap location.
 * @param {TouchEvent} event - The touch event object.
 */
canvas.addEventListener('touchstart', (event) => {
    event.preventDefault(); // Prevent default browser touch behavior (like scrolling)

    if (!gameStarted) { // If game not started, a touch can act like 'Enter'
         gameStarted = true;
         ball.dx = (Math.random() < 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
         ball.dy = (Math.random() < 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
         lastFrameTime = performance.now();
    }

    for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        // Determine if touch is for Player 1 or Player 2 based on horizontal position
        if (touchX < GAME_WIDTH / 2) { // Left half for Player 1
            if (touchY < player1.y + PADDLE_HEIGHT / 2) {
                player1.dy = -7; // Move up
            } else {
                player1.dy = 7; // Move down
            }
        } else { // Right half for Player 2
            if (touchY < player2.y + PADDLE_HEIGHT / 2) {
                player2.dy = -7; // Move up
            } else {
                player2.dy = 7; // Move down
            }
        }
    }
});

/**
 * Stops paddle movement on touch end.
 * @param {TouchEvent} event - The touch event object.
 */
canvas.addEventListener('touchend', (event) => {
    event.preventDefault();
    // Stop movement for paddles if no touches remain
    if (event.touches.length === 0) {
        player1.dy = 0;
        player2.dy = 0;
    }
});

/**
 * Sets the canvas dimensions. The game logic uses fixed GAME_WIDTH and GAME_HEIGHT,
 * but the canvas display size adjusts responsively to fit its container while
 * maintaining the aspect ratio.
 */
function setCanvasDimensions() {
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    // Adjust canvas display size for responsiveness
    const gameArea = canvas.parentElement;
    const aspectRatio = GAME_WIDTH / GAME_HEIGHT;

    function resizeCanvas() {
        let newWidth = gameArea.clientWidth;
        let newHeight = gameArea.clientHeight;

        if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
        } else {
            newHeight = newWidth / aspectRatio;
        }

        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call
}

// Initialize canvas dimensions and start the game loop
window.addEventListener('load', () => {
    setCanvasDimensions();
    resetBall(); // Set initial ball state and pause game
    gameLoop(); // Start the game loop (it will pause until 'Enter' is pressed)
});