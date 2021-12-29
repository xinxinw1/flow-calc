// @flow

import { type RealEvalResult } from '../RealEvalResult';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export interface RealEvaluator {
  // Evaluate the represented value to the given precision
  // result.precision must be >= the given prec
  // If there is a value, result.value.prec() must be <= the given prec
  eval(prec: Precision): RealEvalResult;

  // Return max size that the final full precision number can be
  // The evaluated size can be temporarily higher by 1 when rounding
  // to a precision that's 1 less than the actual size.
  // maxSize() >= exactValue.size()
  maxSize(): Size;
}
