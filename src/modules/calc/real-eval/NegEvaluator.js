// @flow

import RealNum from '../RealNum';
import { type RealEvaluator } from './RealEvaluator';
import { type Precision } from '../Precision';
import { type Size } from '../Size';

export default class NegEvaluator implements RealEvaluator {
  aEval: RealEvaluator;

  constructor(aEval: RealEvaluator) {
    this.aEval = aEval;
  }

  eval(prec: Precision): [RealNum, boolean] {
    const [a, aDone] = this.aEval.eval(prec);
    return [a.neg(), aDone];
  }

  maxSize(): Size {
    return this.aEval.maxSize();
  }
}
