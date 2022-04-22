// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import {parse} from './JsonParse.js';

// const LENGTH_LIMIT = 2 ** 29 - 24;
// const LENGTH_LIMIT = 10; // FOR TEST

export class BigString {
  #innerString: string[];

  static lengthLimit = 2 ** 29 - 24;

  constructor(stringArray?: string[]) {
    if (stringArray && stringArray.length > 0) {
      this.#innerString = stringArray;
    } else {
      this.#innerString = [];
    }
  }

  get length(): number {
    let length = 0;
    for (const str of this.#innerString) {
      length += str.length;
    }
    return length;
  }

  append(str: string | BigString): void {
    if(typeof str === 'string') {
      const lastString = this.#innerString[this.#innerString.length - 1];
      if (lastString && lastString.length < BigString.lengthLimit) {
        if (lastString.length + str.length > BigString.lengthLimit) {
          this.#innerString[this.#innerString.length - 1] = lastString.concat(
            str.slice(0, BigString.lengthLimit - lastString.length),
          );
          this.#innerString.push(str.slice(BigString.lengthLimit - lastString.length));
        } else {
          this.#innerString[this.#innerString.length - 1] =
            lastString.concat(str);
        }
      } else {
        this.#innerString.push(str);
      }
    }
    if(str instanceof BigString) {
      str.#innerString.forEach(innerStr => {
        this.append(innerStr);
      });
    }
  }

  clear(): void {
    this.#innerString = [];
  }

  charCodeAt(index: number): number {
    let charCode = 0;
    let currentIndex = 0;
    let found = false;
    for (const str of this.#innerString) {
      if (currentIndex + str.length > index) {
        charCode = str.charCodeAt(index - currentIndex);
        found = true;
        break;
      }
      currentIndex += str.length;
    }
    return found ? charCode : ''.charCodeAt(-1); // suppose to be NaN when not found
  }

  charAt(index: number): string {
    const charCode = this.charCodeAt(index);
    if(isNaN(charCode)) {
      return '';
    }
    return String.fromCharCode(charCode);
  }

  slice(start: number, end?: number): BigString {
    const result = new BigString();
    let currentIndex = 0;
    end = end === undefined ? this.length : end;
    for (const str of this.#innerString) {
      if (currentIndex + str.length > start) {
        if (currentIndex + str.length > end) {
          result.append(str.slice(Math.max(start - currentIndex, 0), end - currentIndex));
          break;
        } else {
          result.append(str.slice(Math.max(start - currentIndex, 0)));
        }
      }
      currentIndex += str.length;
    }
    return result;
  }

  lastIndexOf(searchString: string, position?: number): number {
    let result = -1;
    let currentIndex = this.length - 1;
    position = position === undefined ? this.length - 1 : position;
    for (let i = this.#innerString.length - 1; i >= 0; i--) {
      if (currentIndex - this.#innerString[i].length < position) {
        const positionInString =
          this.#innerString[i].length - 1 - Math.max((currentIndex - position), 0);
        const lastIndex = this.#innerString[i].lastIndexOf(
          searchString,
          positionInString,
        );
        if (lastIndex !== -1) {
          result = currentIndex - (this.#innerString[i].length - 1) + lastIndex;
          break;
        }
      }
      currentIndex -= this.#innerString[i].length;
    }
    return result;
  }

  indexOf(searchString: string, position?: number): number {
    let result = -1;
    let currentIndex = 0;
    position = position || 0;
    for (const str of this.#innerString) {
      if (currentIndex + str.length > position) {
        const indexOfString = str.indexOf(searchString, position - currentIndex);
        if(indexOfString !== -1) {
          result = currentIndex + indexOfString;
          break;
        }
      }
      currentIndex += str.length;
    }
    return result;
  }

  substring(start: number, end?: number): BigString {
    const result = new BigString();
    end = end || this.length;
    let currentIndex = 0;
    for (const str of this.#innerString) {
      if (currentIndex + str.length > start) {
        if (currentIndex + str.length > end) {
          result.append(str.slice(Math.max(start - currentIndex, 0), end - currentIndex));
          break;
        } else {
          result.append(str.slice(Math.max(start - currentIndex, 0)));
        }
      }
      currentIndex += str.length;
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toJson(): Record<string, any> {
    return parse(this);
  }

  toString(): string {
    let result = '';
    for (const str of this.#innerString) {
      result += str;
    }
    return result;
  }
}
