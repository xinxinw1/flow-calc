// @flow

import FingerTree from '../FingerTree';

type DigitTree = FingerTree.Tree<number, number>;

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
    let { digits, exp } = this;
    const { pos } = this;

    if (digits.empty()) return RealNum.zero;

    // trim left side
    while (digits.head() === 0) {
      digits = digits.tail();
      if (digits.empty()) return RealNum.zero;
    }

    // trim right side
    // at this point digits cannot be empty
    while (digits.last() === 0) {
      digits = digits.init();
      exp += 1;
    }

    return new RealNum(digits, exp, pos);
  }

  static zero: RealNum = new RealNum(FingerTree.empty(digitMeasure), 0, true);

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
