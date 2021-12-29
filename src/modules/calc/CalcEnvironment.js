// @flow

import { type RealEvaluator } from './real-eval/RealEvaluator';
import type RealExpr from './real-expr/RealExpr';

export type CalcEnvOptions = {
  zeroTestAdditionalPrecLimit: number,
};

export default class CalcEnvironment {
  realExprCache: Map<string, RealEvaluator> = new Map();
  options: CalcEnvOptions;

  constructor(options: CalcEnvOptions) {
    this.options = options;
    Object.freeze(this);
  }

  getRealEvaluator(expr: RealExpr): RealEvaluator {
    const exprStr = expr.uniqString();
    const possibleEvaluator = this.realExprCache.get(exprStr);
    if (possibleEvaluator) {
      return possibleEvaluator;
    }
    const evaluator = expr.makeEvaluator(this);
    this.realExprCache.set(exprStr, evaluator);
    return evaluator;
  }
}
