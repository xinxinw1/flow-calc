// @flow

import type CalcEnvironment from '../CalcEnvironment';
import { type RealEvaluator } from '../real-eval/RealEvaluator';

import AddExpr from './AddExpr';
import NegExpr from './NegExpr';
import RealExpr from './RealExpr';

export default class SubExpr extends RealExpr {
  a: RealExpr;
  b: RealExpr;

  constructor(a: RealExpr, b: RealExpr) {
    super();
    this.a = a;
    this.b = b;
    Object.freeze(this);
  }

  uniqString(): string {
    return `Sub(${this.a.uniqString()},${this.b.uniqString()})`;
  }

  makeEvaluator(env: CalcEnvironment): RealEvaluator {
    return env.getRealEvaluator(new AddExpr(this.a, new NegExpr(this.b)));
  }
}
