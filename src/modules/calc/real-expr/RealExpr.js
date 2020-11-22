// @flow

import AbstractClass from '../../AbstractClass';
import RealEvalObj from '../real-eval/RealEvalObj';
import type Environment from '../Environment';

export default class RealExpr extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(RealExpr);
  }

  uniqString(): string {
    return this.abstractMethod(this.uniqString);
  }

  makeEvalObj(_env: Environment): RealEvalObj {
    return this.abstractMethod(this.makeEvalObj);
  }
}
