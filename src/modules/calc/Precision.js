// @flow

import { unknownSubtype } from '../typetools';
import AbstractClass from '../AbstractClass';
import ExtInteger, { RegularInt, InfInt, NegInfInt } from './ExtInteger';

export default class Precision extends AbstractClass {
  n: ExtInteger;

  constructor(n: ExtInteger) {
    super();
    this.n = n;
    this.abstractClass(Precision);
  }

  equals(other: Precision): boolean {
    return this.n.equals(other.n);
  }

  le(other: Precision): boolean {
    return this.n.le(other.n);
  }

  add(other: number | Precision): Precision {
    let result = new RegularInt(0);
    if (other instanceof Precision) {
      result = this.n.add(other.n);
    } else {
      result = this.n.add(other);
    }
    if (result === InfInt) return InfPrec;
    if (result === NegInfInt) return NegInfPrec;
    if (result instanceof RegularInt) {
      return new RegularPrec(result.n);
    }
    return unknownSubtype(result, ExtInteger);
  }
}

class InfPrecType extends Precision {
  constructor() {
    super(InfInt);
    Object.freeze(this);
  }
}

export const InfPrec: InfPrecType = new InfPrecType();

class NegInfPrecType extends Precision {
  constructor() {
    super(NegInfInt);
    Object.freeze(this);
  }
}

export const NegInfPrec: NegInfPrecType = new NegInfPrecType();

export class RegularPrec extends Precision {
  prec: number;

  constructor(prec: number) {
    super(new RegularInt(prec));
    this.prec = prec;
    Object.freeze(this);
  }
}
