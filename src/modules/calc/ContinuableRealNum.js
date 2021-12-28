// @flow

import RealNum from './RealNum';
import { type Precision, RegularPrec, InfPrec } from './Precision';

export default class ContinuableRealNum {
  initialized: boolean = false;
  prevLastDig: number;
  prevPrec: Precision;

  init(a: RealNum): void {
    if (this.initialized) return;
    this.initialized = true;
    this.prevLastDig = 0;
    this.prevPrec = new RegularPrec(0 - a.sizeNonZero());
  }

  // given an updated RealNum and the precision of the update
  // returns the diff from the previous number as
  // [diffAtPrec, diffAfterPrec]
  // diffAtPrec is either 0, 1, or -1 depending on the sign of
  // the number
  cont(a: RealNum, prec: Precision): [RealNum, RealNum] {
    if (a.isZero()) {
      // prevent starting from 0 since otherwise
      // we can't guarantee the sign won't change
      // and that previous digits won't change
      // by too much
      throw new Error('ContinuableRealNum values cannot be 0');
    }

    this.init(a);

    if (prec.le(this.prevPrec)) {
      throw new Error('ContinuableRealNum new prec must be > prev prec');
    }

    const [aLastDig, diffAfterPrec] = a.getNumAfterPrec(this.prevPrec);

    let diff = 0;
    if (aLastDig !== this.prevLastDig) {
      diff = 1;
    }

    const diffNum = RealNum.digitAtPrec(!a.pos, diff, this.prevPrec);

    this.prevPrec = prec;

    if (!(prec instanceof InfPrec)) {
      this.prevLastDig = a.getDigitAtPrec(prec);
    }

    return [diffNum, diffAfterPrec];
  }
}
