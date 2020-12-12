// @flow

import RealNum from '../RealNum';
import Precision from '../Precision';
import Size from '../Size';

export interface RealEvaluator {
  // returns [value, done]
  // value will always be rounded to the input precision
  // evaluated value will have an error
  // < 1/10^prec
  // from the true expression value
  // (< 0.5*1/10^prec before rounding)
  // this means if output value is non-zero,
  // calculating to a higher prec
  // will never change its sign
  eval(prec: Precision): [RealNum, boolean];

  // return max size that the final full precision number can be
  // the evaluated size can be temporarily higher due to rounding
  maxSize(): Size;
}
