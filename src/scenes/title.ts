import * as PIXI from "pixi.js";
import { Scene } from "../types";
import { textures } from "../assets";
import { APP_H, APP_W } from "../constants";
import { addInputListener, changeScene, removeInputListener } from "../game";
import { PlayScene } from "./play";

export class TitleScene implements Scene {
  elapsed = 0.0;
  sprite = PIXI.Sprite.from(textures.sample);
  container = new PIXI.Container();

  handleClick = () => {
    changeScene(new PlayScene());
  };

  start = () => {
    const { container, sprite } = this;

    sprite.pivot.set(sprite.width / 2, sprite.height / 2);
    sprite.x = APP_W / 2;
    sprite.y = APP_H / 2;
    container.addChild(sprite);

    addInputListener(this.handleClick);
  };

  end = () => {
    removeInputListener(this.handleClick);
  };
}
