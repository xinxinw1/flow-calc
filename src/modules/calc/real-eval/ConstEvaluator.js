// @flow

import CalcEnvironment from '../CalcEnvironment';
import GeneratorEvaluator from './GeneratorEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import RealNum from '../RealNum';
import {
  type ZeroTestResult,
  NonZeroResult,
  ZeroResult,
} from '../ZeroTestResult';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export default class ConstEvaluator
  extends GeneratorEvaluator
  implements RealEvaluator
{
  v: RealNum;

  constructor(env: CalcEnvironment, v: RealNum) {
    super(env);
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
