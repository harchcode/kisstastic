import { nextPowerOf2 } from "./math";

export class Pool<T> {
  private objs: Record<number, T> = Object.create(null);
  private isAlive: Record<number, boolean> = Object.create(null);
  private objsIdMap: Map<T, number> = new Map();
  private availableIds: number[] = [];
  private currentSize = 0;
  private arr: T[] = []; // This is to prevent creating new Array everytime we call getAll

  private createFn: () => T;

  constructor(createFn: () => T, initialSize = 128) {
    this.createFn = createFn;

    this.expand(nextPowerOf2(initialSize));
  }

  private expand(newSize: number) {
    for (let i = this.currentSize; i < newSize; i++) {
      const newObj = this.createFn();

      this.objsIdMap.set(newObj, i);

      this.isAlive[i] = false;
      this.availableIds.push(i);
      this.objs[i] = newObj;
    }

    this.currentSize = newSize;
  }

  get = (id: number) => this.objs[id];

  obtain() {
    if (this.availableIds.length === 0) {
      this.expand(nextPowerOf2(this.currentSize + 1));
    }

    const id = this.availableIds.pop() as number;
    const obj = this.get(id);

    this.isAlive[id] = true;

    return obj;
  }

  free(obj: T | number) {
    const id = typeof obj === "number" ? obj : this.objsIdMap.get(obj);

    if (!id) return;

    this.isAlive[id] = false;
    this.availableIds.push(id);
  }

  clear() {
    this.availableIds.length = 0;

    for (let i = 0; i < this.currentSize; i++) {
      this.isAlive[i] = false;
      this.availableIds.push(i);
    }
  }

  forEach(fn: (obj: T, i: number) => void) {
    let i = 0;

    for (const k in this.objs) {
      const v = this.objs[k];
      const id = this.objsIdMap.get(v);

      if (!id) continue;

      if (this.isAlive[id]) {
        fn(v, i);
        i++;
      }
    }
  }

  getAll = (): T[] => {
    this.arr.length = 0;

    for (const k in this.objs) {
      const v = this.objs[k];
      const id = this.objsIdMap.get(v);

      if (!id) continue;

      if (this.isAlive[id]) {
        this.arr.push(v);
      }
    }

    return this.arr;
  };

  count = (): number => {
    return this.currentSize - this.availableIds.length;
  };
}
