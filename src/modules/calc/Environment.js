// @flow

import type RealExpr from './real-expr/RealExpr';
import RealEvalObj from './real-eval/RealEvalObj';

export default class Environment {
  realExprCache: Map<string, RealEvalObj> = new Map();

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
