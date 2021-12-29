// @flow

import type CalcEnvironment from '../CalcEnvironment';
import NegEvaluator from '../real-eval/NegEvaluator';
import { type RealEvaluator } from '../real-eval/RealEvaluator';

import RealExpr from './RealExpr';

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

  makeEvaluator(env: CalcEnvironment): RealEvaluator {
    return new NegEvaluator(env, env.getRealEvaluator(this.a));
  }
}
