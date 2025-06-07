# JavaScript Module Design for Bounce Ball Game

This document outlines the design and functionality of the JavaScript modules used in the Bounce Ball game. The codebase has been refactored into a modular structure to improve organization, readability, and maintainability.

## Module Overview

The JavaScript logic is split into the following modules:

*   **`constants.js`**: Defines all fixed game parameters and configurations.
*   **`paddle.js`**: Manages the state and behavior of individual paddles.
*   **`ball.js`**: Manages the state and behavior of the game ball.
*   **`input.js`**: Handles all user input (keyboard and touch) and translates it into game actions.
*   **`utils.js`**: Contains general utility functions that are not specific to any single game entity.
*   **`game.js`**: Orchestrates the main game loop, manages game state, and handles interactions between game entities.
*   **`script.js`**: The entry point of the application, responsible for initializing the game and starting the main loop.

## Module Details and Functionality

### `constants.js`

This module exports various constant values used throughout the game. This centralizes configuration and makes it easy to adjust game parameters without searching through multiple files.

**Key Constants:**
*   `GAME_WIDTH`, `GAME_HEIGHT`: Dimensions of the game canvas.
*   `PADDLE_WIDTH`, `PADDLE_HEIGHT`: Dimensions of the paddles.
*   `BALL_RADIUS`: Radius of the ball.
*   `INITIAL_BALL_SPEED`: The starting speed of the ball.
*   `BALL_SPEED_INCREASE_RATE`: The rate at which the ball's speed increases over time.
*   `PADDLE_SPEED`: The vertical movement speed of the paddles.

### `paddle.js`

This module defines the `Paddle` class, which represents a single player paddle in the game.

**Class: `Paddle`**
*   **Properties:** `x`, `y` (position), `width`, `height`, `dy` (vertical movement speed), `score`.
*   **Methods:**
    *   `constructor(x)`: Initializes a new paddle at a given X-coordinate.
    *   `update()`: Updates the paddle's vertical position, ensuring it stays within the canvas bounds.
    *   `draw(ctx, color)`: Renders the paddle on the canvas with a specified color.
    *   `moveUp()`, `moveDown()`: Sets the paddle's `dy` to move it up or down.
    *   `stop()`: Sets the paddle's `dy` to 0, stopping its movement.

### `ball.js`

This module defines the `Ball` class, which encapsulates the ball's properties and movement logic.

**Class: `Ball`**
*   **Properties:** `x`, `y` (position), `radius`, `dx`, `dy` (horizontal and vertical movement speeds).
*   **Methods:**
    *   `constructor()`: Initializes the ball at the center of the game area with no initial movement.
    *   `reset()`: Resets the ball to its initial center position and stops its movement.
    *   `start(speed)`: Sets the ball's initial horizontal and vertical direction with a given speed.
    *   `update(currentBallSpeed)`: Updates the ball's position based on its current speed and handles collisions with the top and bottom walls.
    *   `draw(ctx)`: Renders the ball on the canvas.

### `input.js`

This module defines the `InputHandler` class, responsible for capturing and processing user input from keyboard and touch events.

**Class: `InputHandler`**
*   **Properties:** `keysPressed` (object to track active key presses), references to `canvas`, `player1`, `player2`, and `game` objects.
*   **Methods:**
    *   `constructor(canvas, player1, player2, game)`: Sets up event listeners for `keydown`, `keyup`, `touchstart`, and `touchend`.
    *   `handleKeyDown(event)`, `handleKeyUp(event)`: Event handlers for keyboard input, updating `keysPressed` and triggering paddle movement updates. Also handles starting the game on 'Enter' key press.
    *   `updatePaddleMovement()`: Adjusts paddle `dy` based on currently pressed keys.
    *   `handleTouchStart(event)`, `handleTouchEnd(event)`: Event handlers for touch input, allowing players to control paddles by tapping on screen halves. Also handles starting the game on first touch.

### `utils.js`

This module provides a collection of general utility functions.

**Functions:**
*   `setCanvasDimensions(canvas)`: Configures the canvas dimensions to match the `GAME_WIDTH` and `GAME_HEIGHT` constants and makes it responsive to window resizing while maintaining its aspect ratio.

### `game.js`

This module defines the `Game` class, which is the core of the game logic. It manages the overall game state, updates game entities, handles collisions between paddles and the ball, and manages scoring.

**Class: `Game`**
*   **Properties:** References to canvas context (`ctx`), display elements, `player1` (Paddle object), `player2` (Paddle object), `ball` (Ball object), `inputHandler` (InputHandler object), `gameStarted` (boolean), `gameTime`, `lastFrameTime`, `currentBallSpeed`.
*   **Methods:**
    *   `constructor(...)`: Initializes all game entities and state variables.
    *   `resetGame()`: Resets scores, ball position, game time, and speed to initial states.
    *   `startGame()`: Sets `gameStarted` to true and initiates the ball's movement.
    *   `update()`: The main update logic for each frame. It calculates delta time, updates game time, increases ball speed, updates paddles and ball, and handles ball-paddle collisions and scoring.
    *   `draw()`: Renders all game elements on the canvas and updates score, time, and speed displays. Also draws "Press Enter to Start" message when the game is paused.
    *   `gameLoop()`: The main animation loop that continuously calls `update()` and `draw()` using `requestAnimationFrame`.

### `script.js`

This is the main entry point of the application. It imports necessary classes and functions, initializes the canvas and display elements, creates a `Game` instance, and starts the game loop when the window loads.

**Functionality:**
*   Imports `Game` and `setCanvasDimensions`.
*   Gets references to HTML canvas and display elements.
*   Instantiates the `Game` class.
*   Attaches an event listener to `window.onload` to set canvas dimensions, reset the game to its initial state, and start the `gameLoop`.