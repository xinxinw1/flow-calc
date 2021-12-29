// @flow

import type CalcEnvironment from '../CalcEnvironment';
import RealNum from '../RealNum';
import ConstEvaluator from '../real-eval/ConstEvaluator';
import { type RealEvaluator } from '../real-eval/RealEvaluator';

import RealExpr from './RealExpr';

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
