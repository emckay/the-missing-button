import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface Point {
  x: number;
  y: number;
  lineWidth: number;
}

type Stroke = Point[];

// declare global {
//   interface Window {
//     requestIdleCallback: (callback: () => void) => void;
//   }
// }
// const requestIdleCallback = window.requestIdleCallback || function (callback: () => void) { setTimeout(callback, 1) };

export const useApplePencilCanvas = (
  canvasRef: RefObject<HTMLCanvasElement | null>
) => {
  const lineWidth = useRef<number>(0);
  const isMouseDown = useRef<boolean>(false);
  const points = useRef<Stroke>([]);

  const strokeHistory = useRef<Stroke[]>([]);

  const drawOnCanvas = useCallback(
    (stroke: Stroke) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d")!;
      context.strokeStyle = "black";
      context.lineCap = "round";
      context.lineJoin = "round";

      const l = stroke.length - 1;
      if (stroke.length >= 3) {
        const xc = (stroke[l].x + stroke[l - 1].x) / 2;
        const yc = (stroke[l].y + stroke[l - 1].y) / 2;
        context.lineWidth = stroke[l - 1].lineWidth;
        context.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc);
        context.stroke();
        context.beginPath();
        context.moveTo(xc, yc);
      } else {
        const point = stroke[l];
        context.lineWidth = point.lineWidth;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.stroke();
      }
    },
    [canvasRef.current]
  );

  const undoDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d")!;
    strokeHistory.current.pop();
    context.clearRect(0, 0, canvas.width, canvas.height);

    strokeHistory.current.map(function (stroke) {
      if (strokeHistory.current.length === 0) return;

      context.beginPath();

      let strokePath: Stroke = [];
      stroke.map(function (point) {
        strokePath.push(point);
        drawOnCanvas(strokePath);
      });
    });
  }, [canvasRef, drawOnCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d")!;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = window.innerWidth + "px"; // reset width and height to match the original size
    canvas.style.height = window.innerHeight + "px";

    const listeners: [
      keyof HTMLElementEventMap,
      (e: TouchEvent | MouseEvent) => any
    ][] = [];
    for (const ev of [
      "touchstart",
      "mousedown",
    ] as (keyof HTMLElementEventMap)[]) {
      const listener = (e: TouchEvent | MouseEvent) => {
        let pressure = 0.1;
        let x, y;
        if (
          (e as TouchEvent).touches &&
          (e as TouchEvent).touches[0] &&
          typeof (e as TouchEvent).touches[0]["force"] !== "undefined"
        ) {
          if ((e as TouchEvent).touches[0]["force"] > 0) {
            pressure = (e as TouchEvent).touches[0]["force"];
          }
          x = (e as TouchEvent).touches[0].pageX * window.devicePixelRatio;
          y = (e as TouchEvent).touches[0].pageY * window.devicePixelRatio;
        } else {
          pressure = 1.0;

          x = (e as MouseEvent).pageX * window.devicePixelRatio;
          y = (e as MouseEvent).pageY * window.devicePixelRatio;
        }

        isMouseDown.current = true;

        lineWidth.current = Math.log(pressure + 1) * 40;
        context.lineWidth = lineWidth.current; // pressure * 50;

        points.current.push({ x, y, lineWidth: lineWidth.current });
        drawOnCanvas(points.current);
      };
      // @ts-ignore
      canvas.addEventListener(ev, listener);
      listeners.push([ev, listener]);
    }

    for (const ev of [
      "touchmove",
      "mousemove",
    ] as (keyof HTMLElementEventMap)[]) {
      const listener = (e: TouchEvent | MouseEvent) => {
        if (!isMouseDown.current) return;
        e.preventDefault();

        let pressure = 0.1;
        let x, y;
        if (
          (e as TouchEvent).touches &&
          (e as TouchEvent).touches[0] &&
          typeof (e as TouchEvent).touches[0]["force"] !== "undefined"
        ) {
          if ((e as TouchEvent).touches[0]["force"] > 0) {
            pressure = (e as TouchEvent).touches[0]["force"];
          }
          x = (e as TouchEvent).touches[0].pageX * 2;
          y = (e as TouchEvent).touches[0].pageY * 2;
        } else {
          pressure = 1.0;
          x = (e as MouseEvent).pageX * 2;
          y = (e as MouseEvent).pageY * 2;
        }

        lineWidth.current =
          Math.log(pressure + 1) * 40 * 0.2 + lineWidth.current * 0.8;
        points.current.push({ x, y, lineWidth: lineWidth.current });

        drawOnCanvas(points.current);
      };
      // @ts-ignore
      canvas.addEventListener(ev, listener);
      listeners.push([ev, listener]);
    }

    for (const ev of [
      "touchend",
      "touchleave",
      "mouseup",
    ] as (keyof HTMLElementEventMap)[]) {
      const listener = function (e: TouchEvent | MouseEvent) {
        let pressure = 0.1;
        let x, y;

        if (
          (e as TouchEvent).touches &&
          (e as TouchEvent).touches[0] &&
          typeof (e as TouchEvent).touches[0]["force"] !== "undefined"
        ) {
          if ((e as TouchEvent).touches[0]["force"] > 0) {
            pressure = (e as TouchEvent).touches[0]["force"];
          }
          x = (e as TouchEvent).touches[0].pageX * 2;
          y = (e as TouchEvent).touches[0].pageY * 2;
        } else {
          pressure = 1.0;
          x = (e as MouseEvent).pageX * 2;
          y = (e as MouseEvent).pageY * 2;
        }

        isMouseDown.current = false;

        requestIdleCallback(function () {
          strokeHistory.current.push([...points.current]);
          points.current = [];
        });

        lineWidth.current = 0;
      };
      // @ts-ignore
      canvas.addEventListener(ev, listener);
      listeners.push([ev, listener]);
    }
    return () => {
      // @ts-ignore
      listeners.forEach(([ev, fn]) => canvas.removeEventListener(ev, fn));
    };
  }, [canvasRef]);

  return [undoDraw];
};
