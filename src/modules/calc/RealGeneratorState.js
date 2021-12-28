// @flow

import nullthrows from 'nullthrows';

import RealNum from './RealNum';
import { type Precision, InfPrec, NegInfPrec } from './Precision';
import { type RealGenerator } from './RealGenerator';

export default class RealGeneratorState {
  gen: RealGenerator;
  currNum: RealNum = RealNum.zero;
  currPrec: Precision = new NegInfPrec();
  initialized: boolean = false;

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
  }

  initializeGen() {
    if (this.initialized) return;
    const { done } = this.gen.next();
    if (done) {
      throw new Error(
        'Generator passed to RealGenEvaluator must get a prec before returning',
      );
    }
    this.initialized = true;
  }

  updatePrecValue(prec: Precision) {
    this.initializeGen();
    if (prec.le(this.currPrec)) return;
    const { value, done } = this.gen.next(prec);
    this.currNum = nullthrows(value);
    this.currPrec = done ? new InfPrec() : prec;
  }

  // will satisfy the output conditions for RealEvaluator.eval
  eval(prec: Precision): [RealNum, boolean] {
    this.updatePrecValue(prec);
    if (this.currPrec instanceof InfPrec && this.currNum.prec().le(prec)) {
      return [this.currNum, true];
    }
    return [this.currNum.round(prec), false];
  }
}
