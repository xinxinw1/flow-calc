// @flow

import Precision from '../Precision';
import { type RealEvaluator } from './RealEvaluator';

export function checkEvaluatorSeq(
  evaluator: RealEvaluator,
  seq: Array<[Precision, string, boolean]>,
) {
  for (const [prec, expVal, expDone] of seq) {
    const [val, done] = evaluator.eval(prec);
    expect(val.toString()).toBe(expVal);
    expect(done).toBe(expDone);
    expect(val.size().le(evaluator.maxSize())).toBe(true);
  }
}
