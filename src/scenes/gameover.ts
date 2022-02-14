import * as PIXI from "pixi.js";
import { Scene } from "../types";
import {
  addInputListener,
  changeScene,
  hideUI,
  removeInputListener,
  showUI
} from "../game";
import { PlayScene } from "./play";
import { getHighscore, getScore, updateHighscore } from "../utils/score";

const currentScoreSpan = document.getElementById(
  "current-score"
) as HTMLSpanElement;

export class GameoverScene implements Scene {
  container: PIXI.Container;

  constructor(container: PIXI.Container) {
    this.container = container;
  }

  handleClick = () => {
    changeScene(new PlayScene());
  };

  start = () => {
    const cs = getScore();
    const hs = getHighscore();

    if (cs > hs) {
      currentScoreSpan.textContent = `${cs} (new best score!)`;
      updateHighscore(cs);
    } else {
      currentScoreSpan.textContent = cs.toString();
    }

    showUI("gameover");
    addInputListener(this.handleClick);
  };

  end = () => {
    hideUI("gameover");
    removeInputListener(this.handleClick);
  };
}
