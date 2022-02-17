import * as PIXI from "pixi.js";
import { Scene } from "../types";
import {
  addInputListener,
  changeScene,
  hideUI,
  removeInputListener,
  showUI
} from "../game";
import { TitleScene } from "./title";
import { sounds } from "../assets";

export class AudioPermissionScene implements Scene {
  container = new PIXI.Container();
  audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  handleClick = () => {
    this.audioContext.resume();

    sounds.bg.loop = true;
    sounds.bg.play();

    changeScene(new TitleScene());
  };

  start = () => {
    // check if context is in suspended state (autoplay policy)
    if (this.audioContext.state === "suspended") {
      showUI("audioPermission");
      addInputListener(this.handleClick);
    } else {
      this.handleClick();
    }
  };

  end = () => {
    hideUI("audioPermission");
    removeInputListener(this.handleClick);
  };
}
