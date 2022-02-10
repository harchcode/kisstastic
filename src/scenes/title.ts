import * as PIXI from "pixi.js";
import { Scene } from "../types";
import { textures } from "../assets";
import { APP_H, APP_W, FISH_COLORS } from "../constants";
import {
  addInputListener,
  changeScene,
  hideUI,
  removeInputListener,
  showUI
} from "../game";
import { PlayScene } from "./play";

const ROTATE_TIME = 0.2;
export class TitleScene implements Scene {
  container = new PIXI.Container();
  sprite = new PIXI.Container();
  elapsed = 0;

  handleClick = () => {
    changeScene(new PlayScene());
  };

  start = () => {
    const { container, sprite } = this;

    const body = PIXI.Sprite.from(textures.body);
    body.tint = FISH_COLORS[0];
    const eye = PIXI.Sprite.from(textures.eye);
    const lip = PIXI.Sprite.from(textures.wow);

    sprite.addChild(body);
    sprite.addChild(eye);
    sprite.addChild(lip);

    sprite.pivot.set(sprite.width / 2, sprite.height / 2);

    sprite.x = APP_W / 2;
    sprite.y = APP_H / 2;
    sprite.rotation = (15 * Math.PI) / 180;

    container.addChild(sprite);
    showUI("title");

    addInputListener(this.handleClick);
  };

  update = (dt: number) => {
    this.elapsed += dt;

    if (this.elapsed >= ROTATE_TIME) {
      this.elapsed -= ROTATE_TIME;
      this.sprite.rotation *= -1;
    }
  };

  end = () => {
    hideUI("title");
    removeInputListener(this.handleClick);
  };
}
