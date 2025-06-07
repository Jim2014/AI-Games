import { GAME_WIDTH, GAME_HEIGHT } from './constants.js';

export function setCanvasDimensions(canvas) {
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

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
    resizeCanvas();
}