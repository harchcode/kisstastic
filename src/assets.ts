import * as PIXI from "pixi.js";
import spritesheetImage from "./assets/spritesheet.png";
import spritesheet from "./assets/spritesheet.json";
import jumpWAV from "./assets/jump.wav";
import deadWAV from "./assets/dead.wav";
import kissWAV from "./assets/kiss.wav";

const loader = PIXI.Loader.shared;

export const textures: Record<string, PIXI.Texture> = {};
export const sounds: Record<string, HTMLAudioElement> = {};
export let sheet: PIXI.Spritesheet | undefined = undefined;

export async function loadAssets() {
  return new Promise<void>((resolve, reject) => {
    loader
      .add("spritesheetImage", spritesheetImage)
      .add("jump", jumpWAV)
      .add("dead", deadWAV)
      .add("kiss", kissWAV);

    loader.load((_loader, resources) => {
      if (resources.spritesheetImage.texture) {
        sheet = new PIXI.Spritesheet(
          resources.spritesheetImage.texture,
          spritesheet
        );

        if (!sheet) return;

        sheet.parse(x => {
          if (!x) return;

          textures["body"] = x["body.png"];
          textures["eye"] = x["eye.png"];
          textures["wow"] = x["lwow.png"];
          textures["ouch"] = x["ouch.png"];
        });
      }

      if (resources.jump) {
        sounds.jump = resources.jump.data;
      }

      if (resources.dead) {
        sounds.dead = resources.dead.data;
      }

      if (resources.kiss) {
        sounds.kiss = resources.kiss.data;
      }
    });

    loader.onComplete.add(() => {
      resolve();
    });

    loader.onError.add(() => {
      reject();
    });
  });
}
