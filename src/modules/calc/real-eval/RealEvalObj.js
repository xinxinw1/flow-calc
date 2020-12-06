// @flow

import { type RealGenerator } from '../RealGenerator';
import { type RealEvaluator } from '../RealEvaluator';
import RealGenEvaluator from '../RealGenEvaluator';
import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';

export default class RealEvalObj
  extends AbstractClass
  implements RealEvaluator {
  realEval: ?RealGenEvaluator;

  constructor() {
    super();
    this.abstractClass(RealEvalObj);
  }

  // must satisfy the input conditions for RealEvaluator
  makeOutputGenerator(): RealGenerator {
    return this.abstractMethod(this.makeOutputGenerator);
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): [RealNum, boolean] {
    if (!this.realEval) {
      // can't call this in constructor because
      // subclass instance vars aren't ready yet
      this.realEval = new RealGenEvaluator(this.makeOutputGenerator());
    }
    return this.realEval.eval(prec);
  }
}
