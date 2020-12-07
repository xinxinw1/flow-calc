// @flow

import RealNum from '../RealNum';
import RealClassEvaluator from './RealClassEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import Precision from '../Precision';

export default class NegEvaluator extends RealClassEvaluator {
  aEval: RealEvaluator;

  constructor(aEval: RealEvaluator) {
    super();
    this.aEval = aEval;
  }

  eval(prec: Precision): [RealNum, boolean] {
    const [a, aDone] = this.aEval.eval(prec);
    return [a.neg(), aDone];
  }
}
