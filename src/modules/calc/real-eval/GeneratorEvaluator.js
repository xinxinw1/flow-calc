// @flow

import { type RealGenerator } from '../RealGenerator';
import { type RealEvaluator } from './RealEvaluator';
import AbstractClass from '../../AbstractClass';
import RealGeneratorState from '../RealGeneratorState';
import { type RealEvalResult } from '../RealEvalResult';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

// Creates a RealEvaluator from a makeEvalGenerator() method.
// The generator can't be passed in as a constructor parameter
// because we want to be able to define it as a class method.
// Note that even if the generator could be passed in as a
// parameter, it still needs to be abstract because
// the generator isn't enough to define maxSize()
export default class GeneratorEvaluator
  extends AbstractClass
  implements RealEvaluator
{
  realGenState: ?RealGeneratorState;

  constructor() {
    super();
    this.abstractClass(GeneratorEvaluator);
  }

  // must satisfy the input conditions for RealEvaluator
  makeEvalGenerator(): RealGenerator {
    return this.abstractMethod('makeEvalGenerator');
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): RealEvalResult {
    if (!this.realGenState) {
      // can't call this in constructor because
      // subclass instance vars aren't ready yet
      this.realGenState = new RealGeneratorState(this.makeEvalGenerator());
    }
    return this.realGenState.eval(prec);
  }

  maxSize(): Size {
    return this.abstractMethod('maxSize');
  }
}
