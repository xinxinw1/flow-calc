// @flow

import { downCast } from '../typetools';
import NatNum from './NatNum';
import Digits from './Digits';

export default class NatNumDigits extends NatNum {
  digits: Digits;

  constructor(digits: Digits) {
    super();
    this.digits = digits;
    Object.freeze(this);
  }

  static zero: NatNum = new NatNumDigits(Digits.empty);

  static fromDigits(digits: Digits): NatNum {
    return new NatNumDigits(digits).trim();
  }

  static fromStr(s: string): NatNum {
    return NatNumDigits.fromDigits(Digits.fromStr(s));
  }

  static fromNum(n: number): NatNum {
    return NatNumDigits.fromDigits(Digits.fromNum(n));
  }

  trim(): NatNum {
    let changed = false;
    let { digits } = this;

    if (digits.isEmpty()) return NatNumDigits.zero;

    // trim left side
    while (digits.head() === 0) {
      changed = true;
      digits = digits.tail();
      if (digits.isEmpty()) return NatNumDigits.zero;
    }

    if (!changed) return this;

    return new NatNumDigits(digits);
  }

  isZero(): boolean {
    return this.digits.isEmpty();
  }

  toString(): string {
    if (this.isZero()) return '0';
    return this.digits.toString();
  }

  // number of base 10 digits in the number
  // 0 => 0
  size(): number {
    return this.digits.size();
  }

  // this % 10
  last(): number {
    if (this.isZero()) return 0;
    return this.digits.last();
  }

  // this // 10
  init(): NatNum {
    if (this.isZero()) return NatNumDigits.zero;
    return NatNumDigits.fromDigits(this.digits.init());
  }

  // this * 10 + x
  push(x: number): NatNum {
    return NatNumDigits.fromDigits(this.digits.push(x));
  }

  // returns [this // 10^numInRight, this % 10^numInRight]
  splitRight(numInRight: number): [NatNum, NatNum] {
    if (numInRight < 0) {
      throw new Error('NatNum.splitRight cannot take a negative number');
    }
    const [leftDigs, rightDigs] = this.digits.splitRight(numInRight);
    return [
      NatNumDigits.fromDigits(leftDigs),
      NatNumDigits.fromDigits(rightDigs),
    ];
  }

  // assumes this is trimmed
  equals(otherNat: NatNum): boolean {
    const other = downCast(otherNat, NatNumDigits);
    return this.digits.equals(other.digits);
  }

  add1(): NatNum {
    return NatNumDigits.fromDigits(this.digits.add1());
  }

  sub1(): NatNum {
    return NatNumDigits.fromDigits(this.digits.sub1());
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
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return Digits.compare(a.digits, b.digits, aRightWait, bRightWait);
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
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return NatNumDigits.fromDigits(
      Digits.add(a.digits, b.digits, aRightWait, bRightWait),
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
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return NatNumDigits.fromDigits(
      Digits.sub(a.digits, b.digits, aRightWait, bRightWait),
    );
  }

  // multiplies digits a and b aligned on the right side
  static mult(aNat: NatNum, bNat: NatNum): NatNum {
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return NatNumDigits.fromDigits(Digits.mult(a.digits, b.digits));
  }
}

Object.freeze(NatNumDigits);
