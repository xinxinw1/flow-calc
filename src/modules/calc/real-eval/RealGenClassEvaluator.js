// @flow

import { type RealGenerator } from '../RealGenerator';
import RealClassEvaluator from './RealClassEvaluator';
import RealGeneratorState from '../RealGeneratorState';
import RealNum from '../RealNum';
import Precision from '../Precision';

// Creates a RealEvaluator from a class definition
// that defines makeOutputGenerator()
export default class RealGenClassEvaluator extends RealClassEvaluator {
  realGenState: ?RealGeneratorState;

  constructor() {
    super();
    this.abstractClass(RealGenClassEvaluator);
  }

  // must satisfy the input conditions for RealEvaluator
  makeOutputGenerator(): RealGenerator {
    return this.abstractMethod(this.makeOutputGenerator);
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): [RealNum, boolean] {
    if (!this.realGenState) {
      // can't call this in constructor because
      // subclass instance vars aren't ready yet
      this.realGenState = new RealGeneratorState(this.makeOutputGenerator());
    }
    return this.realGenState.eval(prec);
  }
}
