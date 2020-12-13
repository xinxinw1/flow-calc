// @flow

import { downCast } from '../../typetools';
import RealNum from '../RealNum';
import RealGenClassEvaluator from './RealGenClassEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import { type RealGenerator } from '../RealGenerator';
import ContinuableMult from '../ContinuableMult';
import Size, { RegularSize, NegInfSize } from '../Size';

export default class DivEvaluator extends RealGenClassEvaluator {
  aEval: RealEvaluator;
  bEval: RealEvaluator;

  constructor(aEval: RealEvaluator, bEval: RealEvaluator) {
    super();
    this.aEval = aEval;
    this.bEval = bEval;
  }

  // |e_out| = |(a + e_a) / (b + e_b) - (a / b) + e_r|
  // <= |(b * (a + e_a) - a * (b + e_b)) / (b * (b + e_b))| + |e_r|
  // = |(b * e_a - a * e_b) / (b * (b + e_b))| + |e_r|
  // = |(b * e_a) / (b * (b + e_b))| + |(a * e_b) / (b * (b + e_b))| + |e_r|
  // = |e_a / (b + e_b)| + |a * e_b / (b * (b + e_b))| + |e_r|
  // use |e_r| <= 0.5*1/10^outputPrec
  // so need |a * e_b / (b * (b + e_b))| < 0.25*1/10^outputPrec
  // we assume |e_b| < |b| so that b + e_b doesn't flip signs
  // (equivalent to needing b to be evaluated to a precision
  // that's at least b's size)
  // |b + e_b| >= |b| - |e_b|
  // need |a| * |e_b| / (|b| * (|b| - |e_b|)) < 0.25*1/10^outputPrec
  // |e_b| / (|b| - |e_b|) < |b|/|a|*0.25*1/10^outputPrec
  // |e_b| < |b|/|a|*0.25*1/10^outputPrec*(|b| - |e_b|)
  // |e_b| + |e_b| * |b|/|a|*0.25*1/10^outputPrec < |b|/|a|*0.25*1/10^outputPrec*|b|
  // |e_b| * (1 + |b|/|a|*0.25*1/10^outputPrec) < |b|^2/|a|*0.25*1/10^outputPrec
  // |e_b| < |b|^2/|a|*0.25*1/10^outputPrec / (1 + |b|/|a|*0.25*1/10^outputPrec)
  // |e_b| < |b| * x / (1 + x)
  // |e_b| < |b| * (1 + x - 1) / (1 + x)
  // |e_b| < |b| * (1 - 1 / (1 + x))
  // for x <= 1, x/2 <= 1 - 1 / (1 + x)
  // for x >= 1, 1/2 <= 1 - 1 / (1 + x)
  // min(1, x)/2 <= (1 - 1 / (1 + x))
  // we have |e_b| < 1/10^p_b
  // so need 1/10^p_b <= |b| * (1 - 1 / (1 + x))
  // use 1/10^p_b <= |b| * min(1, x)/2
  // p_b >= -log(|b|) - log(min(1, x)) + log(2)
  // = -log(|b|) - min(0, log(x)) + log(2)
  // = -log(|b|) + max(0, -log(x)) + log(2)
  // = -log(|b|) + max(0, -log(|b|/|a|*0.25*1/10^outputPrec)) + log(2)
  // = -log(|b|) + max(0, -log(|b|) + log(|a|) - log(0.25) + outputPrec) + log(2)
  // = -log(|b|) + max(0, outputPrec - log(|b|) + log(|a|) + log(4)) + log(2)
  // = -log(|b|) + max(log(2) - 1, outputPrec - log(|b|) + log(|a|) + log(8) - 1) + 1
  // use p_b >= -log(|b|) + max(0, outputPrec - log(|b|) + log(|a|)) + 1
  // need |e_a / (b + e_b)| < 0.25*1/10^outputPrec
  // |e_a| / (|b| - |e_b|) < 0.25*1/10^outputPrec
  // we have |e_b| < |b| * (1 - 1 / (1 + x))
  // we have |e_b| < |b| - |b| / (1 + x)
  // we have |b| / (1 + x) < |b| - |e_b|
  // use |e_a| / (|b| / (1 + x)) < 0.25*1/10^outputPrec
  // use |e_a| * (1 + x) / |b| < 0.25*1/10^outputPrec
  // use |e_a| < |b| / (1 + x) * 0.25*1/10^outputPrec
  // we have |e_a| < 1/10^p_a
  // need 1/10^p_a <= |b| / (1 + x) * 0.25*1/10^outputPrec
  // p_a >= -log(|b|) + log(1 + x) - log(0.25) + outputPrec
  // = outputPrec - log(|b|) + log(1 + x) + log(4)
  // max(log(2), log(x)+log(2)) >= log(1 + x)
  // use p_a >= outputPrec - log(|b|) + max(0, log(x)) + log(2) + log(4)
  // = outputPrec - log(|b|) + max(0, log(|b|/|a|*0.25*1/10^outputPrec)) + log(2) + log(4)
  // = outputPrec - log(|b|) + max(0, log(|b|) - log(|a|) + log(0.25) - outputPrec) + log(2) + log(4)
  // = outputPrec - log(|b|) + max(0, log(|b|) - log(|a|) - log(4) - outputPrec) + log(8)
  // = max(outputPrec - log(|b|) + log(8), -log(|a|) + log(2))
  // use p_a >= max(outputPrec - log(|b|), -log(|a|)) + 1
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
