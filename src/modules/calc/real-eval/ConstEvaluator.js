// @flow

import RealClassEvaluator from './RealClassEvaluator';
import RealNum from '../RealNum';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';

export default class ConstEvaluator extends RealClassEvaluator {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
  }

  makeOutputGenerator(): RealGenerator {
    return makeInstantGen(this.v);
  }
}
