// @flow

import RealNum from './RealNum';
import { type RealEvalResult, RealRegularResult } from './RealEvalResult';
import { type Precision } from './Precision';

/**
 * A RealGenerator is a generator that takes in
 * Precision values as its "next" inputs, yields RealEvalResult,
 * and returns RealNum outputs.
 *
 * If it returns, the result is equivalent to yielding
 * a RealRegularResult with the given RealNum as the value.
 * The value of precision is assumed to be
 * InfPrec and assumedDiscontinuity is assumed to be false.
 *
 * The generator must start with taking in a Precision
 * input (yielding null) before yielding actual values.
 *
 * Future precision values taken as input must be >=
 * than previously given precision values.
 *
 * Returned values must have precision >= the input precision.
 */
export type RealGenerator = Generator<?RealEvalResult, RealNum, Precision>;

export function* makeInstantGen(a: RealNum): RealGenerator {
  yield;
  return a;
}

export function* makeContinuousGen(a: RealNum): RealGenerator {
  let prec = yield;
  for (;;) {
    prec = yield new RealRegularResult(a.round(prec), prec);
  }
  // for type-check only
  // eslint-disable-next-line no-unreachable
  return RealNum.zero;
}
