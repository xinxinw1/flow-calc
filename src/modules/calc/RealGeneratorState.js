// @flow

import assert from 'assert';
import util from 'util';

import { absurd } from '../typetools';
import RealNum from './RealNum';
import {
  type RealEvalResult,
  RealRegularResult,
  RealDivisionByZeroResult,
} from './RealEvalResult';
import { type Precision, NegInfPrec } from './Precision';
import { type RealGenerator } from './RealGenerator';

export default class RealGeneratorState {
  gen: RealGenerator;
  currRes: RealEvalResult = new RealRegularResult(
    RealNum.zero,
    new NegInfPrec(),
  );

  initialized: boolean = false;

  // gen must take at least one input before it returns
  // yields from the generator must already be rounded to the input precision
  // yielded values will have an error
  // < 1/10^prec
  // from the true expression value
  // (< 0.5*1/10^prec before rounding)
  // returned values can have more precision than input precision
  // and will signal that the computation is done and the returned number is exactly correct
  // input precisions will always be > than the previous ones
  constructor(gen: RealGenerator) {
    this.gen = gen;
  }

  initializeGen() {
    if (this.initialized) return;
    const { done } = this.gen.next();
    if (done) {
      throw new Error(
        'Generator passed to RealGenEvaluator must get a prec before returning',
      );
    }
    this.initialized = true;
  }

  updatePrecValue(prec: Precision) {
    this.initializeGen();
    if (prec.le(this.currRes.precision)) return;
    const { value, done } = this.gen.next(prec);
    if (!value) {
      throw new Error('Value must not be null');
    } else if (value instanceof RealNum) {
      if (!done) {
        throw new Error('RealNum can only be returned when done is true');
      }
      this.currRes = new RealRegularResult(value);
    } else {
      (value: RealEvalResult);
      if (!value.precision.ge(prec)) {
        throw new Error(
          `value ${util.inspect(
            value,
          )} has lower precision than given ${util.inspect(prec)}`,
        );
      }
      this.currRes = value;
    }
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): RealEvalResult {
    this.updatePrecValue(prec);
    const { currRes } = this;
    assert(currRes.precision.ge(prec));
    if (currRes instanceof RealRegularResult) {
      if (currRes.value.prec().le(prec)) {
        return currRes;
      } else {
        return new RealRegularResult(
          currRes.value.round(prec),
          prec,
          currRes.assumedDiscontinuity,
        );
      }
    } else if (currRes instanceof RealDivisionByZeroResult) {
      return currRes;
    } else {
      return absurd(currRes);
    }
  }
}
