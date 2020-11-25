// @flow

import { downCast } from '../typetools';
import Digits from './Digits';
import Size, { RegularSize, NegInfSize } from './Size';
import Precision, { RegularPrec, NegInfPrec } from './Precision';

export default class RealNum {
  pos: boolean;
  digits: Digits;
  exp: number;

  constructor(pos: boolean, digits: Digits, exp: number) {
    this.pos = pos;
    this.digits = digits;
    this.exp = exp;
    Object.freeze(this);
  }

  static zero: RealNum = new RealNum(true, Digits.empty, 0);
  static one: RealNum = RealNum.fromNum(1);

  static fromDigits(pos: boolean, digits: Digits, exp: number): RealNum {
    return new RealNum(pos, digits, exp).trim();
  }

  static fromNum(n: number): RealNum {
    return RealNum.fromStr(n.toString());
  }

  static validStr(s: string): boolean {
    const numRegex = /^-?[0-9]+(\.[0-9]+)?$/;
    return numRegex.test(s);
  }

  static fromStr(s: string): RealNum {
    if (!RealNum.validStr(s)) {
      throw new Error(`Input string ${s} is not a valid number`);
    }

    const pos = s[0] !== '-';
    const start = pos ? 0 : 1;

    const arr: Array<number> = [];
    let exp: number = 0;

    for (let i = start; i < s.length; i += 1) {
      if (s[i] === '.') {
        exp = -(s.length - 1 - i);
      } else {
        arr.push(parseInt(s[i], 10));
      }
    }

    const tree = Digits.fromIter(arr);

    return RealNum.fromDigits(pos, tree, exp);
  }

  trim(): RealNum {
    let changed = false;
    let { digits, exp } = this;
    const { pos } = this;

    if (digits.isEmpty()) return RealNum.zero;

    // trim left side
    while (digits.head() === 0) {
      changed = true;
      digits = digits.tail();
      if (digits.isEmpty()) return RealNum.zero;
    }

    // trim right side
    // at this point digits cannot be empty
    while (digits.last() === 0) {
      changed = true;
      digits = digits.init();
      exp += 1;
    }

    if (!changed) return this;

    return new RealNum(pos, digits, exp);
  }

  isZero(): boolean {
    return this.digits.isEmpty();
  }

  equals(other: RealNum): boolean {
    const trim = this.trim();
    const otherTrim = other.trim();

    return (
      trim.exp === otherTrim.exp &&
      trim.pos === otherTrim.pos &&
      trim.digits.equals(otherTrim.digits)
    );
  }

  // returns trimmed version if this is trimmed
  neg(): RealNum {
    if (this.isZero()) return RealNum.zero;
    return new RealNum(!this.pos, this.digits, this.exp);
  }

  // assumes this is trimmed
  size(): Size {
    if (this.isZero()) return NegInfSize;
    return new RegularSize(this.digits.size() + this.exp);
  }

  // assumes this is trimmed
  // sizeNonZero() + precNonZero() = digits.size()
  sizeNonZero(): number {
    if (this.isZero()) {
      throw new Error('sizeNonZero not defined for 0');
    }
    return this.digits.size() + this.exp;
  }

  // assumes this is trimmed
  prec(): Precision {
    if (this.isZero()) return NegInfPrec;
    return new RegularPrec(0 - this.exp);
  }

  // assumes this is trimmed
  // sizeNonZero() + precNonZero() = digits.size()
  precNonZero(): number {
    if (this.isZero()) {
      throw new Error('precNonZero not defined for 0');
    }
    // 0-exp avoids -0
    return 0 - this.exp;
  }

  // assumes this is trimmed
  toString(): string {
    if (this.isZero()) return '0';
    let str = this.pos ? '' : '-';
    if (this.exp >= 0) {
      str += [...this.digits].join('');
      for (let i = 1; i <= this.exp; i += 1) {
        str += '0';
      }
      return str;
    }
    const numDig = this.digits.size();
    if (-this.exp >= numDig) {
      str += '0.';
      for (let i = 1; i <= -this.exp - numDig; i += 1) {
        str += '0';
      }
      str += [...this.digits].join('');
      return str;
    }
    const [left, right] = this.digits.split(numDig + this.exp);
    str += [...left].join('');
    str += '.';
    str += [...right].join('');
    return str;
  }

  // assumes this is trimmed
  roundWithFunc(
    prec: Precision,
    shouldRoundAwayFromZero: (d: number, pos: boolean) => boolean,
  ): RealNum {
    if (this.isZero()) return RealNum.zero;
    if (prec === NegInfPrec) {
      // deciding number is certainly 0 here
      const roundAway = shouldRoundAwayFromZero(0, this.pos);
      if (roundAway) {
        throw new Error(
          `Cannot infinitely round ${this.toString()} away from zero`,
        );
      }
      return RealNum.zero;
    }
    if (this.prec().le(prec)) return this;

    // since prec < this.prec() and prec != -inf
    // prec is a RegularPrec
    const precNum = downCast(prec, RegularPrec).prec;

    // the deciding digit's position
    // is position after decimal adjusted by prec
    const decidingPos = this.sizeNonZero() + precNum;
    // since !(this.prec() <= prec),
    // this.prec() > precNum
    // so decidingPos < digits.size() = this.size() + this.prec()

    if (decidingPos < 0) {
      // the deciding number is before start of
      // the number, so is 0
      const roundAway = shouldRoundAwayFromZero(0, this.pos);
      if (roundAway) {
        return new RealNum(this.pos, Digits.fromIter([1]), -precNum);
      }
      return RealNum.zero;
    }

    // now we are guaranteed to have a digit in the digits list to have to decide on
    // ie. 0 <= decidingPos < digits.size()
    const [left, right] = this.digits.split(decidingPos);
    const decidingDig = right.head();
    const roundAway = shouldRoundAwayFromZero(decidingDig, this.pos);
    if (roundAway) {
      return RealNum.fromDigits(this.pos, left.add1(), -precNum);
    }
    return RealNum.fromDigits(this.pos, left, -precNum);
  }

  // assumes this is trimmed
  round(prec: Precision): RealNum {
    return this.roundWithFunc(prec, (d, _pos) => d >= 5);
  }

  // assumes this is trimmed
  ceil(prec: Precision): RealNum {
    return this.roundWithFunc(prec, (_d, pos) => pos);
  }

  // assumes this is trimmed
  floor(prec: Precision): RealNum {
    return this.roundWithFunc(prec, (_d, pos) => !pos);
  }

  // assumes this is trimmed
  trunc(prec: Precision): RealNum {
    return this.roundWithFunc(prec, (_d, _pos) => false);
  }
}

Object.freeze(RealNum);
