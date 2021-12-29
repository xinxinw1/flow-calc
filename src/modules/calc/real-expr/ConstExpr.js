// @flow

import RealExpr from './RealExpr';
import RealNum from '../RealNum';
import { type RealEvaluator } from '../real-eval/RealEvaluator';
import ConstEvaluator from '../real-eval/ConstEvaluator';
import type CalcEnvironment from '../CalcEnvironment';

export default class ConstExpr extends RealExpr {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
    Object.freeze(this);
  }

  uniqString(): string {
    return this.v.toString();
  }

  makeEvaluator(env: CalcEnvironment): RealEvaluator {
    return new ConstEvaluator(env, this.v);
  }
}
