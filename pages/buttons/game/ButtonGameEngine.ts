import { Engine, Vector } from "excalibur";
import { ButtonActor } from "./actors/ButtonActor";

export class ButtonGameEngine extends Engine {
  public buttonBeingDragged: ButtonActor | null = null;
  public buttonDragOffset: Vector | null = null;
}
