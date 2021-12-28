// @flow

import RealNum from '../RealNum';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export interface RealEvaluator {
  // returns [value, done]
  // value will always be rounded to the input precision
  // evaluated value will have an error
  // < 0.9*1/10^prec
  // from the true expression value
  // (< 0.4*1/10^prec before rounding)
  // this means if output value is non-zero,
  // calculating to a higher prec will
  // 1. never increase the final digit,
  // 2. never change the result's sign,
  // 3. never increase its size, and
  // 4. only decrease its size by at most 1
  eval(prec: Precision): [RealNum, boolean];

  // return max size that the final full precision number can be
  // the evaluated size can be temporarily higher by 1 due to rounding
  maxSize(): Size;
}
