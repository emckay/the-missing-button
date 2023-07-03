import {
  Actor,
  Engine,
  Loader,
  ImageSource,
  Sprite,
  vec,
  Vector,
  Color,
  CircleCollider,
  Shape,
  Collider,
} from "excalibur";
import ReactDomServer from "react-dom/server";
import * as chroma from "chroma.ts";
import { ButtonSvg, ButtonSvgProps } from "./ButtonSvg";
import { Svg2Roughjs } from "svg2roughjs";
import { random, range, sample, sampleSize } from "lodash";

export function initialize(canvasElement: HTMLCanvasElement) {
  return new ButtonGameEngine({ canvasElement, width: 800, height: 600 });
}

const adjectives = {
  color: ["red", "black", "blue"] as const,
  size: ["small", "large"] as const,
  holes: ["two", "four"] as const,
  shape: ["square", "round"] as const,
};

type ButtonColor = (typeof adjectives.color)[number];
type ButtonSize = (typeof adjectives.size)[number];
type ButtonHoles = (typeof adjectives.holes)[number];
type ButtonShape = (typeof adjectives.shape)[number];

type ButtonType = {
  color: ButtonColor;
  size: ButtonSize;
  holes: ButtonHoles;
  shape: ButtonShape;
};

export class ButtonGameEngine extends Engine {
  public buttonBeingDragged: ButtonActor | null = null;
  public buttonDragOffset: Vector | null = null;
}

function cartesianProduct(...arrays: any[]) {
  return arrays.reduce(
    (a, b) => {
      return a
        .map((x: any) => {
          return b.map((y: any) => {
            return x.concat([y]);
          });
        })
        .flat();
    },
    [[]]
  );
}

function generateButtonTypes(): ButtonType[] {
  const keys = Object.keys(adjectives) as Array<keyof typeof adjectives>;
  const values = keys.map((key) => adjectives[key]);
  const combinations = cartesianProduct(...values);

  return combinations.map((combination: any) => {
    return combination.reduce(
      (obj: Partial<ButtonType>, value: any, index: any) => {
        obj[keys[index]] = value;
        return obj as ButtonType;
      },
      {}
    );
  });
}

const getSvgString = async (button: ButtonType) => {
  const props: ButtonSvgProps = {
    rimColor: chroma.color(button.color).darker().hex(),
    baseColor: button.color,
    rimWidth: 10,
    holes: button.holes,
    shape: button.shape,
  };
  const origSvgString = ReactDomServer.renderToStaticMarkup(
    <ButtonSvg {...props} />
  );
  const input = document.createElement("div");
  input.innerHTML = origSvgString;
  const output = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svg2roughjs = new Svg2Roughjs(output, undefined, {
    bowing: 3,
    roughness: 1.4,
    fillStyle: "hachure",
    fixedDecimalPlaceDigits: 3,
    seed: 1,
  });
  svg2roughjs.svg = input.children[0] as SVGSVGElement;
  await svg2roughjs.sketch();
  const svgString = output.outerHTML;
  const svgUrl = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
  return svgUrl;
};

class ButtonActor extends Actor {
  public button: ButtonType;
  constructor(button: ButtonType, collider: Collider) {
    super({ collider });
    this.button = button;
  }
}

const getButtonActor = (
  button: ButtonType,
  image: ImageSource,
  unit: number,
  game: ButtonGameEngine
) => {
  const size = unit * 10 * (button.size === "large" ? 1.75 : 1);
  const sprite = new Sprite({
    image,
    destSize: { width: size, height: size },
  });
  const collider =
    button.shape === "round"
      ? new CircleCollider({ radius: size })
      : Shape.Box(size, size);
  const actor = new ButtonActor(button, collider);
  actor.on("collisionstart", (e) => {
    if (e.other.name !== "frog") {
      return;
    }
    const self = e.target;
    console.log("thats not my button");
    self.actions.moveTo(e.target.pos, 1);
    self.actions.scaleTo(vec(0, 0), vec(1, 1));
    game.buttonBeingDragged = null;
    game.buttonDragOffset = null;
  });
  actor.graphics.add(sprite);
  return actor;
};

export async function start(game: ButtonGameEngine) {
  const buttons = generateButtonTypes();

  const resources = await Promise.all(
    buttons.map(async (b) => new ImageSource(await getSvgString(b)))
  );
  const frogResource = new ImageSource("/images/buttons/frog-sad.png");
  const loader = new Loader([frogResource, ...resources]);

  await game.start(loader);

  const unit = game.canvasHeight / 100 / window.devicePixelRatio;
  const actors = sampleSize(range(0, buttons.length), 5).map((i) => {
    return getButtonActor(buttons[i], resources[i], unit, game);
  });

  const frogHeight = unit * 40;
  const frogWidth = (frogHeight / 757) * 551;
  const frogActor = new Actor({
    x: game.canvasWidth / game.pixelRatio - frogWidth / game.pixelRatio,
    y: game.canvasHeight / game.pixelRatio - frogHeight / 2,
    width: frogWidth,
    height: frogHeight,
    name: "frog",
  });
  frogActor.graphics.add(
    new Sprite({
      image: frogResource,
      destSize: {
        width: frogWidth,
        height: unit * 40,
      },
    })
  );
  game.add(frogActor);

  for (const actor of actors) {
    actor.pos.x = random(
      unit * 5,
      (game.canvasWidth - frogWidth * 1.1) / game.pixelRatio - unit * 5
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
