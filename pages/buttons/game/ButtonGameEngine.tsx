import { Engine, ImageSource, Sound, Vector } from "excalibur";
import { sample } from "lodash";
import {
  ButtonType,
  ClueCategory,
  Clues,
  generateButtonTypes,
  getBlankClues,
  getNextClue,
} from "./ButtonType";
import {
  BUTTON_ACTOR_NAME,
  ButtonActor,
  roughenSvg,
} from "./actors/ButtonActor";
import { MainScene } from "./scenes/MainScene";
import { PlayButtonSvg } from "../PlayButtonSvg";

type ClueSounds = { [c in ClueCategory]: { [v: string]: Sound[] } };

export class ButtonGameEngine extends Engine {
  public buttonBeingDragged: ButtonActor | null = null;
  public buttonDragOffset: Vector | null = null;
  public unit: number = 0;

  public frogResource = new ImageSource("/button-assets/images/frog-sad.png");
  public happyFrogResource = new ImageSource(
    "/button-assets/images/frog-happy.png"
  );
  public backgroundImageResource = new ImageSource(
    "/button-assets/images/bg.jpg"
  );
  public playButtonResource: ImageSource | undefined;

  public clues: Clues = getBlankClues();

  public clueSounds: ClueSounds | undefined = undefined;
  public winnerSounds: Sound[] = [];
  public starterSounds: Sound[] = [];

  public buttons: ButtonType[] = generateButtonTypes();
  public usedButtons: ButtonType[] = [];
  public buttonResources: ImageSource[] = [];

  public resetClues() {
    this.clues = getBlankClues();
    this.usedButtons = [];
  }

  public onButtonGuess(guess: ButtonType) {
    const buttonActors = this.currentScene.actors.filter(
      (a) => a.name === BUTTON_ACTOR_NAME
    ) as ButtonActor[];
    const options = buttonActors.map((a) => a.button);
    const res = getNextClue(guess, options, this.clues);
    if (res.isWinner) {
      this.goToScene("gameOver", { button: guess });
      sample(this.winnerSounds)?.play();
      return;
    }

    // Update clues (TODO: add clue text to screen)
    // @ts-ignore
    this.clues[res.clue.category] = res.clue.value;

    (this.currentScene as MainScene).syncLabelsToClues(this);

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
