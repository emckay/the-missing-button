import { ImageSource, Loader, Sound } from "excalibur";
import { mapValues, random, range, sampleSize } from "lodash";
import { ButtonGameEngine } from "./ButtonGameEngine";
import { adjectives, generateButtonTypes } from "./ButtonType";
import { getButtonActor, getButtonResources } from "./actors/ButtonActor";
import { getFrogActor } from "./actors/FrogActor";

export function initialize(canvasElement: HTMLCanvasElement) {
  return new ButtonGameEngine({ canvasElement, width: 800, height: 600 });
}

export async function start(game: ButtonGameEngine) {
  const buttons = generateButtonTypes();
  const frogResource = new ImageSource("/button-assets/images/frog-sad.png");
  const buttonResources = await getButtonResources(buttons);

  const soundResources: Sound[] = [];
  const clueSounds = mapValues(adjectives, (values, category) => {
    const valueSounds: { [key: string]: Sound[] } = {};
    for (const value of values) {
      valueSounds[value] = [];
      for (let i = 1; i <= 5; i++) {
        const sound = new Sound(`/button-assets/sounds/clue/${value}/${i}.mp3`);
        valueSounds[value].push(sound);
        soundResources.push(sound);
      }
    }
    return valueSounds;
  });
  game.clueSounds = clueSounds;
  const winnerSounds = range(0, 10).map(
    (i) => new Sound(`/button-assets/sounds/winners/${i + 1}.mp3`)
  );
  game.winnerSounds = winnerSounds;

  const loader = new Loader([
    frogResource,
    ...buttonResources,
    ...soundResources,
    ...winnerSounds,
  ]);

  await game.start(loader);

  const unit = game.canvasHeight / 100 / window.devicePixelRatio;
  const actors = sampleSize(range(0, buttons.length), 5).map((i) => {
    return getButtonActor(buttons[i], buttonResources[i], unit, game);
  });

  const frogActor = getFrogActor(frogResource, game, unit);
  game.add(frogActor);

  for (const actor of actors) {
    actor.pos.x = random(
      unit * 5,
      (game.canvasWidth - frogActor.width * 1.5) / game.pixelRatio - unit * 5
    );
    actor.pos.y = random(
      unit * 5,
      game.canvasHeight / game.pixelRatio - unit * 5
    );
    game.add(actor);
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
