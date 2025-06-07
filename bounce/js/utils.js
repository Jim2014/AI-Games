// utils.js
// This module provides a collection of general utility functions.

import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

/**
 * Sets the canvas dimensions and makes it responsive to window resizing while maintaining its aspect ratio.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 */
export function setCanvasDimensions(canvas) {
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