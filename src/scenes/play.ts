import * as PIXI from "pixi.js";
import { Scene } from "../types";
import {
  addInputListener,
  changeScene,
  hideUI,
  removeInputListener,
  showUI
} from "../game";
import { Pool } from "../utils/pool";
import { addScore, setScore } from "../utils/score";
import { Fish, FishType } from "../entities/fish";
import { Player } from "../entities/player";
import { getRandomArbitrary, getRandomIntInclusive } from "../utils/math";
import { APP_H, APP_W } from "../constants";
import { GameoverScene } from "./gameover";
import { sounds } from "../assets";

const SPAWN_ON_TIME = 1.0;

export class PlayScene implements Scene {
  player = new Player();
  fishes: Pool<Fish>;
  bubbles: Pool<PIXI.Graphics>;
  container = new PIXI.Container();
  goodTimer = 0;
  badTimer = 0;
  bubbleTimer = 0;
  badNextSpawnTime = getRandomArbitrary(0.2, 2.0);
  bubbleNextSpawnTime = getRandomArbitrary(0.1, 0.5);
  streak = 0;
  started = false;
  jumpSound = sounds["jump"];
  deadSound = sounds["dead"];
  kissSound = sounds["kiss"];

  createFish = () => {
    const fish = new Fish();
    fish.hide();

    this.container.addChild(fish.sprite);

    return fish;
  };

  createBubble = () => {
    const gr = new PIXI.Graphics();

    gr.beginFill(0x60a5fa);
    gr.drawCircle(1, 1, 1);
    gr.endFill();
    gr.alpha = 0.1;

    gr.visible = false;

    this.container.addChild(gr);

    return gr;
  };

  constructor() {
    this.bubbles = new Pool(this.createBubble, 32);
    this.fishes = new Pool(this.createFish, 32);
  }

  handleClick = () => {
    this.jumpSound.currentTime = 0;
    this.jumpSound.play();

    if (!this.started) {
      this.started = true;
      return;
    }

    this.player.changeDirection();
  };

  spawn = (offDT: number, type = FishType.Wow) => {
    const fish = this.fishes.obtain();
    fish.reset(offDT, type);
  };

  spawnBubble = () => {
    const bubble = this.bubbles.obtain();
    bubble.visible = true;

    const scale = getRandomIntInclusive(10, 30);
    bubble.scale.x = scale;
    bubble.scale.y = scale;

    bubble.x = getRandomIntInclusive(APP_W / 2, APP_W + 100);
    bubble.y = APP_H + 50;
  };

  removeFish = (fish: Fish) => {
    fish.hide();
    this.fishes.free(fish);
  };

  removeBubble = (bubble: PIXI.Graphics) => {
    bubble.visible = false;
    this.bubbles.free(bubble);
  };

  gameOver = () => {
    this.deadSound.play();
    changeScene(new GameoverScene(this.container));
  };

  HIT_THRESHOLD_X = 75;
  HIT_THRESHOLD_Y = 40;

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
          if (fish.type === FishType.Ouch) {
            this.gameOver();
            return;
          }

          this.kissSound.play();
          fish.setKissed();

          this.streak += 1;

          addScore(Math.min(this.streak, 10));
        }
      }
    }

    if (
      pr > fl + this.HIT_THRESHOLD_X &&
      !fish.isKissed &&
      fish.type === FishType.Wow
    ) {
      this.streak = 0;
    }
  };

  start = () => {
    const { container, player } = this;

    container.addChild(player.sprite);

    showUI("play");

    setScore(0);
    addInputListener(this.handleClick);
  };

  update = (dt: number) => {
    if (!this.started) return;

    this.player.update(dt);

    if (
      this.player.sprite.y <= -this.player.sprite.height * 0.5 ||
      this.player.sprite.y >= APP_H - this.player.sprite.height * 0.5
    ) {
      this.gameOver();
      return;
    }

    const fishes = this.fishes.getAll();

    for (const fish of fishes) {
      fish.update(dt);

      if (fish.isOut()) this.removeFish(fish);

      this.checkPlayerCollision(fish);
    }

    const bubbles = this.bubbles.getAll();

    for (const bubble of bubbles) {
      bubble.x -= getRandomIntInclusive(0, 400) * dt;
      bubble.y -= getRandomIntInclusive(500, 800) * dt;

      if (bubble.x < -100 || bubble.y < -100) {
        this.removeBubble(bubble);
      }
    }

    this.goodTimer += dt;

    if (this.goodTimer >= SPAWN_ON_TIME) {
      this.goodTimer -= SPAWN_ON_TIME;
      this.spawn(this.goodTimer);
    }

    this.badTimer += dt;

    if (this.badTimer >= this.badNextSpawnTime) {
      this.badTimer -= this.badNextSpawnTime;
      this.badNextSpawnTime = getRandomArbitrary(0.2, 2.0);

      this.spawn(this.badTimer, FishType.Ouch);
    }

    this.bubbleTimer += dt;

    if (this.bubbleTimer >= this.bubbleNextSpawnTime) {
      this.bubbleTimer -= this.bubbleNextSpawnTime;
      this.bubbleNextSpawnTime = getRandomArbitrary(0.1, 0.5);

      this.spawnBubble();
    }
  };

  end = () => {
    hideUI("play");
    removeInputListener(this.handleClick);
  };
}
