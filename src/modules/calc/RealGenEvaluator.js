// @flow

import nullthrows from 'nullthrows';

import RealNum from './RealNum';
import Precision, { InfPrec, NegInfPrec } from './Precision';
import {
  type RealGenerator,
  makeContinuousGen,
  makeInstantGen,
} from './RealGenerator';
import { type RealEvaluator } from './RealEvaluator';

export default class RealGenEvaluator implements RealEvaluator {
  gen: RealGenerator;
  currNum: RealNum = RealNum.zero;
  currPrec: Precision = NegInfPrec;

  // gen must take at least one input before it returns
  // yields from the generator must already be rounded to the input precision
  // yielded values will have an error
  // < 1/10^prec
  // from the true expression value
  // (< 0.5*1/10^prec before rounding)
  // returned values can have more precision than input precision
  // and will signal that the computation is done and the returned number is exactly correct
  // input precisions will always be > than the previous ones
  constructor(gen: RealGenerator) {
    this.gen = gen;
    const { done } = this.gen.next();
    if (done) {
      throw new Error(
        'Generator passed to RealGenEvaluator must get a prec before returning',
      );
    }
  }

  updatePrecValue(prec: Precision) {
    if (prec.le(this.currPrec)) return;
    const { value, done } = this.gen.next(prec);
    this.currNum = nullthrows(value);
    this.currPrec = done ? InfPrec : prec;
  }

  // returns [value, done]
  // value will always be rounded to the input precision
  // evaluated value will have an error
  // < 1/10^prec
  // from the true expression value
  // (< 0.5*1/10^prec before rounding)
  // this means if output value is non-zero,
  // calculating to a higher prec
  // will never change its sign
  eval(prec: Precision): [RealNum, boolean] {
    this.updatePrecValue(prec);
    if (this.currPrec === InfPrec && this.currNum.prec().le(prec)) {
      return [this.currNum, true];
    }
    return [this.currNum.round(prec), false];
  }

  static makeInstantEval(a: RealNum): RealGenEvaluator {
    return new RealGenEvaluator(makeInstantGen(a));
  }

  static makeContinuousEval(a: RealNum): RealGenEvaluator {
    return new RealGenEvaluator(makeContinuousGen(a));
  }
}
