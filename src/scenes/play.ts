import * as PIXI from "pixi.js";
import { Scene } from "../types";
import { addInputListener, removeInputListener } from "../game";
import { Pool } from "../utils/pool";
import { addScore, setScore } from "../utils/score";
import { Fish } from "../entities/fish";
import { Player } from "../entities/player";

const SPAWN_ON_TIME = 1.0;

export class PlayScene implements Scene {
  player = new Player();
  fishes: Pool<Fish>;
  container = new PIXI.Container();
  spawnTimer = 0;
  streak = 0;

  createFish = () => {
    const fish = new Fish();
    fish.hide();

    this.container.addChild(fish.sprite);

    return fish;
  };

  constructor() {
    this.fishes = new Pool(this.createFish, 16);
  }

  handleClick = () => {
    this.player.changeDirection();
  };

  spawn = (offDT: number) => {
    const fish = this.fishes.obtain();
    fish.reset(offDT);
  };

  removeFish = (fish: Fish) => {
    fish.hide();
    this.fishes.free(fish);
  };

  HIT_THRESHOLD_X = 50;
  HIT_THRESHOLD_Y = 100;

  checkPlayerCollision = (fish: Fish) => {
    const { sprite: playerSprite } = this.player;
    const { sprite: fishSprite } = fish;

    const pr = playerSprite.x + playerSprite.width;
    const fl = fishSprite.x - fishSprite.width;
    const pcy = playerSprite.y + playerSprite.height * 0.5;
    const fcy = fishSprite.y + fishSprite.height * 0.5;
    const pb = pcy + this.HIT_THRESHOLD_Y;
    const pt = pcy - this.HIT_THRESHOLD_Y;
    const fb = fcy + this.HIT_THRESHOLD_Y;
    const ft = fcy - this.HIT_THRESHOLD_Y;

    if (pr >= fl && pr <= fl + this.HIT_THRESHOLD_X) {
      if (pb >= ft && pt <= fb) {
        if (!fish.isKissed) {
          fish.setKissed();

          this.streak += 1;

          addScore(Math.min(this.streak, 10));
        }
      } else {
        this.streak = 0;
      }
    }
  };

  start = () => {
    const { container, player } = this;

    container.addChild(player.sprite);

    setScore(0);
    addInputListener(this.handleClick);
  };

  update = (dt: number) => {
    this.player.update(dt);

    const fishes = this.fishes.getAll();

    for (const fish of fishes) {
      fish.update(dt);

      if (fish.isOut()) this.removeFish(fish);

      this.checkPlayerCollision(fish);
    }

    this.spawnTimer += dt;

    if (this.spawnTimer >= SPAWN_ON_TIME) {
      this.spawnTimer -= SPAWN_ON_TIME;
      this.spawn(this.spawnTimer);
    }
  };

  end = () => {
    removeInputListener(this.handleClick);
  };
}
