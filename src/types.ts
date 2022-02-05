import * as PIXI from "pixi.js";

export interface Scene {
  readonly container: PIXI.Container;

  start: () => void;
  update?: (dt: number) => void;
  end?: () => void;
}

export type GameState = {
  currentScene: Scene;
};
