import { Scene } from "./types";
import * as PIXI from "pixi.js";
import { APP_H, APP_W } from "./constants";
import { TitleScene } from "./scenes/title";
import { loadAssets } from "./assets";

let currentScene: Scene;

const playArea = document.getElementById("play-area") as HTMLDivElement;

const app = new PIXI.Application({
  width: APP_W,
  height: APP_H,
  backgroundAlpha: 0
});

function initPlayArea() {
  const playAspect = 8 / 9;
  const screenAspect = window.innerWidth / window.innerHeight;

  if (screenAspect > playAspect) {
    playArea.style.height = `${window.innerHeight}px`;
    playArea.style.width = `${playAspect * window.innerHeight}px`;
  } else {
    playArea.style.width = `${window.innerWidth}px`;
    playArea.style.height = `${(1 / playAspect) * window.innerWidth}px`;
  }
}

export async function initGame() {
  app.view.className = "w-full h-full";

  await loadAssets();

  playArea.appendChild(app.view);

  window.addEventListener("resize", initPlayArea);

  initPlayArea();

  currentScene = new TitleScene();
  currentScene.start();
  app.stage.addChild(currentScene.container);

  app.ticker.add(() => {
    currentScene.update?.(PIXI.Ticker.shared.deltaMS * 0.001);
  });
}

export function changeScene(newScene: Scene) {
  currentScene.end?.();

  if (currentScene.container !== newScene.container)
    app.stage.removeChild(currentScene.container);

  currentScene = newScene;
  newScene.start();

  app.stage.addChild(newScene.container);
}

const inputMap = new Map<() => void, () => void>();
const SPACE_KEY = "Space";
const ENTER_KEY = "Enter";
const Z_KEY = "KeyZ";

export function addInputListener(fn: () => void) {
  const touchInput = (e: TouchEvent) => {
    e.preventDefault();
    fn();
  };

  const keyInput = (e: KeyboardEvent) => {
    if (e.code === SPACE_KEY || e.code === ENTER_KEY || e.code === Z_KEY) fn();
  };

  window.addEventListener("click", fn);
  playArea.addEventListener("touchend", touchInput);
  window.addEventListener("keydown", keyInput);

  inputMap.set(fn, () => {
    window.removeEventListener("click", fn);
    playArea.removeEventListener("touchend", touchInput);
    window.removeEventListener("keydown", keyInput);
  });
}

export function removeInputListener(fn: () => void) {
  const tmp = inputMap.get(fn);

  tmp?.();

  inputMap.delete(fn);
}
