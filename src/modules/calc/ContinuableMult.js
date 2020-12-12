// @flow

import RealNum from './RealNum';
import ContinuableRealNum from './ContinuableRealNum';
import Precision from './Precision';

export default class ContinuableMult {
  result: RealNum = RealNum.zero;
  prevA: RealNum = RealNum.zero;
  prevB: RealNum = RealNum.zero;
  continuableA: ContinuableRealNum = new ContinuableRealNum();
  continuableB: ContinuableRealNum = new ContinuableRealNum();

  eval(a: RealNum, b: RealNum, prec: Precision): RealNum {
    const [aDiffAtPrec, aDiffAfterPrec] = this.continuableA.cont(a, prec);
    const [bDiffAtPrec, bDiffAfterPrec] = this.continuableB.cont(b, prec);

    const aDiff = aDiffAtPrec.add(aDiffAfterPrec);
    const bDiff = bDiffAtPrec.add(bDiffAfterPrec);
    const diffCross = aDiff.mult(this.prevB).add(bDiff.mult(this.prevA));
    const diffEnd = aDiff.mult(bDiff);

    this.result = this.result.add(diffCross).add(diffEnd);
    this.prevA = a;
    this.prevB = b;

    return this.result;
  }
}
