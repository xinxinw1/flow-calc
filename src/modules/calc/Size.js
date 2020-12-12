// @flow

import { unknownSubtype } from '../typetools';
import AbstractClass from '../AbstractClass';
import ExtInteger, { RegularInt, InfInt, NegInfInt } from './ExtInteger';

export default class Size extends AbstractClass {
  n: ExtInteger;

  constructor(n: ExtInteger) {
    super();
    if (n === InfInt) {
      throw new Error('Size cannot be infinite');
    }
    this.n = n;
    this.abstractClass(Size);
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
    let result: ExtInteger;
    if (other instanceof Size) {
      result = this.n.add(other.n);
    } else {
      result = this.n.add(other);
    }
    if (result === NegInfInt) return NegInfSize;
    if (result instanceof RegularInt) {
      return new RegularSize(result.n);
    }
    return unknownSubtype(result, ExtInteger);
  }

  max(other: number | Size): Size {
    let result: ExtInteger;
    if (other instanceof Size) {
      result = this.n.max(other.n);
    } else {
      result = this.n.max(other);
    }
    if (result === NegInfInt) return NegInfSize;
    if (result instanceof RegularInt) {
      return new RegularSize(result.n);
    }
    return unknownSubtype(result, ExtInteger);
  }
}

class NegInfSizeType extends Size {
  constructor() {
    super(NegInfInt);
    Object.freeze(this);
  }
}

export const NegInfSize: NegInfSizeType = new NegInfSizeType();

export class RegularSize extends Size {
  size: number;

  constructor(size: number) {
    super(new RegularInt(size));
    this.size = size;
    Object.freeze(this);
  }
}
