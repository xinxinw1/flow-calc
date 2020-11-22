// @flow

import AbstractClass from '../AbstractClass';

export class Size extends AbstractClass {
  constructor() {
    super();
    this.assertAbstract(Size);
  }
}

export class RegularSize extends Size {
  size: number;

  constructor(size: number) {
    super();
    this.size = size;
    Object.freeze(this);
  }
}

class NegInfSizeType extends Size {
  constructor() {
    super();
    Object.freeze(this);
  }
}

export const NegInfSize: NegInfSizeType = new NegInfSizeType();
