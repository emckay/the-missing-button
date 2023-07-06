import { Actor, Color, ImageSource, Sprite } from "excalibur";
import { ButtonGameEngine } from "../ButtonGameEngine";

export class FrogActor extends Actor {
  constructor(game: ButtonGameEngine, unit: number) {
    const frogHeight = unit * 40;
    const frogWidth = (frogHeight / 876) * 522;
    super({
      x: game.canvasWidth / game.pixelRatio - frogWidth / game.pixelRatio,
      y: game.canvasHeight / game.pixelRatio - frogHeight / 2,
      width: frogWidth,
      height: frogHeight,
      name: "frog",
    });
  }
}

export const getFrogActor = (
  loadedResource: ImageSource,
  game: ButtonGameEngine,
  unit: number
) => {
  const frogActor = new FrogActor(game, unit);
  frogActor.graphics.add(
    new Sprite({
      image: loadedResource,
      destSize: {
        width: frogActor.width,
        height: frogActor.height,
      },
    })
  );
  return frogActor;
};
