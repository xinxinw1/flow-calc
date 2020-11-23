// @flow

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

  // $FlowIgnore[unclear-type]
  /*:: @@iterator(): Iterator<number> { return ({}: any); } */

  // $FlowIgnore[unsupported-syntax]
  [Symbol.iterator](): Iterator<number> {
    return this.digits[Symbol.iterator]();
  }
}

Object.freeze(Digits);
