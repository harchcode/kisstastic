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

export class GameoverScene implements Scene {
  container: PIXI.Container;

  constructor(container: PIXI.Container) {
    this.container = container;
  }

  handleClick = () => {
    changeScene(new PlayScene());
  };

  start = () => {
    showUI("gameover");
    addInputListener(this.handleClick);
  };

  end = () => {
    hideUI("gameover");
    removeInputListener(this.handleClick);
  };
}
