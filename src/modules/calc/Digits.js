// @flow

import assert from 'assert';

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

  // split the digits so that the right side
  // has numInRight digits
  splitRight(numInRight: number): [Digits, Digits] {
    return this.split(this.size() - numInRight);
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

  sub1(): Digits {
    let left = this;
    let right = Digits.empty;
    while (!left.isEmpty()) {
      const last = left.last();
      if (last !== 0) {
        return left
          .init()
          .push(last - 1)
          .concat(right);
      }
      left = left.init();
      right = right.cons(9);
    }
    throw new Error('Cannot subtract 1 from 0');
  }

  // adds digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  static addRight(
    a: Digits,
    b: Digits,
    aRightWait: number,
    bRightWait: number,
  ): Digits {
    if (aRightWait < 0 || bRightWait < 0) {
      throw new Error('addRight right waits must be >= 0');
    }

    if (aRightWait > 0 && bRightWait > 0) {
      throw new Error('addRight right waits must not both be > 0');
    }

    if (bRightWait > 0) {
      return this.addRight(b, a, bRightWait, aRightWait);
    }

    // now only aRightWait can be > 0

    if (aRightWait >= b.size()) {
      // a = 123
      // b =    234
      // no need to add, just concat
      let sum = a;
      for (let i = 0; i < aRightWait - b.size(); i += 1) {
        sum = sum.push(0);
      }
      sum = sum.concat(b);
      return sum;
    }

    // now aRightWait < b.size()
    // a = 123
    // b =   234
    // or
    // a =  123
    // b = 234234
    const [bPrefix, suffix] = b.splitRight(aRightWait);

    let prefix: Digits;
    let aCommon: Digits;
    let bCommon: Digits;
    if (a.size() >= bPrefix.size()) {
      // a = 123
      // b =   234
      [prefix, aCommon] = a.splitRight(bPrefix.size());
      bCommon = bPrefix;
    } else {
      // a.size() < bPrefix.size()
      // a =  123
      // b = 234234
      [prefix, bCommon] = bPrefix.splitRight(a.size());
      aCommon = a;
    }

    assert(aCommon.size() === bCommon.size(), 'common sizes not equal');

    let carry = 0;
    let sumCommon = Digits.empty;
    while (aCommon.size() > 0) {
      const digSum = aCommon.last() + bCommon.last() + carry;

      if (digSum >= 10) {
        sumCommon = sumCommon.cons(digSum - 10);
        carry = 1;
      } else {
        sumCommon = sumCommon.cons(digSum);
        carry = 0;
      }

      aCommon = aCommon.init();
      bCommon = bCommon.init();
    }

    if (carry > 0) {
      prefix = prefix.add1();
    }

    return prefix.concat(sumCommon).concat(suffix);
  }
}

Object.freeze(Digits);
