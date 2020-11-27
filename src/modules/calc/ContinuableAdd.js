// @flow

import RealNum from './RealNum';
import ContinuableRealNum from './ContinuableRealNum';
import Precision from './Precision';
import { type RealGenerator } from './RealGenerator';
import { type RealEvaluator } from './RealEvaluator';

export default class ContinuableAdd {
  sum: RealNum = RealNum.zero;
  continuableA: ContinuableRealNum = new ContinuableRealNum();
  continuableB: ContinuableRealNum = new ContinuableRealNum();

  eval(a: RealNum, b: RealNum, prec: Precision): RealNum {
    const [aDiffAtPrec, aDiffAfterPrec] = this.continuableA.cont(a, prec);
    const [bDiffAtPrec, bDiffAfterPrec] = this.continuableB.cont(b, prec);

    const diffAtPrec = aDiffAtPrec.add(bDiffAtPrec);
    const diffAfterPrec = aDiffAfterPrec.add(bDiffAfterPrec);

    this.sum = this.sum.add(diffAtPrec).add(diffAfterPrec);

    return this.sum;
  }

  // evaluating inputs to 1 more decimal place
  // e_out = (a + e_a) + (b + e_b) - (a + b) + e_r
  // = e_a + e_b + e_r
  // want e_out < 1/10^outputPrec
  // use e_a, e_b < 0.25*1/10^outputPrec
  // and e_r <= 0.5*1/10^outputPrec
  // e_a, e_b < 1/10^(outputPrec + 1) satisfies that
  static *makeGenerator(
    aEval: RealEvaluator,
    bEval: RealEvaluator,
  ): RealGenerator {
    let outputPrec = yield RealNum.zero;

    for (;;) {
      const inputPrec = outputPrec.add(1);
      const [a, aDone] = aEval.eval(inputPrec);
      const [b, bDone] = bEval.eval(inputPrec);
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
      const [a, aDone] = aEval.eval(inputPrec);
      const [b, bDone] = bEval.eval(inputPrec);

      const sum = continuableAdd.eval(a, b, inputPrec);

      if (aDone && bDone) return sum;

      outputPrec = yield sum.round(outputPrec);
    }

    // eslint-disable-next-line no-unreachable
    return RealNum.zero;
  }
}
