// @flow

import { type RealEvaluator } from './RealEvaluator';
import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';

// Creates a RealEvaluator from a class definition
export default class RealClassEvaluator
  extends AbstractClass
  implements RealEvaluator {
  constructor() {
    super();
    this.abstractClass(RealClassEvaluator);
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(_prec: Precision): [RealNum, boolean] {
    return this.abstractMethod(this.eval);
  }
}
