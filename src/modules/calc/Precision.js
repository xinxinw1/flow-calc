// @flow

import { downCast } from '../typetools';
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
}

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
}

export const InfPrec: InfPrecType = new InfPrecType();
