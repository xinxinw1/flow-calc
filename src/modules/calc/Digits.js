// @flow

import assert from 'assert';
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

  static checkRightWaits(aRightWait: number, bRightWait: number): void {
    if (aRightWait < 0 || bRightWait < 0) {
      throw new Error('Right waits must be >= 0');
    }

    if (aRightWait > 0 && bRightWait > 0) {
      throw new Error('Right waits must not both be > 0');
    }
  }

  // returns 0 if digits have equal value
  // 1 if a > b,
  // -1 if a < b
  static compare(
    a: Digits,
    b: Digits,
    aRightWait: number,
    bRightWait: number,
  ): number {
    this.checkRightWaits(aRightWait, bRightWait);

    const aSize = a.size() + aRightWait;
    const bSize = b.size() + bRightWait;
    const maxSize = Math.max(aSize, bSize);

    const aLeftWait = maxSize - aSize;
    const bLeftWait = maxSize - bSize;

    const aIter = a.iter();
    const bIter = b.iter();

    let aWait = aLeftWait;
    let bWait = bLeftWait;

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

      if (aDig !== bDig) {
        if (aDig > bDig) return 1;
        return -1;
      }
    }

    return 0;
  }

  // adds digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  static add(
    a: Digits,
    b: Digits,
    aRightWait: number,
    bRightWait: number,
  ): Digits {
    this.checkRightWaits(aRightWait, bRightWait);

    if (bRightWait > 0) {
      return this.add(b, a, bRightWait, aRightWait);
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
    let sum = suffix;
    // TODO: use riter()
    while (!aCommon.isEmpty()) {
      const digSum = aCommon.last() + bCommon.last() + carry;

      if (digSum >= 10) {
        sum = sum.cons(digSum - 10);
        carry = 1;
      } else {
        sum = sum.cons(digSum);
        carry = 0;
      }

      aCommon = aCommon.init();
      bCommon = bCommon.init();
    }

    if (carry > 0) {
      prefix = prefix.add1();
    }

    return prefix.concat(sum);
  }

  // subtracts digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  // assume a >= b
  static sub(
    a: Digits,
    b: Digits,
    aRightWait: number,
    bRightWait: number,
  ): Digits {
    this.checkRightWaits(aRightWait, bRightWait);

    let aPrefix: Digits;
    let bPrefix: Digits;
    let diff: Digits;
    if (bRightWait > 0) {
      if (bRightWait >= a.size()) {
        // a =    123
        // b = 000
        // b is 0 in this case since a >= b
        for (const dig of b) {
          assert(dig === 0, 'digit of b is non-zero');
        }
        return a;
      }
      // now bRightWait < a.size()
      // a =  423
      // b = 034
      // or
      // a = 123123
      // b =   234
      [aPrefix, diff] = a.splitRight(bRightWait);
      bPrefix = b;
    } else {
      aPrefix = a;
      bPrefix = b;
      diff = Digits.empty;
    }

    let aWait = aRightWait;

    let borrow = 0;
    // TODO: use riter()
    while (!(aWait === 0 && aPrefix.isEmpty()) && !bPrefix.isEmpty()) {
      let aDig = 0;
      if (aWait > 0) {
        aWait -= 1;
      } else {
        aDig = aPrefix.last();
        aPrefix = aPrefix.init();
      }
      const bDig = bPrefix.last();
      bPrefix = bPrefix.init();

      const digDiff = aDig - bDig - borrow;

      if (digDiff < 0) {
        diff = diff.cons(digDiff + 10);
        borrow = 1;
      } else {
        diff = diff.cons(digDiff);
        borrow = 0;
      }
    }

    // now either a finished first or b finished first
    // aPrefix = 123s
    // bPrefix =
    // or
    // aPrefix = 12
    // bPrefix =
    // or
    // aPrefix =
    // bPrefix = 0

    if (!bPrefix.isEmpty()) {
      // now aPrefix is empty with no aWait
      // check that remaining b items are 0
      for (const dig of bPrefix) {
        assert(dig === 0, 'digit of bPrefix is non-zero');
      }
      return diff;
    }

    // now bPrefix is empty
    // so maybe aWait > 0 or aPrefix is not empty
    if (borrow === 0) {
      for (let i = 0; i < aWait; i += 1) {
        diff = diff.cons(0);
      }
      return aPrefix.concat(diff);
    }
    // now borrow > 0, need to sub1 from aPrefix
    for (let i = 0; i < aWait; i += 1) {
      diff = diff.cons(9);
    }
    return aPrefix.sub1().concat(diff);
  }

  // multiply these digits by dig
  multDig(dig: number): Digits {
    if (dig === 0) return Digits.empty;
    if (dig === 1) return this;

    let a = this;

    // TODO: use riter()
    let prod = Digits.empty;
    let carry = 0;
    while (!a.isEmpty()) {
      const digProd = a.last() * dig + carry;

      const prodDig = digProd % 10;
      prod = prod.cons(prodDig);
      carry = (digProd - prodDig) / 10;

      a = a.init();
    }

    if (carry > 0) {
      prod = prod.cons(carry);
    }

    return prod;
  }

  // multiplies digits a and b aligned on the right side
  static mult(a: Digits, b: Digits): Digits {
    if (a.size() < b.size()) {
      // make b the one with less digits
      return Digits.mult(b, a);
    }

    let prod = Digits.empty;

    // TODO: use riter()
    let index = 0;
    let bLeft = b;
    while (!bLeft.isEmpty()) {
      const bDig = bLeft.last();
      if (bDig > 0) {
        prod = Digits.add(prod, a.multDig(bDig), 0, index);
      }
      bLeft = bLeft.init();
      index += 1;
    }

    return prod;
  }
}

Object.freeze(Digits);
