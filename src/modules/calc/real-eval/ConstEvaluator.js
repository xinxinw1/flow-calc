// @flow

import RealGenClassEvaluator from './RealGenClassEvaluator';
import RealNum from '../RealNum';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';
import Size from '../Size';

export default class ConstEvaluator extends RealGenClassEvaluator {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
  }

  makeOutputGenerator(): RealGenerator {
    return makeInstantGen(this.v);
  }

  maxSize(): Size {
    // add 1 because of possible rounding at the start
    return this.v.size().add(1);
  }
}
