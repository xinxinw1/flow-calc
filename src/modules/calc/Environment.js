// @flow

import type RealExpr from './real-expr/RealExpr';
import { type RealEvaluator } from './real-eval/RealEvaluator';

export type EnvOptions = {|
  precMargin: number,
|};

export default class Environment {
  realExprCache: Map<string, RealEvaluator> = new Map();
  precMargin: number;

  constructor(options: EnvOptions) {
    if (options.precMargin < 0 || !Number.isInteger(options.precMargin)) {
      throw new Error(
        `precMargin ${options.precMargin} must be a natural number`,
      );
    }
    this.precMargin = options.precMargin;
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
