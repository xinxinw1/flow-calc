// @flow

import RealEvalObj from './RealEvalObj';
import RealNum from '../RealNum';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';

export default class ConstEvalObj extends RealEvalObj {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
  }

  makeOutputGenerator(): RealGenerator {
    return makeInstantGen(this.v);
  }
}
