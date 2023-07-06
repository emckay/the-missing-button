import { ImageSource, Loader, Sound } from "excalibur";
import { mapValues, range } from "lodash";
import { ButtonGameEngine } from "./ButtonGameEngine";
import { adjectives, generateButtonTypes } from "./ButtonType";
import { getButtonResources, roughenSvg } from "./actors/ButtonActor";
import { GameOverScene } from "./scenes/GameOverScene";
import { MainScene } from "./scenes/MainScene";
import { PlayButtonSvg } from "../PlayButtonSvg";

export function initialize(canvasElement: HTMLCanvasElement) {
  return new ButtonGameEngine({ canvasElement, width: 800, height: 600 });
}

export async function start(game: ButtonGameEngine) {
  const buttons = generateButtonTypes();
  const buttonResources = await getButtonResources(buttons);
  game.buttonResources = buttonResources;

  const soundResources: Sound[] = [];
  const clueSounds = mapValues(adjectives, (values, category) => {
    const valueSounds: { [key: string]: Sound[] } = {};
    for (const value of values) {
      valueSounds[value] = [];
      for (let i = 1; i <= 5; i++) {
        const sound = new Sound(
          `/button-assets/sounds/clues/${value}/${i}.mp3`
        );
        valueSounds[value].push(sound);
        soundResources.push(sound);
      }
    }
    return valueSounds;
  });
  game.clueSounds = clueSounds;
  const winnerSounds = range(0, 10).map(
    (i) => new Sound(`/button-assets/sounds/winners/${i}.mp3`)
  );
  game.winnerSounds = winnerSounds;
  const starterSounds = range(0, 10).map(
    (i) => new Sound(`/button-assets/sounds/starters/${i}.mp3`)
  );
  game.starterSounds = starterSounds;

  game.playButtonResource = new ImageSource(
    await roughenSvg(<PlayButtonSvg />)
  );

  const loader = new Loader([
    game.frogResource,
    game.happyFrogResource,
    game.backgroundImageResource,
    game.playButtonResource,
    ...buttonResources,
    ...soundResources,
    ...winnerSounds,
    ...starterSounds,
  ]);
  game.unit = game.canvasHeight / 100 / window.devicePixelRatio;

  await game.start(loader);

  const mainScene = new MainScene();
  const gameOverScene = new GameOverScene();
  game.addScene("main", mainScene);
  // game.goToScene("main");
  game.addScene("gameOver", gameOverScene);
  game.goToScene("gameOver");
  //@ts-ignore
  window.game = game;
}
