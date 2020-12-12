// @flow

import RealNum from '../RealNum';
import RealGenClassEvaluator from './RealGenClassEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import { type RealGenerator } from '../RealGenerator';
import ContinuableAdd from '../ContinuableAdd';
import Size from '../Size';

export default class AddEvaluator extends RealGenClassEvaluator {
  aEval: RealEvaluator;
  bEval: RealEvaluator;

  constructor(aEval: RealEvaluator, bEval: RealEvaluator) {
    super();
    this.aEval = aEval;
    this.bEval = bEval;
  }

  // evaluating inputs to 1 more decimal place
  // e_out = (a + e_a) + (b + e_b) - (a + b) + e_r
  // = e_a + e_b + e_r
  // want e_out < 1/10^outputPrec
  // use e_a, e_b < 0.25*1/10^outputPrec
  // and e_r <= 0.5*1/10^outputPrec
  // e_a, e_b < 1/10^(outputPrec + 1) satisfies that
  *makeOutputGenerator(): RealGenerator {
    let outputPrec = yield RealNum.zero;

    for (;;) {
      const inputPrec = outputPrec.add(1);
      const [a, aDone] = this.aEval.eval(inputPrec);
      const [b, bDone] = this.bEval.eval(inputPrec);
      if (a.isZero()) {
        if (b.isZero()) {
          if (aDone && bDone) return RealNum.zero;
          outputPrec = yield RealNum.zero;
        } else {
          if (aDone && bDone) return b;
          outputPrec = yield b.round(outputPrec);
        }
      } else if (b.isZero()) {
        if (aDone && bDone) return a;
        outputPrec = yield a.round(outputPrec);
      } else {
        break;
      }
    }

    // now a and b are both non-zero so
    // can use ContinuableAdd

    const continuableAdd = new ContinuableAdd();

    for (;;) {
      const inputPrec = outputPrec.add(1);
      const [a, aDone] = this.aEval.eval(inputPrec);
      const [b, bDone] = this.bEval.eval(inputPrec);

      const sum = continuableAdd.eval(a, b, inputPrec);

      if (aDone && bDone) return sum;

      outputPrec = yield sum.round(outputPrec);
    }

    // eslint-disable-next-line no-unreachable
    return RealNum.zero;
  }

  maxSize(): Size {
    return this.aEval.maxSize().max(this.bEval.maxSize()).add(1);
  }
}
