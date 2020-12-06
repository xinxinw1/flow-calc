// @flow

import RealNum from './RealNum';
import type Precision from './Precision';

export type RealGenerator = Generator<RealNum, RealNum, Precision>;

export function* makeInstantGen(a: RealNum): RealGenerator {
  yield RealNum.zero;
  return a;
}

export function* makeContinuousGen(a: RealNum): RealGenerator {
  let prec = yield RealNum.zero;
  for (;;) {
    prec = yield a.round(prec);
  }
  // for type-check only
  // eslint-disable-next-line no-unreachable
  return RealNum.zero;
}
