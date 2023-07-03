import { RefObject, useEffect, useRef } from "react";
import { useApplePencilCanvas } from "./useApplePencilCanvas";

export const TracingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useApplePencilCanvas(canvasRef);
  return <canvas ref={canvasRef} />;
};
