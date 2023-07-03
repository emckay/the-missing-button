import * as chroma from "chroma.ts";
import {
  Actor,
  CircleCollider,
  Collider,
  Color,
  ImageSource,
  Shape,
  Sprite,
  vec,
} from "excalibur";
import { Svg2Roughjs } from "svg2roughjs";
import { ButtonSvg, ButtonSvgProps } from "../../ButtonSvg";
import { ButtonGameEngine } from "../ButtonGameEngine";
import { ButtonType, generateButtonTypes } from "../ButtonType";
import ReactDomServer from "react-dom/server";

export class ButtonActor extends Actor {
  public button: ButtonType;
  constructor(button: ButtonType, collider: Collider) {
    super({ collider, color: new Color(0, 255, 0) });
    this.button = button;
  }
}

export const getButtonActor = (
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
      ? new CircleCollider({ radius: size / 2 })
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

export const getSvgString = async (button: ButtonType) => {
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

export const getButtonResources = async (buttons: ButtonType[]) => {
  const resources = await Promise.all(
    buttons.map(async (b) => new ImageSource(await getSvgString(b)))
  );
  return resources;
};
