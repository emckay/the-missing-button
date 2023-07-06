import {
  Actor,
  BaseAlign,
  Color,
  Font,
  FontUnit,
  Label,
  Rectangle,
  Scene,
  Text,
  TextAlign,
  vec,
} from "excalibur";
import { adjectives, cluesToLabelTexts } from "../ButtonType";
import { difference, max, sumBy } from "lodash";
import { ButtonGameEngine } from "../ButtonGameEngine";

const labelFontSettings = () => ({
  color: new Color(0, 0, 0),
  font: new Font({
    family: "__abcursive_713e5c",
    size: 48,
    unit: FontUnit.Px,
    baseAlign: BaseAlign.Top,
    textAlign: TextAlign.Left,
  }),
});
export const ClueLabelActorHeight =
  max(
    Object.values(adjectives)
      .flat(2)
      .map((label) => {
        const textGfx = new Text({
          text: label,
          ...labelFontSettings(),
        });
        return textGfx.height;
      })
  )! * 0.8;

export class ClueLabelActor extends Actor {
  public renderWidth;
  public text;

  constructor(text: string) {
    super({
      color: new Color(255, 255, 255),
      anchor: vec(0.0, 0.0),
      name: "clueLabel",
    });
    this.text = text;
    const textGfx = new Text({
      text: text,
      ...labelFontSettings(),
    });
    const rectangle = new Rectangle({
      width: textGfx.width,
      height: ClueLabelActorHeight,
      color: Color.White,
    });
    this.renderWidth = rectangle.width;
    this.graphics.add(rectangle);
    this.graphics.add(textGfx);
  }
}

export const syncLabelsToClues = (
  game: ButtonGameEngine,
  currentScene: Scene,
  animate: boolean = true,
  labelsTop: number
) => {
  const clueLabels = cluesToLabelTexts(game.clues);
  const startingClueLabelActors = currentScene.actors.filter(
    (a) => a.name === "clueLabel"
  ) as ClueLabelActor[];
  const labelsToAdd = difference(
    clueLabels,
    startingClueLabelActors.map((a) => a.text)
  );
  const labelsToRemove = difference(
    startingClueLabelActors.map((a) => a.text),
    clueLabels
  );

  for (const l of labelsToRemove) {
    const toKill = currentScene.actors.filter(
      (a) => a instanceof ClueLabelActor && a.text === l
    );
    for (const a of toKill) {
      a.kill();
    }
  }

  for (const l of labelsToAdd) {
    const actor = new ClueLabelActor(l);
    actor.pos = vec(0, -ClueLabelActorHeight);
    actor.z = -1;
    currentScene.add(actor);
  }

  // Position the labels correctly.
  const clueLabelActors = currentScene.actors.filter(
    (a) => a.name === "clueLabel"
  ) as ClueLabelActor[];
  const padding = game.unit;
  const totalWidth =
    sumBy(clueLabelActors, (a) => a.renderWidth) +
    padding * (clueLabelActors.length - 1);
  let nextLeft = game.canvasWidth / game.pixelRatio / 2 - totalWidth / 2;
  for (let i = 0; i < clueLabels.length; i++) {
    const actor = clueLabelActors.find((a) => a.text === clueLabels[i])!;
    if (labelsToAdd.find((l) => l === clueLabels[i])) {
      actor.pos.x = nextLeft;
    }
    if (animate) {
      actor.actions.moveTo(vec(nextLeft, labelsTop), 200);
    } else {
      actor.pos = vec(nextLeft, labelsTop);
    }
    nextLeft += padding + actor.renderWidth;
  }
};
