import * as PIXI from "pixi.js";
import sample from "./assets/sample.png";
import spritesheetImage from "./assets/spritesheet.png";
import spritesheet from "./assets/spritesheet.json";

const loader = PIXI.Loader.shared;

export const textures: Record<string, PIXI.Texture> = {};
export let sheet: PIXI.Spritesheet | undefined = undefined;

export async function loadAssets() {
  return new Promise<void>((resolve, reject) => {
    loader.add("sample", sample).add("spritesheetImage", spritesheetImage);

    loader.load((_loader, resources) => {
      if (resources.sample.texture) textures.sample = resources.sample.texture;

      if (!resources.spritesheetImage.texture) return;

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
    });

    loader.onComplete.add(() => {
      resolve();
    });

    loader.onError.add(() => {
      reject();
    });
  });
}
