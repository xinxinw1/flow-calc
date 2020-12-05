// @flow

import { type RealGenerator } from '../RealGenerator';
import RealEvaluator from '../RealEvaluator';
import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';

export default class RealEvalObj extends AbstractClass {
  realEval: RealEvaluator;

  constructor() {
    super();
    this.abstractClass(RealEvalObj);
    this.realEval = new RealEvaluator(this.makeOutputGenerator());
  }

  // must satisfy the input conditions for RealEvaluator
  makeOutputGenerator(): RealGenerator {
    return this.abstractMethod(this.makeOutputGenerator);
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): [RealNum, boolean] {
    return this.realEval.eval(prec);
  }
}
