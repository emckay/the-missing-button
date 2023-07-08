import React, { useRef, useEffect } from "react";
import { ButtonGameEngine } from "./game/ButtonGameEngine";
import { Flex, Text } from "@chakra-ui/react";

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
  const isGameStarting = useRef<boolean>(false);

  const resetGame = () => {
    if (gameRef.current) {
      gameRef.current.stop();
    }
    cleanUpPlayButtons();
  };

  useEffect(() => {
    // HMR support
    resetGame();
    if (!isGameStarting.current) {
      isGameStarting.current = true;
      import("./game/button-game").then(({ initialize, start }) => {
        isGameStarting.current = false;
        gameRef.current = initialize(canvasRef.current!);
        start(gameRef.current);
      });
    }

    return resetGame;
  }, []);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      __css={{ touchAction: "manipulation", userSelect: "none" }}
    >
      <canvas ref={canvasRef}></canvas>
    </Flex>
  );
};
