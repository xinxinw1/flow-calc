// @flow

import { downCast } from '../../typetools';
import RealNum from '../RealNum';
import RealGenClassEvaluator from './RealGenClassEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import { type RealGenerator } from '../RealGenerator';
import ContinuableMult from '../ContinuableMult';
import Size, { RegularSize, NegInfSize } from '../Size';

export default class MultEvaluator extends RealGenClassEvaluator {
  aEval: RealEvaluator;
  bEval: RealEvaluator;

  constructor(aEval: RealEvaluator, bEval: RealEvaluator) {
    super();
    this.aEval = aEval;
    this.bEval = bEval;
  }

  // e_out = (a + e_a) * (b + e_b) - (a * b) + e_r
  // = a * e_b + b * e_a + e_r
  // want e_out < 1/10^outputPrec
  // use b*e_a, a*e_b < 0.25*1/10^outputPrec
  // and e_r <= 0.5*1/10^outputPrec
  // b*e_a < 0.25*1/10^outputPrec
  // we'll have e_a, e_b < 1/10^inputPrec
  // so b*e_a < b*1/10^p_a
  // we'll need b*1/10^p_a <= 0.25*1/10^outputPrec
  // p_a - log(b) >= outputPrec - log(0.25)
  // p_a >= outputPrec + log(b) - log(0.25)
  // use p_a = outputPrec + b.maxSize() + 1
  // use p_b = outputPrec + a.maxSize() + 1
  *makeOutputGenerator(): RealGenerator {
    let outputPrec = yield RealNum.zero;

    const aSize = this.aEval.maxSize();
    const bSize = this.bEval.maxSize();

    if (aSize === NegInfSize || bSize === NegInfSize) {
      return RealNum.zero;
    }

    const aSizeNum = downCast(aSize, RegularSize).size;
    const bSizeNum = downCast(bSize, RegularSize).size;

    for (;;) {
      const aInputPrec = outputPrec.add(bSizeNum + 1);
      const bInputPrec = outputPrec.add(aSizeNum + 1);
      const [a, aDone] = this.aEval.eval(aInputPrec);
      const [b, bDone] = this.bEval.eval(bInputPrec);
      if (a.isZero() && aDone) {
        return RealNum.zero;
      }
      if (b.isZero() && bDone) {
        return RealNum.zero;
      }
      if (a.isZero() || b.isZero()) {
        outputPrec = yield RealNum.zero;
      } else {
        break;
      }
    }

    // now a and b are both non-zero so
    // can use ContinuableMult

    const continuableMult = new ContinuableMult();

    for (;;) {
      const aInputPrec = outputPrec.add(bSizeNum + 1);
      const bInputPrec = outputPrec.add(aSizeNum + 1);
      const [a, aDone] = this.aEval.eval(aInputPrec);
      const [b, bDone] = this.bEval.eval(bInputPrec);

      const result = continuableMult.eval(a, b, aInputPrec, bInputPrec);

      if (aDone && bDone) return result;

      outputPrec = yield result.round(outputPrec);
    }

    // eslint-disable-next-line no-unreachable
    return RealNum.zero;
  }

  maxSize(): Size {
    return this.aEval.maxSize().add(this.bEval.maxSize());
  }
}
