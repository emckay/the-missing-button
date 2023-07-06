import {
  Actor,
  Color,
  ImageSource,
  Scene,
  SceneActivationContext,
  Sprite,
  vec,
} from "excalibur";
import { HappyFrogActor } from "../actors/HappyFrogActor";
import { ButtonGameEngine } from "../ButtonGameEngine";
import { BackgroundImageActor } from "../actors/BackgroundImageActor";
import {
  ClueLabelActor,
  ClueLabelActorHeight,
  syncLabelsToClues,
} from "../actors/ClueLabelActor";
import { ButtonType, doButtonsMatch } from "../ButtonType";
import { ButtonActor, getButtonActor } from "../actors/ButtonActor";
import { findIndex, max, min } from "lodash";

export class GameOverScene extends Scene {
  syncLabelsToClues(game: ButtonGameEngine, animate: boolean = true) {
    syncLabelsToClues(game, this, animate, game.unit * 85);
  }

  onInitialize(game: ButtonGameEngine) {
    const unit = game.unit;
    const happyFrog = new HappyFrogActor(game, unit);
    happyFrog.graphics.add(
      new Sprite({
        image: game.happyFrogResource,
        destSize: {
          width: happyFrog.width,
          height: happyFrog.height,
        },
      })
    );
    happyFrog.on("pointerdown", () => {
      game.goToScene("main");
    });
    const bg = new BackgroundImageActor(game);
    this.add(happyFrog);
    this.add(bg);
  }

  onActivate(ctx: SceneActivationContext<{ button: ButtonType }>): void {
    const game = ctx.engine as ButtonGameEngine;
    this.syncLabelsToClues(game, false);
    const button = ctx.data?.button;
    if (button) {
      const i = findIndex(game.buttons, (b) => doButtonsMatch(b, button));
      const buttonActors = [0, 1].map(() =>
        getButtonActor(
          game.buttons[i],
          game.buttonResources[i],
          game.unit,
          game
        )
      );
      const clueLabels = this.actors.filter(
        (a) => a instanceof ClueLabelActor
      ) as ClueLabelActor[];
      if (clueLabels.length === 0) return;
      const y = clueLabels[0]!.pos.y + ClueLabelActorHeight / 2;
      const startX = min(clueLabels.map((cl) => cl.pos.x))! - game.unit * 2;
      const endX =
        max(clueLabels.map((cl) => cl.pos.x + cl.renderWidth))! + game.unit * 2;
      buttonActors[0].anchor = vec(1, 0.5);
      buttonActors[0].pos = vec(startX, y);
      buttonActors[1].anchor = vec(0, 0.5);
      buttonActors[1].pos = vec(endX, y);
      this.add(buttonActors[0]);
      this.add(buttonActors[1]);
    }
  }

  onDeactivate(_context: SceneActivationContext<undefined>): void {
    this.actors
      .filter((a) => a instanceof ClueLabelActor || a instanceof ButtonActor)
      .forEach((a) => a.kill());
  }
}
