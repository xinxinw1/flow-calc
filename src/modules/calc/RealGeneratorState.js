// @flow

import nullthrows from 'nullthrows';

import { type ClassType } from '../typetools';
import RealNum from './RealNum';
import Precision, { InfPrec, NegInfPrec } from './Precision';

export default class RealGeneratorState {
  gen: Generator<RealNum, RealNum, Precision>;
  currNum: RealNum = RealNum.zero;
  currPrec: Precision = NegInfPrec;

  constructor(
    gen: Generator<RealNum, RealNum, Precision>,
    sourceClass: ClassType,
  ) {
    this.gen = gen;
    const { done } = this.gen.next();
    if (done) {
      throw new Error(
        `Generator must not return immediately in ${sourceClass.name}`,
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
  // value will always have precision <= prec
  eval(prec: Precision): [RealNum, boolean] {
    this.updatePrecValue(prec);
    if (this.currPrec === InfPrec && this.currNum.prec().le(prec)) {
      return [this.currNum, true];
    }
    return [this.currNum.round(prec), false];
  }
}
