// @flow

import AbstractClass from '../../AbstractClass';
import type CalcEnvironment from '../CalcEnvironment';
import { type RealEvaluator } from '../real-eval/RealEvaluator';

export default class RealExpr extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(RealExpr);
  }

  uniqString(): string {
    return this.abstractMethod('uniqString');
  }

  makeEvaluator(env: CalcEnvironment): RealEvaluator {
    return this.abstractMethod('makeEvaluator', env);
  }
}
