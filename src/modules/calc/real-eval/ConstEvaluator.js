// @flow

import GeneratorEvaluator from './GeneratorEvaluator';
import RealNum from '../RealNum';
import {
  type ZeroTestResult,
  NonZeroResult,
  ZeroResult,
} from '../ZeroTestResult';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';
import { type Precision } from '../Precision';
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

  testZeroness(_: Precision): ZeroTestResult {
    if (this.v.isZero()) return new ZeroResult();
    return new NonZeroResult(this.v.pos, this.v.size());
  }
}
