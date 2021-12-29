// @flow

import CalcEnvironment from '../CalcEnvironment';
import RealNum from '../RealNum';
import { RealRegularResult, RealDivisionByZeroResult } from '../RealEvalResult';
import GeneratorEvaluator from './GeneratorEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import { type RealGenerator } from '../RealGenerator';
import { type Size, RegularSize, NegInfSize } from '../Size';

export default class MultEvaluator
  extends GeneratorEvaluator
  implements RealEvaluator
{
  aEval: RealEvaluator;
  bEval: RealEvaluator;

  constructor(
    env: CalcEnvironment,
    aEval: RealEvaluator,
    bEval: RealEvaluator,
  ) {
    super(env);
    this.aEval = aEval;
    this.bEval = bEval;
  }

  // e_out = (a + e_a) * (b + e_b) - (a * b) + e_r
  // = a * e_b + b * e_a + e_r
  // want |e_out| < 0.9*1/10^outputPrec
  // use |b*e_a|, |a*e_b| < 0.2*1/10^outputPrec
  // and |e_r| <= 0.5*1/10^outputPrec
  // |b*e_a| < 0.2*1/10^outputPrec
  // we'll have |e_a| < 0.9*1/10^p_a
  // so |b*e_a| < |b|*0.9*1/10^p_a
  // we'll need |b|*0.9*1/10^p_a <= 0.2*1/10^outputPrec
  // 1/10^p_a <= 1/|b|*0.2/0.9*1/10^outputPrec
  // p_a >= outputPrec + log(|b|) - log(0.2/0.9)
  // = outputPrec + log(|b|) + 0.6532...
  // outputPrec + log(|b|) + 0.6532...
  // < outputPrec + b.size() + 0.6532...
  // < outputPrec + b.size() + 1
  // <= outputPrec + b.maxSize() + 1
  // use p_a = outputPrec + b.maxSize() + 1
  // use p_b = outputPrec + a.maxSize() + 1
  *makeEvalGenerator(): RealGenerator {
    let outputPrec = yield;

    const aSize = this.aEval.maxSize();
    const bSize = this.bEval.maxSize();

    if (aSize instanceof NegInfSize || bSize instanceof NegInfSize) {
      return RealNum.zero;
    }

    (aSize: RegularSize);
    (bSize: RegularSize);
    const aSizeNum = aSize.size;
    const bSizeNum = bSize.size;

    for (;;) {
      const aInputPrec = outputPrec.add(bSizeNum + 1);
      const bInputPrec = outputPrec.add(aSizeNum + 1);
      const aRes = this.aEval.eval(aInputPrec);
      const bRes = this.bEval.eval(bInputPrec);
      if (aRes instanceof RealDivisionByZeroResult) {
        outputPrec = yield aRes.withOutputPrec(outputPrec);
      } else if (bRes instanceof RealDivisionByZeroResult) {
        outputPrec = yield bRes.withOutputPrec(outputPrec);
      } else {
        (aRes: RealRegularResult);
        (bRes: RealRegularResult);
        if (aRes.value.isZero() && aRes.isDone()) {
          return RealNum.zero;
        }
        if (bRes.value.isZero() && bRes.isDone()) {
          return RealNum.zero;
        }
        const prod = aRes.value.mult(bRes.value);
        if (aRes.isDone() && bRes.isDone()) {
          return prod;
        }
        outputPrec = yield new RealRegularResult(
          prod.round(outputPrec),
          outputPrec,
        ).withDiscontinuities(aRes, bRes);
      }
    }

    // eslint-disable-next-line no-unreachable
    return RealNum.zero;
  }

  // Need (a*b).maxSize() >= (a*b).size()
  // (a*b).size() <= log(|a*b|) + 1
  // = log(|a|) + log(|b|) + 1
  // < a.size() + b.size() + 1
  // Since sizes are integers,
  // (a*b).size() <= a.size() + b.size()
  // <= a.maxSize() + b.maxSize()
  // Choose (a*b).maxSize() = a.maxSize() + b.maxSize()
  maxSize(): Size {
    return this.aEval.maxSize().add(this.bEval.maxSize());
  }
}
