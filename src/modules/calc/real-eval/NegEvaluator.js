// @flow

import {
  type RealEvalResult,
  RealRegularResult,
  RealDivisionByZeroResult,
} from '../RealEvalResult';
import { type RealEvaluator } from './RealEvaluator';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export default class NegEvaluator implements RealEvaluator {
  aEval: RealEvaluator;

  constructor(aEval: RealEvaluator) {
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
}
