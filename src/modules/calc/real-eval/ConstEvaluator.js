// @flow

import CalcEnvironment from '../CalcEnvironment';
import { type Precision } from '../Precision';
import { type RealGenerator, makeInstantGen } from '../RealGenerator';
import RealNum from '../RealNum';
import { type Size } from '../Size';
import {
  type ZeroTestResult,
  NonZeroResult,
  ZeroResult,
} from '../ZeroTestResult';

import GeneratorEvaluator from './GeneratorEvaluator';
import { type RealEvaluator } from './RealEvaluator';

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
