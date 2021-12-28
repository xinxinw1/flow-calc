// @flow

import { downCast, unknownSubtype } from '../typetools';
import AbstractClass from '../AbstractClass';

export default class ExtInteger extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(ExtInteger);
  }

  equals(other: ExtInteger): boolean {
    /* $FlowIgnore[method-unbinding] comparing constructors
         seems to be the recommended way to do this */
    if (this.constructor !== other.constructor) return false;
    return this.equalsSameClass(other);
  }

  equalsSameClass(other: ExtInteger): boolean {
    return this.abstractMethod('equalsSameClass', other);
  }

  le(other: ExtInteger): boolean {
    return this.abstractMethod('le', other);
  }

  gt(other: ExtInteger): boolean {
    return !this.le(other);
  }

  ge(other: ExtInteger): boolean {
    return other.le(this);
  }

  lt(other: ExtInteger): boolean {
    return !this.ge(other);
  }

  add(other: number | ExtInteger): ExtInteger {
    return this.abstractMethod('add', other);
  }

  max(other: number | ExtInteger): ExtInteger {
    return this.abstractMethod('max', other);
  }
}

class InfIntType extends ExtInteger {
  constructor() {
    super();
    Object.freeze(this);
  }

  // eslint-disable-next-line class-methods-use-this
  equalsSameClass(_other: ExtInteger): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  le(other: ExtInteger): boolean {
    if (other instanceof InfIntType) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  add(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      if (other === NegInfInt) {
        throw new Error('cannot add inf integer with neg inf integer');
      }
      return InfInt;
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return InfInt;
  }

  // eslint-disable-next-line class-methods-use-this
  max(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      return InfInt;
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return InfInt;
  }
}

export const InfInt: InfIntType = new InfIntType();

class NegInfIntType extends ExtInteger {
  constructor() {
    super();
    Object.freeze(this);
  }

  // eslint-disable-next-line class-methods-use-this
  equalsSameClass(_other: ExtInteger): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  le(_other: ExtInteger): boolean {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  add(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      if (other === InfInt) {
        throw new Error('cannot add inf integer with neg inf integer');
      }
      return NegInfInt;
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return NegInfInt;
  }

  // eslint-disable-next-line class-methods-use-this
  max(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      return other;
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return new RegularInt(other);
  }
}

export const NegInfInt: NegInfIntType = new NegInfIntType();

export class RegularInt extends ExtInteger {
  n: number;

  constructor(n: number) {
    super();
    if (!Number.isInteger(n)) {
      throw new Error(`Number ${n} must be an integer`);
    }
    this.n = n;
    Object.freeze(this);
  }

  equalsSameClass(other: ExtInteger): boolean {
    const otherCasted = downCast(other, RegularInt);
    return this.n === otherCasted.n;
  }

  le(other: ExtInteger): boolean {
    if (other instanceof RegularInt) {
      return this.n <= other.n;
    }
    if (other === InfInt) {
      return true;
    }
    if (other === NegInfInt) {
      return false;
    }
    return unknownSubtype(other, ExtInteger);
  }

  add(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      if (other === InfInt) {
        return InfInt;
      }
      if (other === NegInfInt) {
        return NegInfInt;
      }
      if (other instanceof RegularInt) {
        return new RegularInt(this.n + other.n);
      }
      return unknownSubtype(other, ExtInteger);
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return new RegularInt(this.n + other);
  }

  max(other: number | ExtInteger): ExtInteger {
    if (other instanceof ExtInteger) {
      if (other === InfInt) {
        return InfInt;
      }
      if (other === NegInfInt) {
        return this;
      }
      if (other instanceof RegularInt) {
        return new RegularInt(Math.max(this.n, other.n));
      }
      return unknownSubtype(other, ExtInteger);
    }
    if (!Number.isInteger(other)) {
      throw new Error(`number ${other} must be an integer`);
    }
    return new RegularInt(Math.max(this.n, other));
  }
}
