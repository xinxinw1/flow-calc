// @flow

import type RealExpr from './real-expr/RealExpr';
import RealEvalObj from './real-eval/RealEvalObj';

export type EnvOptions = {|
  precMargin: number,
|};

export default class Environment {
  realExprCache: Map<string, RealEvalObj> = new Map();
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

  getRealEvalObj(expr: RealExpr): RealEvalObj {
    const exprStr = expr.uniqString();
    const possibleEvalObj = this.realExprCache.get(exprStr);
    if (possibleEvalObj) {
      return possibleEvalObj;
    }
    const evalObj = expr.makeEvalObj(this);
    this.realExprCache.set(exprStr, evalObj);
    return evalObj;
  }
}
