// @flow

import { type RealEvaluator } from './RealEvaluator';
import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';
import Size from '../Size';

// Creates a RealEvaluator from a class definition
export default class RealClassEvaluator
  extends AbstractClass
  implements RealEvaluator {
  constructor() {
    super();
    this.abstractClass(RealClassEvaluator);
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): [RealNum, boolean] {
    return this.abstractMethod(this.eval, prec);
  }

  maxSize(): Size {
    return this.abstractMethod(this.maxSize);
  }
}
