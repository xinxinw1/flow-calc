// @flow

import AbstractClass from '../../AbstractClass';
import { type RealEvaluator } from '../real-eval/RealEvaluator';
import type Environment from '../Environment';

export default class RealExpr extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(RealExpr);
  }

  uniqString(): string {
    return this.abstractMethod(this.uniqString);
  }

  makeEvaluator(_env: Environment): RealEvaluator {
    return this.abstractMethod(this.makeEvaluator);
  }
}
