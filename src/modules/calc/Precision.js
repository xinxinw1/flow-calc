// @flow

import { downCast, unknownSubtype } from '../typetools';
import AbstractClass from '../AbstractClass';

export default class Precision extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(Precision);
  }

  equals(other: Precision): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.equalsSameClass(other);
  }

  equalsSameClass(_other: Precision): boolean {
    return this.abstractMethod(this.equalsSameClass);
  }

  le(_other: Precision): boolean {
    return this.abstractMethod(this.equalsSameClass);
  }
}

class InfPrecType extends Precision {
  constructor() {
    super();
    Object.freeze(this);
  }

  // eslint-disable-next-line class-methods-use-this
  equalsSameClass(_other: Precision): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  le(other: Precision): boolean {
    if (other instanceof InfPrecType) {
      return true;
    }
    return false;
  }
}

export const InfPrec: InfPrecType = new InfPrecType();

class NegInfPrecType extends Precision {
  constructor() {
    super();
    Object.freeze(this);
  }

  // eslint-disable-next-line class-methods-use-this
  equalsSameClass(_other: Precision): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  le(_other: Precision): boolean {
    return true;
  }
}

export const NegInfPrec: NegInfPrecType = new NegInfPrecType();

export class RegularPrec extends Precision {
  prec: number;

  constructor(prec: number) {
    super();
    this.prec = prec;
    Object.freeze(this);
  }

  equalsSameClass(other: Precision): boolean {
    const otherCasted = downCast<Precision, _>(other, RegularPrec);
    return this.prec === otherCasted.prec;
  }

  le(other: Precision): boolean {
    if (other instanceof RegularPrec) {
      return this.prec <= other.prec;
    }
    if (other === InfPrec) {
      return true;
    }
    if (other === NegInfPrec) {
      return false;
    }
    return unknownSubtype(other, Precision);
  }
}
