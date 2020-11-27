// @flow

import nullthrows from 'nullthrows';

import { zip, reversed } from '../itertools';
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

  // split the digits so that the left side
  // has numInLeft digits
  split(numInLeft: number): [Digits, Digits] {
    const [left, right] = this.digits.split((m) => m > numInLeft);
    return [new Digits(left), new Digits(right)];
  }

  concat(t: Digits): Digits {
    return new Digits(this.digits.concat(t.digits));
  }

  iter(): Iterator<number> {
    return this.digits[Symbol.iterator]();
  }

  // will get all digits using left-to-right iterator
  // and then reverse it, which is pretty wasteful, but
  // can't really do better without an answer to
  // https://github.com/aureooms/js-fingertree/issues/107
  *riter(): Iterator<number> {
    yield* reversed(this);
  }

  // $FlowIgnore[unclear-type]
  /*:: @@iterator(): Iterator<number> { return ({}: any); } */

  // $FlowIgnore[unsupported-syntax]
  [Symbol.iterator]: Iterator<number> = this.iter;

  equals(other: Digits): boolean {
    if (this.size() !== other.size()) return false;

    const zipped = zip(this, other);

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

  // adds digits a and b aligned on the left side
  // with a shifted to the right by aWait and
  // b shifted to the right by bWait
  // returns the sum without the possible final carry
  // and whether there was a final carry or not
  static addLeft(
    a: Digits,
    b: Digits,
    aLeftWait: number,
    bLeftWait: number,
  ): [Digits, boolean] {
    const aSize = a.size() + aLeftWait;
    const bSize = b.size() + bLeftWait;
    const maxSize = Math.max(aSize, bSize);

    const aRightWait = maxSize - aSize;
    const bRightWait = maxSize - bSize;

    return Digits.addRight(a, b, aRightWait, bRightWait);
  }

  // adds digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  // returns the sum without the possible final carry
  // and whether there was a final carry or not
  static addRight(
    a: Digits,
    b: Digits,
    aRightWait: number,
    bRightWait: number,
  ): [Digits, boolean] {
    const aIter = a.riter();
    const bIter = b.riter();

    let sum = Digits.empty;
    let carry = 0;

    let aWait = aRightWait;
    let bWait = bRightWait;

    let aDone = false;
    let bDone = false;

    for (;;) {
      let aDig = 0;
      let bDig = 0;
      let value;

      if (aWait > 0) {
        aWait -= 1;
      } else if (!aDone) {
        ({ value, done: aDone } = aIter.next());
        if (!aDone) {
          aDig = nullthrows(value);
        }
      }

      if (bWait > 0) {
        bWait -= 1;
      } else if (!bDone) {
        ({ value, done: bDone } = bIter.next());
        if (!bDone) {
          bDig = nullthrows(value);
        }
      }

      if (aDone && bDone) break;

      const digSum = aDig + bDig + carry;

      if (digSum >= 10) {
        sum = sum.cons(digSum - 10);
        carry = 1;
      } else {
        sum = sum.cons(digSum);
        carry = 0;
      }
    }

    return [sum, carry === 1];
  }
}

Object.freeze(Digits);
