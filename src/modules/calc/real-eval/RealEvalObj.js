// @flow

import AbstractClass from '../../AbstractClass';
import RealNum from '../RealNum';
import Precision from '../Precision';

export default class RealEvalObj extends AbstractClass {
  constructor() {
    super();
    this.abstractClass(RealEvalObj);
  }

  makeOutputGenerator(): Generator<RealNum, RealNum, Precision> {
    return this.abstractMethod(this.makeOutputGenerator);
  }
}
