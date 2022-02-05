import * as PIXI from "pixi.js";
import sample from "./assets/sample.png";

const loader = PIXI.Loader.shared;

export const textures: Record<string, PIXI.Texture> = {};

export async function loadAssets() {
  return new Promise<void>(resolve => {
    loader.add("sample", sample);

    loader.load((_loader, resources) => {
      if (resources.sample.texture) textures.sample = resources.sample.texture;
    });

    loader.onComplete.add(() => {
      resolve();
    });
  });
}
