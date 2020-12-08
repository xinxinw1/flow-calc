// @flow

import bigInt, { type BigInteger } from 'big-integer';

import { downCast } from '../typetools';
import NatNum from './NatNum';

export default class NatNumBigInt extends NatNum {
  num: BigInteger;

  constructor(num: BigInteger) {
    super();
    if (num.lt(0)) {
      throw new Error('NatNumBigInt given negative number');
    }
    this.num = num;
    Object.freeze(this);
  }

  static zero: NatNum = new NatNumBigInt(bigInt.zero);

  static fromStr(s: string): NatNum {
    return new NatNumBigInt(bigInt(s));
  }

  static fromNum(n: number): NatNum {
    return new NatNumBigInt(bigInt(n));
  }

  isZero(): boolean {
    return this.num.equals(0);
  }

  toString(): string {
    return this.num.toString();
  }

  // number of base 10 digits in the number
  // 0 => 0
  size(): number {
    if (this.isZero()) return 0;
    return this.toString().length;
  }

  // this % 10
  last(): number {
    return this.num.mod(10).toJSNumber();
  }

  // this // 10
  init(): NatNum {
    return new NatNumBigInt(this.num.divide(10));
  }

  // this * 10 + x
  push(x: number): NatNum {
    return new NatNumBigInt(this.num.multiply(10).add(x));
  }

  // returns [this // 10^numInRight, this % 10^numInRight]
  splitRight(numInRight: number): [NatNum, NatNum] {
    if (numInRight < 0) {
      throw new Error('NatNum.splitRight cannot take a negative number');
    }
    const { quotient, remainder } = this.num.divmod(bigInt(10).pow(numInRight));
    return [new NatNumBigInt(quotient), new NatNumBigInt(remainder)];
  }

  // this * 10^n
  shiftLeft(n: number): NatNumBigInt {
    if (n < 0) {
      throw new Error('cannot shiftLeft by a negative number, use shiftRight');
    }
    return new NatNumBigInt(this.num.multiply(bigInt(10).pow(n)));
  }

  // assumes this is trimmed
  equals(otherNat: NatNum): boolean {
    const other = downCast(otherNat, NatNumBigInt);
    return this.num.equals(other.num);
  }

  add1(): NatNum {
    return new NatNumBigInt(this.num.next());
  }

  sub1(): NatNum {
    if (this.isZero()) {
      throw new Error('Cannot subtract 1 from 0');
    }
    return new NatNumBigInt(this.num.prev());
  }

  // returns 0 if digits have equal value
  // 1 if a > b,
  // -1 if a < b
  static compare(
    aNat: NatNum,
    bNat: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): number {
    const a = downCast(aNat, NatNumBigInt);
    const b = downCast(bNat, NatNumBigInt);
    return a.shiftLeft(aRightWait).num.compare(b.shiftLeft(bRightWait).num);
  }

  // adds digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  static add(
    aNat: NatNum,
    bNat: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): NatNum {
    const a = downCast(aNat, NatNumBigInt);
    const b = downCast(bNat, NatNumBigInt);
    return new NatNumBigInt(
      a.shiftLeft(aRightWait).num.add(b.shiftLeft(bRightWait).num),
    );
  }

  // subtracts digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  // assume a >= b
  static sub(
    aNat: NatNum,
    bNat: NatNum,
    aRightWait: number,
    bRightWait: number,
  ): NatNum {
    const a = downCast(aNat, NatNumBigInt);
    const b = downCast(bNat, NatNumBigInt);
    return new NatNumBigInt(
      a.shiftLeft(aRightWait).num.subtract(b.shiftLeft(bRightWait).num),
    );
  }

  // multiplies digits a and b aligned on the right side
  static mult(aNat: NatNum, bNat: NatNum): NatNum {
    const a = downCast(aNat, NatNumBigInt);
    const b = downCast(bNat, NatNumBigInt);
    return new NatNumBigInt(a.num.multiply(b.num));
  }
}

Object.freeze(NatNumBigInt);
