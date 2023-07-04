import {
  Actor,
  BaseAlign,
  Color,
  Engine,
  Font,
  FontUnit,
  Label,
  Sound,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { BUTTON_ACTOR_NAME, ButtonActor } from "./actors/ButtonActor";
import {
  ButtonType,
  ClueCategory,
  Clues,
  adjectives,
  getBlankClues,
  getNextClue,
} from "./ButtonType";
import { sample } from "lodash";

type ClueSounds = { [c in ClueCategory]: { [v: string]: Sound[] } };

export class ButtonGameEngine extends Engine {
  public buttonBeingDragged: ButtonActor | null = null;
  public buttonDragOffset: Vector | null = null;

  public clues: Clues = getBlankClues();

  public clueSounds: ClueSounds | undefined = undefined;
  public winnerSounds: Sound[] = [];

  public resetClues() {
    this.clues = getBlankClues();
  }

  public onButtonGuess(guess: ButtonType) {
    const buttonActors = this.currentScene.actors.filter(
      (a) => a.name === BUTTON_ACTOR_NAME
    ) as ButtonActor[];
    const options = buttonActors.map((a) => a.button);
    const res = getNextClue(guess, options, this.clues);
    if (res.isWinner) {
      console.log("you win!");
      sample(this.winnerSounds)?.play();
      return;
    }

    // Update clues (TODO: add clue text to screen)
    // @ts-ignore
    this.clues[res.clue.category] = res.clue.value;

    const label = new Label({
      text: res.clue.value!,
      color: new Color(0, 0, 0),
      font: new Font({
        family: "__abcursive_713e5c",
        size: 28,
        unit: FontUnit.Px,
        baseAlign: BaseAlign.Top,
        textAlign: TextAlign.Left,
      }),
      anchor: vec(0, 0),
    });
    const background = new Actor({
      width:
        label.graphics.layers.get()[0].graphics[0].graphic.width *
        this.pixelRatio *
        1.2,
      height:
        label.graphics.layers.get()[0].graphics[0].graphic.height *
        this.pixelRatio *
        1.3,
      color: new Color(255, 255, 255),
      pos: vec(100, 100),
      anchor: vec(0.035, 0.07),
    });
    background.addChild(label);
    this.add(background);

    // Play sound.
    if (
      this.clueSounds &&
      res.clue.value &&
      this.clueSounds[res.clue.category][res.clue.value].length > 0
    ) {
      sample(this.clueSounds[res.clue.category][res.clue.value])!.play();
    }
  }
}
