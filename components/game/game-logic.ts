import { Actor, Engine, Loader, ImageSource, DisplayMode } from "excalibur";

export function initialize(canvasElement: HTMLCanvasElement) {
  return new Engine({
    canvasElement,
    width: 1200,
    height: 1200,
    displayMode: DisplayMode.Fixed,
    viewport: { height: 1200, width: 1200 },
  });
}

export async function start(game: Engine) {
  const resources = {
    sword: new ImageSource("/images/sword.png"),
  };
  const loader = new Loader([resources.sword]);

  await game.start(loader);

  const swordSprite = resources.sword.toSprite();
  console.log("game", game);
  console.log({
    x: game.halfCanvasWidth,
    y: game.halfCanvasHeight,
  });
  const sword = new Actor({
    x: game.halfCanvasWidth / 2,
    y: game.halfCanvasHeight / 2,
  });
  console.log("sword", sword);
  sword.graphics.add(swordSprite);
  game.add(sword);
}
