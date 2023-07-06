import {
  Engine,
  ImageSource,
  Scene,
  SceneActivationContext,
  vec,
} from "excalibur";
import { ButtonGameEngine } from "../ButtonGameEngine";
import { getButtonActor } from "../actors/ButtonActor";
import {
  difference,
  differenceBy,
  random,
  range,
  sample,
  sampleSize,
  sumBy,
} from "lodash";
import { getFrogActor } from "../actors/FrogActor";
import { cluesToLabelTexts } from "../ButtonType";
import {
  ClueLabelActor,
  ClueLabelActorHeight,
  syncLabelsToClues,
} from "../actors/ClueLabelActor";
import { BackgroundImageActor } from "../actors/BackgroundImageActor";

export class MainScene extends Scene {
  syncLabelsToClues(game: ButtonGameEngine, animate: boolean = true) {
    syncLabelsToClues(game, this, animate, game.unit * 5);
  }

  onActivate(context: SceneActivationContext): void {
    const game = context.engine as ButtonGameEngine;
    game.resetClues();
    sample(game.starterSounds)?.play();
    this.clear();
    const bg = new BackgroundImageActor(game);
    this.add(bg);
    const unit = game.unit;
    this.syncLabelsToClues(game, false);
    const actors = sampleSize(range(0, game.buttons.length), 5).map((i) => {
      return getButtonActor(
        game.buttons[i],
        game.buttonResources[i],
        unit,
        game
      );
    });

    const frogActor = getFrogActor(game.frogResource, game, unit);
    this.add(frogActor);

    for (const actor of actors) {
      actor.pos.x = random(
        unit * 5,
        (game.canvasWidth - frogActor.width * 1.5) / game.pixelRatio - unit * 20
      );
      actor.pos.y = random(
        unit * 5,
        game.canvasHeight / game.pixelRatio - unit * 20
      );
      this.add(actor);
      actor.on("pointerdown", (ev) => {
        actor.z = 10;
        game.buttonBeingDragged = actor;
        game.buttonDragOffset = actor.pos.sub(ev.worldPos);
      });
    }

    game.input.pointers.on("move", (ev) => {
      if (game.buttonBeingDragged && game.buttonDragOffset) {
        game.buttonBeingDragged.pos = ev.worldPos.add(game.buttonDragOffset);
      }
    });

    game.input.pointers.on("up", () => {
      if (game.buttonBeingDragged) game.buttonBeingDragged.z = 0;
      game.buttonBeingDragged = null;
      game.buttonDragOffset = null;
    });
  }

  public onDeactivate(ctx: SceneActivationContext) {
    const game = ctx.engine;
    this.actors.forEach((a) => a.kill());
    game.input.pointers.clear();
  }
}
