// @flow

import AbstractClass from '../AbstractClass';

export class Size extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(Size);
  }

  equals(other: Size): boolean {
    if (this.constructor !== other.constructor) return false;
    return this.equalsSameClass(other);
  }

  equalsSameClass(other: Size): boolean {
    return this.abstractMethod(this.equalsSameClass);
  }
}

export class RegularSize extends Size {
  size: number;

  constructor(size: number) {
    super();
    this.size = size;
    Object.freeze(this);
  }

  equalsSameClass(other: Size): boolean {
    const otherRegSize = (other: RegularSize);
    return this.size === otherRegSize.size;
  }
}

class NegInfSizeType extends Size {
  constructor() {
    super();
    Object.freeze(this);
  }

  equalsSameClass(other: Size): boolean {
    return true;
  }
}

export const NegInfSize: NegInfSizeType = new NegInfSizeType();
