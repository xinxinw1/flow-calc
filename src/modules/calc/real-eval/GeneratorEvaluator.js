// @flow

import assert from 'assert';

import CalcEnvironment from '../CalcEnvironment';
import { type RealGenerator } from '../RealGenerator';
import BaseEvaluator from './BaseEvaluator';
import RealGeneratorState from '../RealGeneratorState';
import {
  type RealEvalResult,
  RealDivisionByZeroResult,
  RealRegularResult,
} from '../RealEvalResult';
import {
  type ZeroTestResult,
  ZeroResult,
  NonZeroResult,
  DivisionByZeroResult,
} from '../ZeroTestResult';
import { type Precision } from '../Precision';

// Creates a RealEvaluator from a makeEvalGenerator() method.
// The generator can't be passed in as a constructor parameter
// because we want to be able to define it as a class method.
// Note that even if the generator could be passed in as a
// parameter, it still needs to be abstract because
// the generator isn't enough to define maxSize()
export default class GeneratorEvaluator extends BaseEvaluator {
  realGenState: ?RealGeneratorState;

  constructor(env: CalcEnvironment) {
    super(env);
    this.abstractClass(GeneratorEvaluator);
  }

  // must satisfy the input conditions for RealEvaluator
  makeEvalGenerator(): RealGenerator {
    return this.abstractMethod('makeEvalGenerator');
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): RealEvalResult {
    if (!this.realGenState) {
      // can't call this in constructor because
      // subclass instance vars aren't ready yet
      this.realGenState = new RealGeneratorState(this.makeEvalGenerator());
    }
    return this.realGenState.eval(prec);
  }

  testZeroness(prec: Precision): ZeroTestResult {
    const additionalZeroTestPrec = 25;
    const res = this.eval(prec.add(additionalZeroTestPrec));
    if (res instanceof RealDivisionByZeroResult) {
      return new DivisionByZeroResult(res.assumedDiscontinuity);
    } else {
      (res: RealRegularResult);
      if (res.isDone()) {
        if (res.value.isZero()) {
          return new ZeroResult();
        } else {
          return new NonZeroResult(res.value.pos, res.value.size());
        }
      }

      if (res.value.isZero()) {
        // when value is zero and we're not
        // at infinite precision, then
        // we've assumed a discontinuity
        return new ZeroResult(true);
      }
      assert(res.value.numDigits() >= 1);
      assert(res.value.nat.last() !== 0);
      // If numDigits is exactly 1,
      // and if the one digit is exactly 1,
      // the size might decrease by 1 with
      // more precision.
      //
      // Otherwise, the result is guaranteed to not
      // decrease in size with greater precision.
      let minSize = res.value.size();
      if (res.value.numDigits() === 1 && res.value.nat.last() === 1) {
        minSize = minSize.add(-1);
      }
      return new NonZeroResult(
        res.value.pos,
        minSize,
        res.assumedDiscontinuity,
      );
    }
  }
}
