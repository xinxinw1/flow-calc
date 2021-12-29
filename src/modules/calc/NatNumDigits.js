// @flow

import { downCast } from '../typetools';

import Digits from './Digits';
import NatNum from './NatNum';
import { type Precision, RegularPrec } from './Precision';

export default class NatNumDigits extends NatNum {
  digits: Digits;

  constructor(digits: Digits) {
    super();
    this.digits = digits;
    Object.freeze(this);
  }

  static zeroDigits: NatNumDigits = new NatNumDigits(Digits.empty);
  static zero: NatNum = NatNumDigits.zeroDigits;

  static fromDigits(digits: Digits): NatNumDigits {
    return new NatNumDigits(digits).trim();
  }

  static fromStr(s: string): NatNum {
    return NatNumDigits.fromDigits(Digits.fromStr(s));
  }

  static fromNum(n: number): NatNum {
    return NatNumDigits.fromDigits(Digits.fromNum(n));
  }

  trim(): NatNumDigits {
    let changed = false;
    let { digits } = this;

    if (digits.isEmpty()) return NatNumDigits.zeroDigits;

    // trim left side
    while (digits.head() === 0) {
      changed = true;
      digits = digits.tail();
      if (digits.isEmpty()) return NatNumDigits.zeroDigits;
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
  push(x: number): NatNumDigits {
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
  ): NatNumDigits {
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return NatNumDigits.fromDigits(
      Digits.sub(a.digits, b.digits, aRightWait, bRightWait),
    );
  }

  // multiplies digits a and b aligned on the right side
  static mult(aNat: NatNum, bNat: NatNum): NatNumDigits {
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);
    return NatNumDigits.fromDigits(Digits.mult(a.digits, b.digits));
  }

  // divides digits a and b aligned on the right side
  // with a shifted to the left by aWait and
  // b shifted to the left by bWait
  // returns [quot, quotExp, rem, remExp] with rem >= 0
  // need both waits because that's how the
  // rounding position is determined
  static div(
    aNat: NatNum,
    bNat: NatNum,
    prec: Precision,
  ): [NatNum, number, NatNum, number] {
    const a = downCast(aNat, NatNumDigits);
    const b = downCast(bNat, NatNumDigits);

    if (b.isZero()) {
      throw new Error('cannot divide by zero');
    }
    if (a.isZero()) return [NatNumDigits.zero, 0, NatNumDigits.zero, 0];

    const bMult = [NatNumDigits.zeroDigits, b];

    function getBMult(n: number): NatNumDigits {
      if (n >= bMult.length) {
        for (let i = 2; i <= n; i += 1) {
          bMult[i] = NatNumDigits.mult(b, NatNumDigits.fromNum(i));
        }
      }
      return bMult[n];
    }

    let quot = NatNumDigits.zero;
    let rem: NatNumDigits = NatNumDigits.zeroDigits;
    let aLeft = a.digits;
    let exp = a.size();

    while (
      new RegularPrec(0 - exp).lt(prec) &&
      !(rem.isZero() && aLeft.isEmpty())
    ) {
      if (!aLeft.isEmpty()) {
        rem = rem.push(aLeft.head());
        aLeft = aLeft.tail();
      } else {
        rem = rem.push(0);
      }
      let quotDig = 0;
      while (NatNumDigits.compare(getBMult(quotDig + 1), rem, 0, 0) <= 0) {
        quotDig += 1;
      }
      rem = NatNumDigits.sub(rem, getBMult(quotDig), 0, 0);
      quot = quot.push(quotDig);
      exp -= 1;
    }

    if (!aLeft.isEmpty()) {
      rem = NatNumDigits.fromDigits(rem.digits.concat(aLeft));
    }

    const quotExp = quot.isZero() ? 0 : exp;
    const remExp = rem.isZero() ? 0 : Math.min(0, exp);

    return [quot, quotExp, rem, remExp];
  }
}

Object.freeze(NatNumDigits);
