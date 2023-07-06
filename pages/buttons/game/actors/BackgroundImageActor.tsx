import { Actor, Engine, ImageSource, vec } from "excalibur";
import { ButtonGameEngine } from "../ButtonGameEngine";

export class BackgroundImageActor extends Actor {
  constructor(game: ButtonGameEngine) {
    super({
      x: 0,
      y: 0,
      width: game.screen.resolution.width,
      height: game.screen.resolution.height,
    });
    this.z = -99;
    this.graphics.anchor = vec(0, 0);
    const background = game.backgroundImageResource.toSprite();
    background.destSize.width = game.screen.resolution.width;
    background.destSize.height = game.screen.resolution.height;
    this.graphics.use(background);
  }
}
