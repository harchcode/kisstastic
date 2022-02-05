import * as PIXI from "pixi.js";
import { textures } from "../assets";
import { APP_H } from "../constants";

export class Player {
  sprite = PIXI.Sprite.from(textures.sample);
  direction = -1;
  velocity = 0;
  acceleration = 7500;
  maxSpeed = 2000;

  constructor() {
    const { sprite } = this;

    sprite.width = 240;
    sprite.height = 160;
    sprite.x = 4;
    sprite.y = APP_H * 0.5 - sprite.height * 0.5;
  }

  update = (dt: number) => {
    const { direction, acceleration, maxSpeed, sprite } = this;

    this.velocity += direction * acceleration * dt;

    if (this.velocity < -maxSpeed) this.velocity = -maxSpeed;
    else if (this.velocity > maxSpeed) this.velocity = maxSpeed;

    sprite.y += this.velocity * dt;

    if (sprite.y <= 0) {
      this.velocity = 0;
      sprite.y = 0;
    } else if (sprite.y >= APP_H - sprite.height) {
      this.velocity = 0;
      sprite.y = APP_H - sprite.height;
    }
  };

  changeDirection = () => {
    this.direction *= -1;
  };
}
