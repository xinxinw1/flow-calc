// @flow

import CalcEnvironment from '../CalcEnvironment';
import RealNum from '../RealNum';
import { RealRegularResult, RealDivisionByZeroResult } from '../RealEvalResult';
import GeneratorEvaluator from './GeneratorEvaluator';
import { type RealEvaluator } from './RealEvaluator';
import { type RealGenerator } from '../RealGenerator';
import { type Size } from '../Size';

export default class AddEvaluator
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

  // evaluating inputs to 1 more decimal place
  // e_out = (a + e_a) + (b + e_b) - (a + b) + e_r
  // = e_a + e_b + e_r
  // want |e_out| < 0.9*1/10^outputPrec
  // use |e_a|, |e_b| < 0.2*1/10^outputPrec
  // and |e_r| <= 0.5*1/10^outputPrec
  // we have |e_a| < 0.9*1/10^p_a
  // so need 0.9*1/10^p_a <= 0.2*1/10^outputPrec
  // 1/10^p_a <= 0.2/0.9*1/10^outputPrec
  // p_a >= -log(0.2/0.9) + outputPrec
  // = outputPrec + 0.6532...
  // use p_a, p_b >= outputPrec + 1
  *makeEvalGenerator(): RealGenerator {
    let outputPrec = yield;

    for (;;) {
      const inputPrec = outputPrec.add(1);
      const aRes = this.aEval.eval(inputPrec);
      const bRes = this.bEval.eval(inputPrec);
      if (aRes instanceof RealDivisionByZeroResult) {
        outputPrec = yield aRes.withOutputPrec(outputPrec);
      } else if (bRes instanceof RealDivisionByZeroResult) {
        outputPrec = yield bRes.withOutputPrec(outputPrec);
      } else {
        (aRes: RealRegularResult);
        (bRes: RealRegularResult);
        const sum = aRes.value.add(bRes.value);
        if (aRes.isDone() && bRes.isDone()) {
          return sum;
        }
        outputPrec = yield new RealRegularResult(
          sum.round(outputPrec),
          outputPrec,
        ).withDiscontinuities(aRes, bRes);
      }
    }

    // eslint-disable-next-line no-unreachable
    return RealNum.zero;
  }

  // Need (a+b).maxSize() >= (a+b).size()
  // (a+b).size() <= log(|a+b|) + 1
  // <= log(|a|+|b|) + 1
  // <= log(2*max(|a|, |b|)) + 1
  // = log(max(|a|, |b|)) + log(2) + 1
  // = max(log(|a|), log(|b|)) + log(2) + 1
  // < max(a.size(), b.size()) + log(2) + 1
  // Since log(2) ~= 0.301 and sizes must be integers,
  // (a+b).size() <= max(a.size(), b.size()) + 1
  // <= max(a.maxSize(), b.maxSize()) + 1
  // Choose (a+b).maxSize() = max(a.maxSize(), b.maxSize()) + 1
  maxSize(): Size {
    return this.aEval.maxSize().max(this.bEval.maxSize()).add(1);
  }
}
