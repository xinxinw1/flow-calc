// @flow

import nullthrows from 'nullthrows';

import { downCast } from '../typetools';
import NatNum from './NatNum';
import NatNumDigits from './NatNumDigits';
import Size, { RegularSize, NegInfSize } from './Size';
import Precision, { RegularPrec, NegInfPrec } from './Precision';

const NatNumImpl = NatNumDigits;

export default class RealNum {
  pos: boolean;
  nat: NatNum;
  exp: number;

  constructor(pos: boolean, nat: NatNum, exp: number) {
    this.pos = pos;
    this.nat = nat;
    this.exp = exp;
    Object.freeze(this);
  }

  static zero: RealNum = new RealNum(true, NatNumImpl.zero, 0);
  static one: RealNum = RealNum.fromNum(1);

  static fromNat(pos: boolean, nat: NatNum, exp: number): RealNum {
    return new RealNum(pos, nat, exp).trim();
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

    let str = '';
    let exp: number = 0;

    for (let i = start; i < s.length; i += 1) {
      if (s[i] === '.') {
        exp = -(s.length - 1 - i);
      } else {
        str += s[i];
      }
    }

    let startPos = 0;
    while (startPos < str.length && str[startPos] === '0') {
      startPos += 1;
    }

    str = str.substring(startPos);

    let endPos = str.length;
    while (endPos > 0 && str[endPos - 1] === '0') {
      endPos -= 1;
      exp += 1;
    }

    str = str.substring(0, endPos);

    const nat = NatNumImpl.fromStr(str);

    return RealNum.fromNat(pos, nat, exp);
  }

  static digitAtPrec(pos: boolean, dig: number, prec: Precision): RealNum {
    if (!(prec instanceof RegularPrec)) {
      throw new Error('digitAtPrec must be given a regular prec');
    }
    const precNum = prec.prec;
    return RealNum.fromNat(pos, NatNumImpl.fromNum(dig), 0 - precNum);
  }

  trim(): RealNum {
    let changed = false;
    let { nat, exp } = this;
    const { pos } = this;

    if (nat.isZero()) return RealNum.zero;

    // trim right side
    // at this point nat cannot be zero
    while (nat.last() === 0) {
      changed = true;
      nat = nat.init();
      exp += 1;
    }

    if (!changed) return this;

    return new RealNum(pos, nat, exp);
  }

  isZero(): boolean {
    return this.nat.isZero();
  }

  // assumes this and other are trimmed
  equals(other: RealNum): boolean {
    return (
      this.exp === other.exp &&
      this.pos === other.pos &&
      this.nat.equals(other.nat)
    );
  }

  // assumes this and other are trimmed
  // returns 1 if this > other,
  // 0 if this == other,
  // -1 if this < other
  compare(other: RealNum): number {
    if (this.pos === other.pos) {
      // both positive or both negative
      const smallerExp = Math.min(this.exp, other.exp);
      const thisRightWait = this.exp - smallerExp;
      const otherRightWait = other.exp - smallerExp;
      let outputCompare = NatNumImpl.compare(
        this.nat,
        other.nat,
        thisRightWait,
        otherRightWait,
      );
      if (!this.pos) {
        outputCompare = 0 - outputCompare;
      }
      return outputCompare;
    }
    if (this.pos && !other.pos) {
      return 1;
    }
    return -1;
  }

  gt(other: RealNum): boolean {
    return this.compare(other) > 0;
  }

  ge(other: RealNum): boolean {
    return this.compare(other) >= 0;
  }

  lt(other: RealNum): boolean {
    return this.compare(other) < 0;
  }

  le(other: RealNum): boolean {
    return this.compare(other) <= 0;
  }

  // returns trimmed version if this is trimmed
  neg(): RealNum {
    if (this.isZero()) return RealNum.zero;
    return new RealNum(!this.pos, this.nat, this.exp);
  }

  // assumes this is trimmed
  size(): Size {
    if (this.isZero()) return NegInfSize;
    return new RegularSize(this.nat.size() + this.exp);
  }

  // assumes this is trimmed
  // sizeNonZero() + precNonZero() = digits.size()
  sizeNonZero(): number {
    if (this.isZero()) {
      throw new Error('sizeNonZero not defined for 0');
    }
    return this.nat.size() + this.exp;
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
    const natStr = this.nat.toString();
    if (this.exp >= 0) {
      str += natStr;
      for (let i = 1; i <= this.exp; i += 1) {
        str += '0';
      }
      return str;
    }
    const numDig = natStr.length;
    if (-this.exp >= numDig) {
      str += '0.';
      for (let i = 1; i <= -this.exp - numDig; i += 1) {
        str += '0';
      }
      str += natStr;
      return str;
    }
    const splitPos = numDig + this.exp;
    str += natStr.substring(0, splitPos);
    str += '.';
    str += natStr.substring(splitPos);
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

    // we already have this.prec() > prec so can subtract
    // and get > 0 value
    const numToShift = this.precNonZero() - precNum;
    const [shiftedNat, shiftedNums] = this.nat.shiftRight(numToShift);

    // guaranteed to exist since numToShift > 0
    const decidingDig = nullthrows(shiftedNums[0]);

    const roundAway = shouldRoundAwayFromZero(decidingDig, this.pos);
    if (roundAway) {
      return RealNum.fromNat(this.pos, shiftedNat.add1(), -precNum);
    }
    return RealNum.fromNat(this.pos, shiftedNat, -precNum);
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

  // assumes this is trimmed
  // returns the digit before prec, and the real number after
  getNumAfterPrec(prec: Precision): [number, RealNum] {
    if (!(prec instanceof RegularPrec)) {
      throw new Error('digits after prec must be given a regular prec');
    }
    if (this.isZero()) return [0, RealNum.zero];

    const precNum = prec.prec;

    const numToSplit = this.precNonZero() - precNum;
    if (numToSplit < 0) {
      // splitting after end of number
      return [0, RealNum.zero];
    }
    const [left, right] = this.nat.splitRight(numToSplit);
    return [left.last(), RealNum.fromNat(this.pos, right, this.exp)];
  }

  // assumes this is trimmed
  // returns the digit before prec
  getDigitAtPrec(prec: Precision): number {
    const [lastDig, _numAfter] = this.getNumAfterPrec(prec);
    return lastDig;
  }

  add(other: RealNum): RealNum {
    if (this.isZero()) return other;
    if (other.isZero()) return this;
    if (this.pos === other.pos) {
      const outputPos = this.pos;
      const smallerExp = Math.min(this.exp, other.exp);
      const thisRightWait = this.exp - smallerExp;
      const otherRightWait = other.exp - smallerExp;
      const outputNat = NatNumImpl.add(
        this.nat,
        other.nat,
        thisRightWait,
        otherRightWait,
      );
      const outputExp = smallerExp;
      return RealNum.fromNat(outputPos, outputNat, outputExp);
    }
    if (this.pos && !other.pos) {
      return this.sub(other.neg());
    }
    return other.sub(this.neg());
  }

  sub(other: RealNum): RealNum {
    if (this.isZero()) return other.neg();
    if (other.isZero()) return this;
    if (this.pos === other.pos) {
      if (!this.pos) return this.neg().sub(other.neg()).neg();
      const comp = this.compare(other);
      if (comp === 0) return RealNum.zero;
      let a: RealNum;
      let b: RealNum;
      let outputPos: boolean;
      if (comp > 0) {
        a = this;
        b = other;
        outputPos = true;
      } else {
        a = other;
        b = this;
        outputPos = false;
      }
      const smallerExp = Math.min(a.exp, b.exp);
      const aRightWait = a.exp - smallerExp;
      const bRightWait = b.exp - smallerExp;
      const outputNat = NatNumImpl.sub(a.nat, b.nat, aRightWait, bRightWait);
      const outputExp = smallerExp;
      return RealNum.fromNat(outputPos, outputNat, outputExp);
    }
    // this is pos, other is neg
    // or this is neg, other is pos
    return this.add(other.neg());
  }

  mult(other: RealNum): RealNum {
    if (this.isZero() || other.isZero()) return RealNum.zero;
    const outputPos = this.pos === other.pos;
    const outputNat = NatNumImpl.mult(this.nat, other.nat);
    const outputExp = this.exp + other.exp;
    return RealNum.fromNat(outputPos, outputNat, outputExp);
  }

  // divides this / other rounded to prec precision
  // returns [quot, rem] at that precision
  // rem always same sign as this
  // and is < 10^-prec
  // this = quot * other + rem
  // quot.prec() <= prec
  div(other: RealNum, prec: Precision): [RealNum, RealNum] {
    if (other.isZero()) {
      throw new Error('cannot divide by zero');
    }
    if (this.isZero()) return [RealNum.zero, RealNum.zero];
    const outputPos = this.pos === other.pos;
    const expOffset = this.exp - other.exp;
    const [quotNat, quotExp, remNat, remExp] = NatNumImpl.div(
      this.nat,
      other.nat,
      prec.add(expOffset),
    );
    // this.nat = quotNat*10^quotExp * other.nat + remNat*10^remExp
    // this.nat*10^this.exp = quotNat*10^(quotExp+this.exp) * other.nat + remNat*10^(remExp+this.exp)
    // this = quotNat*10^(quotExp+this.exp-other.exp) * other.nat*10^other.exp + remNat*10^(remExp+this.exp)
    // this = quotNat*10^(quotExp+this.exp-other.exp) * other + remNat*10^(remExp+this.exp)
    return [
      RealNum.fromNat(outputPos, quotNat, quotExp + expOffset),
      RealNum.fromNat(this.pos, remNat, remExp + this.exp),
    ];
  }
}

Object.freeze(RealNum);
