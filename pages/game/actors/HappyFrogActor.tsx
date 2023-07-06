import { Actor } from "excalibur";
import { ButtonGameEngine } from "../ButtonGameEngine";

export class HappyFrogActor extends Actor {
  constructor(game: ButtonGameEngine, unit: number) {
    const frogHeight = unit * 60;
    const frogWidth = (frogHeight * 526) / 868;
    super({
      x: game.halfCanvasWidth / game.pixelRatio,
      y: game.halfCanvasHeight / game.pixelRatio,
      width: frogWidth,
      height: frogHeight,
      name: "happy-frog",
    });
  }
}
