// @flow

import RealEvalObj from './RealEvalObj';
import RealNum from '../RealNum';
import { type RealGenerator } from '../RealGenerator';

export default class ConstEvalObj extends RealEvalObj {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
    Object.freeze(this);
  }

  *makeOutputGenerator(): RealGenerator {
    yield RealNum.zero;
    return this.v;
  }
}
