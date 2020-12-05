// @flow

import { downCast, unknownSubtype } from '../typetools';
import AbstractClass from '../AbstractClass';

export default class ExtInteger extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(ExtInteger);
  }

  equals(other: ExtInteger): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.equalsSameClass(other);
  }

  equalsSameClass(_other: ExtInteger): boolean {
    return this.abstractMethod(this.equalsSameClass);
  }

  le(_other: ExtInteger): boolean {
    return this.abstractMethod(this.equalsSameClass);
  }

  add(_other: number | ExtInteger): ExtInteger {
    return this.abstractMethod(this.equalsSameClass);
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
}