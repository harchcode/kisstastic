import * as PIXI from "pixi.js";
import { textures } from "../assets";
import { APP_H, APP_W, FISH_COLORS } from "../constants";
import { getRandomIntInclusive } from "../utils/math";

export enum FishType {
  Wow,
  Ouch
}

export class Fish {
  sprite = new PIXI.Container();
  body = PIXI.Sprite.from(textures.body);
  wow = PIXI.Sprite.from(textures.wow);
  ouch = PIXI.Sprite.from(textures.ouch);
  isKissed = false;
  type = FishType.Wow;
  speed = 1000;

  constructor() {
    const { sprite } = this;

    this.body.scale.x = -1;
    const eye = PIXI.Sprite.from(textures.eye);
    eye.scale.x = -1;

    this.wow.scale.x = -1;
    this.ouch.scale.x = -1;

    this.sprite.addChild(this.body);
    this.sprite.addChild(eye);
    this.sprite.addChild(this.wow);
    this.sprite.addChild(this.ouch);

    sprite.width = 240;
    sprite.height = 160;
  }

  reset = (offDT: number, type = FishType.Wow) => {
    const { sprite } = this;

    this.speed =
      type === FishType.Wow ? 1000 : getRandomIntInclusive(500, 1500);

    sprite.x = APP_W + sprite.width + 100 - this.speed * offDT;
    sprite.y = getRandomIntInclusive(0, APP_H - sprite.height);
    sprite.alpha = 1;
    this.type = type;

    this.body.tint =
      FISH_COLORS[getRandomIntInclusive(1, FISH_COLORS.length - 1)];

    this.wow.alpha = type === FishType.Wow ? 1 : 0;
    this.ouch.alpha = type === FishType.Ouch ? 1 : 0;

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
    this.sprite.x -= this.speed * dt;
  };
}
