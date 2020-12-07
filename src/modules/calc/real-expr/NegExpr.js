// @flow

import RealExpr from './RealExpr';
import { type RealEvaluator } from '../real-eval/RealEvaluator';
import NegEvaluator from '../real-eval/NegEvaluator';
import type Environment from '../Environment';

export default class NegExpr extends RealExpr {
  a: RealExpr;

  constructor(a: RealExpr) {
    super();
    this.a = a;
    Object.freeze(this);
  }

  uniqString(): string {
    return `Neg(${this.a.uniqString()})`;
  }

  makeEvaluator(env: Environment): RealEvaluator {
    return new NegEvaluator(env.getRealEvaluator(this.a));
  }
}
