// @flow

import { type RealEvalResult } from '../RealEvalResult';
import { type ZeroTestResult } from '../ZeroTestResult';
import CalcEnvironment from '../CalcEnvironment';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export interface RealEvaluator {
  // Gets the current environment.
  // This ensures all Evaluators extend BaseEvaluator
  getEnv(): CalcEnvironment;

  // Evaluate the represented value to the given precision
  // result.precision must be >= the given prec
  // If there is a value, result.value.prec() must be <= the given prec
  eval(prec: Precision): RealEvalResult;

  // Return max size that the final full precision number can be
  // The evaluated size can be temporarily higher by 1 when rounding
  // to a precision that's 1 less than the actual size.
  // maxSize() >= exactValue.size()
  maxSize(): Size;

  // Test the zeroness of the represented value up to the given
  // precision plus a configurable value.
  // Result also includes the sign and size
  // of the result if confirmed to be non-zero.
  // And if it is zero, whether it is guaranteed zero
  // or just can't be proven not to be zero.
  testZeroness(prec: Precision): ZeroTestResult;
}
