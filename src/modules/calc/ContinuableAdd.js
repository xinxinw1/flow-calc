// @flow

import RealNum from './RealNum';
import ContinuableRealNum from './ContinuableRealNum';
import Precision from './Precision';

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
}
