// @flow

import Digits from './Digits';

export default class NatNum {
  digits: Digits;

  constructor(digits: Digits) {
    this.digits = digits;
    Object.freeze(this);
  }

  static zero: NatNum = new NatNum(Digits.empty);

  static fromDigits(digits: Digits): NatNum {
    return new NatNum(digits).trim();
  }

  static fromStr(s: string): NatNum {
    return NatNum.fromDigits(Digits.fromStr(s));
  }

  static fromNum(n: number): NatNum {
    return NatNum.fromDigits(Digits.fromNum(n));
  }

  trim(): NatNum {
    let changed = false;
    let { digits } = this;

    if (digits.isEmpty()) return NatNum.zero;

    // trim left side
    while (digits.head() === 0) {
      changed = true;
      digits = digits.tail();
      if (digits.isEmpty()) return NatNum.zero;
    }

    if (!changed) return this;

    return new NatNum(digits);
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
    if (this.isZero()) return NatNum.zero;
    return NatNum.fromDigits(this.digits.init());
  }

  // this * 10 + x
  push(x: number): NatNum {
    return NatNum.fromDigits(this.digits.push(x));
  }

  // returns [this // 10^numInRight, this % 10^numInRight]
  splitRight(numInRight: number): [NatNum, NatNum] {
    if (numInRight < 0) {
      throw new Error('NatNum.splitRight cannot take a negative number');
    }
    const [leftDigs, rightDigs] = this.digits.splitRight(numInRight);
    return [NatNum.fromDigits(leftDigs), NatNum.fromDigits(rightDigs)];
  }

  // this * 10^n
  shiftLeft(n: number): NatNum {
    if (n < 0) return this.shiftRight(0 - n);
    let num = this;
    for (let i = 0; i < n; i += 1) {
      num = num.push(0);
    }
    return num;
  }

  // this * 10^-n
  shiftRight(n: number): NatNum {
    if (n < 0) return this.shiftLeft(0 - n);
    let num = this;
    for (let i = 0; i < n; i += 1) {
      num = num.init();
    }
    return num;
  }

  // assumes this is trimmed
  equals(other: NatNum): boolean {
    return this.digits.equals(other.digits);
  }

  add1(): NatNum {
    return NatNum.fromDigits(this.digits.add1());
  }

  sub1(): NatNum {
    return NatNum.fromDigits(this.digits.sub1());
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
    return Digits.compare(a.digits, b.digits, aRightWait, bRightWait);
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
    return NatNum.fromDigits(
      Digits.add(a.digits, b.digits, aRightWait, bRightWait),
    );
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
    return NatNum.fromDigits(
      Digits.sub(a.digits, b.digits, aRightWait, bRightWait),
    );
  }

  // multiplies digits a and b aligned on the right side
  static mult(a: NatNum, b: NatNum): NatNum {
    return NatNum.fromDigits(Digits.mult(a.digits, b.digits));
  }
}

Object.freeze(NatNum);
