// @flow

import RealExpr from './RealExpr';
import { type RealEvaluator } from '../real-eval/RealEvaluator';
import AddEvaluator from '../real-eval/AddEvaluator';
import type Environment from '../Environment';

export default class AddExpr extends RealExpr {
  a: RealExpr;
  b: RealExpr;

  constructor(a: RealExpr, b: RealExpr) {
    super();
    this.a = a;
    this.b = b;
    Object.freeze(this);
  }

  uniqString(): string {
    const strs = [this.a, this.b].map((expr) => expr.uniqString());
    strs.sort();
    return `Add(${strs.join(',')})`;
  }

  makeEvaluator(env: Environment): RealEvaluator {
    return new AddEvaluator(
      env.getRealEvaluator(this.a),
      env.getRealEvaluator(this.b),
    );
  }
}
