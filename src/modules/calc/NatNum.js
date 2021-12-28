// @flow

import AbstractClass from '../AbstractClass';
import Precision from './Precision';

export default class NatNum extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(NatNum);
  }

  static zero: NatNum;

  static fromStr(s: string): NatNum {
    return AbstractClass.abstractMethod('fromStr', s);
  }

  static fromNum(n: number): NatNum {
    return AbstractClass.abstractMethod('fromNum', n);
  }

  isZero(): boolean {
    return this.abstractMethod('isZero');
  }

  toString(): string {
    return this.abstractMethod('toString');
  }

  // number of base 10 digits in the number
  // 0 => 0
  size(): number {
    return this.abstractMethod('size');
  }

  // this % 10
  last(): number {
    return this.abstractMethod('last');
  }

  // this // 10
  init(): NatNum {
    return this.abstractMethod('init');
  }

  // this * 10 + x
  push(x: number): NatNum {
    return this.abstractMethod('push', x);
  }

  // returns [this // 10^numInRight, this % 10^numInRight]
  splitRight(numInRight: number): [NatNum, NatNum] {
    return this.abstractMethod('splitRight', numInRight);
  }

  // this * 10^n
  shiftLeft(n: number): NatNum {
    if (n < 0) {
      throw new Error('cannot shiftLeft by a negative number, use shiftRight');
    }
    let num = this;
    for (let i = 0; i < n; i += 1) {
      num = num.push(0);
    }
    return num;
  }

  // this * 10^-n
  // 2nd return is the list of removed numbers
  // with leftmost ones being the last removed
  shiftRight(n: number): [NatNum, Array<number>] {
    if (n < 0) {
      throw new Error('cannot shiftRight by a negative number, use shiftLeft');
    }
    let num = this;
    const shifted = [];
    for (let i = 0; i < n; i += 1) {
      shifted.push(num.last());
      num = num.init();
    }
    shifted.reverse();
    return [num, shifted];
  }

  // assumes this is trimmed
  equals(other: NatNum): boolean {
    return this.abstractMethod('equals', other);
  }

  add1(): NatNum {
    return this.abstractMethod('add1');
  }

  sub1(): NatNum {
    return this.abstractMethod('sub1');
  }

  // returns 0 if digits have equal value
  // 1 if a > b,
  // -1 if a < b
  static compare(
    a: NatNum,
    b: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): number {
    return AbstractClass.abstractMethod(
      'compare',
      a,
      b,
      aRightWait,
      bRightWait,
    );
  }

  // adds digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  static add(
    a: NatNum,
    b: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): NatNum {
    return AbstractClass.abstractMethod('add', a, b, aRightWait, bRightWait);
  }

  // subtracts digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  // assume a >= b
  static sub(
    a: NatNum,
    b: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): NatNum {
    return AbstractClass.abstractMethod('sub', a, b, aRightWait, bRightWait);
  }

  // multiplies digits a and b aligned on the right side
  static mult(a: NatNum, b: NatNum): NatNum {
    return AbstractClass.abstractMethod('mult', a, b);
  }

  // divides digits a and b aligned on the right side
  // to the given precision
  // returns [quot, quotExp, rem, remExp] with rem >= 0
  // a = quot*10^quotExp * b + rem*10^remExp
  static div(
    a: NatNum,
    b: NatNum,
    prec: Precision,
  ): [NatNum, number, NatNum, number] {
    return AbstractClass.abstractMethod('div', a, b, prec);
  }
}

Object.freeze(NatNum);
