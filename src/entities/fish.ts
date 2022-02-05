import * as PIXI from "pixi.js";
import { textures } from "../assets";
import { APP_H, APP_W } from "../constants";
import { getRandomIntInclusive } from "../utils/math";

const SPEED = 1000;

export class Fish {
  sprite = PIXI.Sprite.from(textures.sample);
  isKissed = false;

  constructor() {
    const { sprite } = this;

    sprite.width = 240;
    sprite.height = 160;
    sprite.scale.x = -1;
  }

  reset = (offDT: number) => {
    const { sprite } = this;

    sprite.x = APP_W + sprite.width + 100 - SPEED * offDT;
    sprite.y = getRandomIntInclusive(0, APP_H - sprite.height);
    sprite.alpha = 1;

    this.isKissed = false;
  };

  hide = () => {
    this.sprite.alpha = 0;
  };

  show = () => {
    this.sprite.alpha = 1;
  };

  isOut = () => {
    return this.sprite.x < -100;
  };

  setKissed = () => {
    this.isKissed = true;
    this.sprite.alpha = 0.5;
  };

  update = (dt: number) => {
    this.sprite.x -= SPEED * dt;
  };
}
