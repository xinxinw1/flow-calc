// @flow

import { absurd } from '../typetools';
import { type ExtInteger, RegularInt, InfInt, NegInfInt } from './ExtInteger';

class SizeBase {
  n: ExtInteger;

  constructor(n: ExtInteger) {
    this.n = n;
  }

  static makeSize(n: ExtInteger): Size {
    if (n instanceof RegularInt) {
      return new RegularSize(n.n);
    } else if (n instanceof InfInt) {
      throw new Error('Size cannot be infinite');
    } else if (n instanceof NegInfInt) {
      return new NegInfSize();
    } else {
      return absurd(n);
    }
  }

  equals(other: Size): boolean {
    return this.n.equals(other.n);
  }

  le(other: Size): boolean {
    return this.n.le(other.n);
  }

  gt(other: Size): boolean {
    return this.n.gt(other.n);
  }

  ge(other: Size): boolean {
    return this.n.ge(other.n);
  }

  lt(other: Size): boolean {
    return this.n.lt(other.n);
  }

  add(other: number | Size): Size {
    const otherInt = typeof other === 'number' ? other : other.n;
    return SizeBase.makeSize(this.n.add(otherInt));
  }

  max(other: number | Size): Size {
    const otherInt = typeof other === 'number' ? other : other.n;
    return SizeBase.makeSize(this.n.max(otherInt));
  }
}

export class RegularSize extends SizeBase {
  size: number;

  constructor(size: number) {
    super(new RegularInt(size));
    this.size = size;
    Object.freeze(this);
  }
}

export class NegInfSize extends SizeBase {
  constructor() {
    super(new NegInfInt());
    Object.freeze(this);
  }
}

export type Size = RegularSize | NegInfSize;
