// @flow

import CalcEnvironment from '../CalcEnvironment';
import {
  type RealEvalResult,
  RealRegularResult,
  RealDivisionByZeroResult,
} from '../RealEvalResult';
import {
  type ZeroTestResult,
  ZeroResult,
  NonZeroResult,
  DivisionByZeroResult,
} from '../ZeroTestResult';
import { type RealEvaluator } from './RealEvaluator';
import { type Precision } from '../Precision';
import { type Size } from '../Size';
import BaseEvaluator from './BaseEvaluator';

export default class NegEvaluator
  extends BaseEvaluator
  implements RealEvaluator
{
  aEval: RealEvaluator;

  constructor(env: CalcEnvironment, aEval: RealEvaluator) {
    super(env);
    this.aEval = aEval;
  }

  eval(prec: Precision): RealEvalResult {
    const aRes = this.aEval.eval(prec);
    if (aRes instanceof RealDivisionByZeroResult) {
      return aRes;
    } else {
      (aRes: RealRegularResult);
      return new RealRegularResult(
        aRes.value.neg(),
        aRes.precision,
        aRes.assumedDiscontinuity,
      );
    }
  }

  maxSize(): Size {
    return this.aEval.maxSize();
  }

  testZeroness(prec: Precision): ZeroTestResult {
    const aZeroness = this.aEval.testZeroness(prec);
    if (
      aZeroness instanceof DivisionByZeroResult ||
      aZeroness instanceof ZeroResult
    ) {
      return aZeroness;
    } else {
      (aZeroness: NonZeroResult);
      return new NonZeroResult(
        !aZeroness.positive,
        aZeroness.minSize,
        aZeroness.assumedDiscontinuity,
      );
    }
  }
}
