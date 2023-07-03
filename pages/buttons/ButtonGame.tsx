import React, { useRef, useEffect } from "react";
import { ButtonGameEngine } from "./game/ButtonGameEngine";

/**
 * Workaround for https://github.com/excaliburjs/Excalibur/issues/1431
 */
function cleanUpPlayButtons() {
  const playButtons = document.querySelectorAll("#excalibur-play-root");

  playButtons.forEach((playButton) => {
    if (playButton.parentNode) {
      playButton.parentNode.removeChild(playButton);
    }
  });
}

export const ButtonGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<ButtonGameEngine | null>(null);

  const resetGame = () => {
    if (gameRef.current) {
      gameRef.current.stop();
    }
    cleanUpPlayButtons();
  };

  useEffect(() => {
    // HMR support
    resetGame();

    import("./game/button-game").then(({ initialize, start }) => {
      gameRef.current = initialize(canvasRef.current!);
      start(gameRef.current);
    });

    return resetGame;
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};
