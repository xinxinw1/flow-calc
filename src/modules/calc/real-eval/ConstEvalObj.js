// @flow

import RealEvalObj from './RealEvalObj';
import RealNum from '../RealNum';
import Precision from '../Precision';

export default class ConstEvalObj extends RealEvalObj {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
    Object.freeze(this);
  }

  *makeOutputGenerator(): Generator<RealNum, RealNum, Precision> {
    yield RealNum.zero;
    return this.v;
  }
}
