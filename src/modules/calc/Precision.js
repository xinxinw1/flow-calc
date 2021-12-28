// @flow

import { absurd } from '../typetools';
import { type ExtInteger, RegularInt, InfInt, NegInfInt } from './ExtInteger';

class PrecBase {
  n: ExtInteger;

  constructor(n: ExtInteger) {
    this.n = n;
  }

  static makePrec(n: ExtInteger): Precision {
    if (n instanceof RegularInt) {
      return new RegularPrec(n.n);
    } else if (n instanceof InfInt) {
      return new InfPrec();
    } else if (n instanceof NegInfInt) {
      return new NegInfPrec();
    } else {
      return absurd(n);
    }
  }

  equals(other: Precision): boolean {
    return this.n.equals(other.n);
  }

  le(other: Precision): boolean {
    return this.n.le(other.n);
  }

  gt(other: Precision): boolean {
    return this.n.gt(other.n);
  }

  ge(other: Precision): boolean {
    return this.n.ge(other.n);
  }

  lt(other: Precision): boolean {
    return this.n.lt(other.n);
  }

  add(other: number | Precision): Precision {
    const otherInt = typeof other === 'number' ? other : other.n;
    return PrecBase.makePrec(this.n.add(otherInt));
  }
}

export class RegularPrec extends PrecBase {
  prec: number;

  constructor(prec: number) {
    super(new RegularInt(prec));
    this.prec = prec;
    Object.freeze(this);
  }
}

export class InfPrec extends PrecBase {
  constructor() {
    super(new InfInt());
    Object.freeze(this);
  }
}

export class NegInfPrec extends PrecBase {
  constructor() {
    super(new NegInfInt());
    Object.freeze(this);
  }
}

export type Precision = RegularPrec | InfPrec | NegInfPrec;
