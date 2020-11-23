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
  makeOutputGenerator(): Generator<RealNum, RealNum, Precision> {
    return this.abstractMethod(this.makeOutputGenerator);
  }

  // returns [value, done]
  // value will always have precision <= prec
  eval(prec: Precision): [RealNum, boolean] {
    return this.genState.eval(prec);
  }
}
