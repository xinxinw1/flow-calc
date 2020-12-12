// @flow

import RealNum from '../RealNum';
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
    if (!val.size().le(evaluator.maxSize())) {
      expect(val).toObjEqual(
        RealNum.digitWithSize(val.pos, 1, evaluator.maxSize().add(1)),
      );
    }
  }
}
