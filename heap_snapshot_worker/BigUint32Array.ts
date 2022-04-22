// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const LENGTH_LIMIT = 2 ** 30 / 4; // (2 ** 32 - 1) / 1;

export class BigUint32Array {
  #innerArray: Uint32Array[];
  constructor (length: number) {
    this.#innerArray = [];
    for (let i = length; i > 0; i -= LENGTH_LIMIT) {
      // eslint-disable-next-line no-console
      console.log('length', this.#innerArray.length, i);
      this.#innerArray.push(new Uint32Array(Math.min(i, LENGTH_LIMIT)));
    }

    const proxy = new Proxy(this, {
      set (target, p, value): boolean {
        if (typeof p === 'symbol') {
          throw new TypeError('Cannot set property');
        }
        const index = Number(p);
        if (isNaN(index)) {
          throw new Error(`Invalid index ${index}`);
        }
        if (index < 0) {
          throw new Error(`Invalid index ${index}`);
        }
        if (index >= target.length) {
          // throw new Error(`Invalid index ${index}`);
          // like Uint32Array
          return true;
        }
        if (typeof value !== 'number') {
          throw new TypeError('Value must be a number');
        }

        const mainIndex = Math.floor(index / LENGTH_LIMIT);
        const offset = index % LENGTH_LIMIT;
        target.#innerArray[mainIndex][offset] = value;
        return true;
      },
      get (target, p): number | (() => Generator<number>) | ((func: Function) => void) | undefined{
        if (p === Symbol.iterator) {
          return target[p].bind(target);
        }
        if (p === 'length') {
          return (():number => target.length).bind(target)(); // invokes "this" in length getter
        }
        // for Promise
        if(p === 'then') {
          return undefined; // (func: Function):void => func(proxy);
        }
        const index = Number(p);
        if (isNaN(index)) {
          throw new Error(`Invalid index ${index}`);
        }
        if (index < 0) {
          throw new Error(`Invalid index ${index}`);
        }
        if (index >= target.length) {
          throw new Error(`Invalid index ${index}`);
        }

        const mainIndex = Math.floor(index / LENGTH_LIMIT);
        const offset = index % LENGTH_LIMIT;
        return target.#innerArray[mainIndex][offset];
      },
    });
    return proxy;
  }

  get length (): number {
    return (this.#innerArray.length - 1) * LENGTH_LIMIT + this.#innerArray[this.#innerArray.length - 1].length;
  }

  [index: number]: number

  [symbol: symbol]: () => Generator<number>;

  * [Symbol.iterator] (): Generator<number> {
    for (const array of this.#innerArray) {
      for (const value of array) {
        yield value;
      }
    }
  }
}
