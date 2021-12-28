// @flow

import assert from 'assert';

import RealNum from './RealNum';
import { type Precision, InfPrec } from './Precision';

/**
 * Represents the result of an evaluation.
 * this.value.prec() will always be <= to this.precision
 *
 * If precision is InfPrec, then the value is known to be
 * exactly correct with no rounding needed.
 *
 * If assumedDiscontinuity is false,
 * evaluated value will have an error
 * < 0.9*1/10^prec
 * from the true expression value
 * (< 0.4*1/10^prec before rounding).
 *
 * This means if output value is non-zero,
 * calculating to a higher prec will
 * 1. never increase the final digit,
 * 2. never change the result's sign,
 * 3. never increase its size, and
 * 4. only decrease its size by at most 1
 *
 * If assumedDiscontinuity is true, the evaluated value can jump an
 * arbitrarily large amount with additional precision,
 * but a best-effort attempt will be made to make it accurate.
 */
export class RealRegularResult {
  value: RealNum;
  precision: Precision;
  assumedDiscontinuity: boolean;

  constructor(
    value: RealNum,
    precision?: Precision,
    assumedDiscontinuity?: boolean,
  ) {
    this.value = value;
    this.precision = precision || new InfPrec();
    this.assumedDiscontinuity = assumedDiscontinuity || false;
    assert(!(this.precision.isInf() && this.assumedDiscontinuity));
  }

  isDone(): boolean {
    return this.precision.isInf();
  }

  // Makes a new RealRegularResult and sets the value of assumedDiscontinuity
  // to true if any of the given other results have assumedDiscontinuity === true
  withDiscontinuities(...results: Array<RealRegularResult>): RealRegularResult {
    for (const result of results) {
      if (result.assumedDiscontinuity) {
        return new RealRegularResult(this.value, this.precision, true);
      }
    }
    return this;
  }
}

/**
 * Represents the fact that a division by zero was encountered.
 *
 * If precision is not InfPrec, the precision given means that
 * there is an assumed division by zero when calculating with any precision
 * less than or equal to the given precision, so assumedDiscontinuity is true.
 *
 * If precision is InfPrec, the value is guaranteed to be a division by zero
 * no matter what precision to calculate at, so assumedDiscontinuity is false.
 */
export class RealDivisionByZeroResult {
  precision: Precision;
  assumedDiscontinuity: boolean;

  constructor(precision?: Precision) {
    this.precision = precision || new InfPrec();
    this.assumedDiscontinuity = !(this.precision instanceof InfPrec);
  }

  // The current result object is assumed to be using the precision of
  // a subexpression, but we need a result based on the precision of
  // the parent expression.
  //
  // This function reduces or increases the precision to that of the parent expression
  // while maintaining the precision if it is InfPrec.
  withOutputPrec(precision: Precision): RealDivisionByZeroResult {
    if (this.precision instanceof InfPrec) return this;
    return new RealDivisionByZeroResult(precision);
  }
}

export type RealEvalResult = RealRegularResult | RealDivisionByZeroResult;
