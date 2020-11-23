// @flow

import { izip } from '../itertools';
import FingerTree from '../FingerTree';

type DigitTree = FingerTree.Tree<number, number>;

// measures number of digits
const digitMeasure: FingerTree.Measure<number, number> = {
  plus: (x: number, y: number): number => x + y,
  measure: (_: number) => 1,
  zero: () => 0,
};

export default class Digits {
  digits: DigitTree;

  constructor(digits: DigitTree) {
    this.digits = digits;
    Object.freeze(this);
  }

  static empty: Digits = new Digits(FingerTree.empty(digitMeasure));

  static fromIter(it: Iterable<number>): Digits {
    return new Digits(FingerTree.from(digitMeasure, it));
  }

  static validStr(s: string): boolean {
    const numRegex = /^[0-9]*$/;
    return numRegex.test(s);
  }

  static fromStr(s: string): Digits {
    if (!Digits.validStr(s)) {
      throw new Error(`Input string ${s} is not a valid number`);
    }
    return Digits.fromIter(s.split('').map(Number));
  }

  static fromNum(n: number): Digits {
    return Digits.fromStr(n.toString());
  }

  toString(): string {
    return [...this].join('');
  }

  isEmpty(): boolean {
    return this.digits.empty();
  }

  size(): number {
    return this.digits.measure();
  }

  head(): number {
    return this.digits.head();
  }

  last(): number {
    return this.digits.last();
  }

  init(): Digits {
    return new Digits(this.digits.init());
  }

  tail(): Digits {
    return new Digits(this.digits.tail());
  }

  push(x: number): Digits {
    return new Digits(this.digits.push(x));
  }

  cons(x: number): Digits {
    return new Digits(this.digits.cons(x));
  }

  split(keepUntil: (count: number) => boolean): [Digits, Digits] {
    const [left, right] = this.digits.split(keepUntil);
    return [new Digits(left), new Digits(right)];
  }

  concat(t: Digits): Digits {
    return new Digits(this.digits.concat(t.digits));
  }

  // $FlowIgnore[unclear-type]
  /*:: @@iterator(): Iterator<number> { return ({}: any); } */

  // $FlowIgnore[unsupported-syntax]
  [Symbol.iterator](): Iterator<number> {
    return this.digits[Symbol.iterator]();
  }

  equals(other: Digits): boolean {
    if (this.size() !== other.size()) return false;

    const zipped = izip(this, other);

    for (const [d, otherD] of zipped) {
      if (d !== otherD) return false;
    }

    return true;
  }

  add1(): Digits {
    let left = this;
    let right = Digits.empty;
    while (!left.isEmpty()) {
      const last = left.last();
      if (last !== 9) {
        return left
          .init()
          .push(last + 1)
          .concat(right);
      }
      left = left.init();
      right = right.cons(0);
    }
    return right.cons(1);
  }
}

Object.freeze(Digits);
