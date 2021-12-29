// @flow

import GeneratorEvaluator from './GeneratorEvaluator';
import RealNum from '../RealNum';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';
import { type Size } from '../Size';

export default class ConstEvaluator extends GeneratorEvaluator {
  v: RealNum;

  constructor(v: RealNum) {
    super();
    this.v = v;
  }

  makeEvalGenerator(): RealGenerator {
    return makeInstantGen(this.v);
  }

  maxSize(): Size {
    return this.v.size();
  }
}
