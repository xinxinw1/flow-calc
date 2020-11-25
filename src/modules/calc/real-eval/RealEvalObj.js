// @flow

import RealGeneratorState from '../RealGeneratorState';
import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';

export default class RealEvalObj extends AbstractClass {
  genState: RealGeneratorState;

  constructor() {
    super();
    this.abstractClass(RealEvalObj);
    this.genState = new RealGeneratorState(
      this.makeOutputGenerator(),
      this.constructor,
    );
  }

  // there must always be a first yield before a return
  // yields from the generator must already be rounded to the input precision
  // yielded values will have an error
  // <= 1/10^(prec+precMargin+1)
  // before rounding
  // returned values can have more precision than input precision
  // and will signal that the computation is done and the returned number is exactly correct
  // input precisions will always be > than the previous ones
  makeOutputGenerator(): Generator<RealNum, RealNum, Precision> {
    return this.abstractMethod(this.makeOutputGenerator);
  }

  // returns [value, done]
  // value will always have precision <= prec
  // evaluated value will have an error
  // <= 1/10^(prec+precMargin+1)
  // before rounding
  // so the final value will have an error
  // <= 1/2*1/10^prec + 1/10^(prec+precMargin+1)
  // from the true expression value
  // this means the smallest size output value is
  // 1/10^prec, which means if the output value
  // is non-zero, calculating to a higher prec
  // will never change its sign
  eval(prec: Precision): [RealNum, boolean] {
    return this.genState.eval(prec);
  }
}
