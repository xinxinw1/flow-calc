// @flow

import { izip } from '../itertools';
import FingerTree from '../FingerTree';
import Size, { RegularSize, NegInfSize } from './Size';

type DigitTree = FingerTree.Tree<number, number>;

// measures number of digits
const digitMeasure: FingerTree.Measure<number, number> = {
  plus: (x: number, y: number): number => x + y,
  measure: (_: number) => 1,
  zero: () => 0,
};

export default class RealNum {
  digits: DigitTree;
  exp: number;
  pos: boolean;

  constructor(digits: DigitTree, exp: number, pos: boolean) {
    this.digits = digits;
    this.exp = exp;
    this.pos = pos;
    Object.freeze(this);
  }

  trim(): RealNum {
    let changed = false;
    let { digits, exp } = this;
    const { pos } = this;

    if (digits.empty()) return RealNum.zero;

    // trim left side
    while (digits.head() === 0) {
      changed = true;
      digits = digits.tail();
      if (digits.empty()) return RealNum.zero;
    }

    // trim right side
    // at this point digits cannot be empty
    while (digits.last() === 0) {
      changed = true;
      digits = digits.init();
      exp += 1;
    }

    if (!changed) return this;

    return new RealNum(digits, exp, pos);
  }

  isZero(): boolean {
    return this.digits.empty();
  }

  equals(other: RealNum): boolean {
    const trim = this.trim();
    const otherTrim = other.trim();

    if (trim.exp !== otherTrim.exp || trim.pos !== otherTrim.pos) return false;

    if (trim.digits.measure() !== otherTrim.digits.measure()) return false;

    const zipped = izip(trim.digits, otherTrim.digits);

    for (const [d, otherD] of zipped) {
      if (d !== otherD) return false;
    }

    return true;
  }

  // returns trimmed version if this is trimmed
  neg(): RealNum {
    if (this.isZero()) return RealNum.zero;
    return new RealNum(this.digits, this.exp, !this.pos);
  }

  // assumes this is trimmed
  size(): Size {
    if (this.isZero()) return NegInfSize;
    return new RegularSize(this.digits.measure() - 1 + this.exp);
  }

  // assumes this is trimmed
  toString(): string {
    if (this.isZero()) return '0';
    let str = this.neg ? '-' : '';
    if (this.exp >= 0) {
      str += [...this.digits].join('');
      for (let i = 1; i <= this.exp; i += 1) {
        str += '0';
      }
      return str;
    }
    const numDig = this.digits.measure();
    if (-this.exp >= numDig) {
      str += '0.';
      for (let i = 1; i <= -this.exp - numDig; i += 1) {
        str += '0';
      }
      str += [...this.digits].join('');
      return str;
    }
    const [left, right] = this.digits.split((m) => m > numDig + this.exp);
    str += [...left].join('');
    str += '.';
    str += [...right].join('');
    return str;
  }

  static zero: RealNum = new RealNum(FingerTree.empty(digitMeasure), 0, true);
  static one: RealNum = RealNum.fromNum(1);

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

    const tree = FingerTree.from(digitMeasure, arr);

    return new RealNum(tree, exp, pos).trim();
  }
}

Object.freeze(RealNum);
