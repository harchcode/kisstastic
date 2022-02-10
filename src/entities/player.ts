import * as PIXI from "pixi.js";
import { textures } from "../assets";
import { APP_H, FISH_COLORS } from "../constants";

export class Player {
  sprite = new PIXI.Container();
  direction = -1;
  velocity = 0;
  acceleration = 20000;
  maxSpeed = 2000;

  constructor() {
    const body = PIXI.Sprite.from(textures.body);
    body.tint = FISH_COLORS[0];
    const eye = PIXI.Sprite.from(textures.eye);
    const lip = PIXI.Sprite.from(textures.wow);

    this.sprite.addChild(body);
    this.sprite.addChild(eye);
    this.sprite.addChild(lip);

    const { sprite } = this;

    sprite.width = 240;
    sprite.height = 160;
    sprite.x = 32;
    sprite.y = APP_H * 0.5 - sprite.height * 0.5;
  }

  update = (dt: number) => {
    const { direction, acceleration, maxSpeed, sprite } = this;

    this.velocity += direction * acceleration * dt;

    if (this.velocity < -maxSpeed) this.velocity = -maxSpeed;
    else if (this.velocity > maxSpeed) this.velocity = maxSpeed;

    sprite.y += this.velocity * dt;
  };

  changeDirection = () => {
    this.direction *= -1;
  };
}
