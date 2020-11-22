// @flow

import RealExpr from './RealExpr';
import RealNum from '../RealNum';
import RealEvalObj from '../real-eval/RealEvalObj';
import ConstEvalObj from '../real-eval/ConstEvalObj';
import type Environment from '../Environment';

export default class ConstExpr extends RealExpr {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
    Object.freeze(this);
  }

  uniqString(): string {
    return this.abstractMethod(this.uniqString);
  }

  makeEvalObj(_env: Environment): RealEvalObj {
    return new ConstEvalObj(this.v);
  }
}
