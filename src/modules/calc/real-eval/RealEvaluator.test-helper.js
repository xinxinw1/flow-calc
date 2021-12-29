// @flow

import { type ExtendExpect } from '../../ExtendExpect.test-helper';
import { type Precision } from '../Precision';
import { RealRegularResult } from '../RealEvalResult';
import RealNum from '../RealNum';
import { type ZeroTestResult } from '../ZeroTestResult';
import _, { type ObjEqualMatcher } from '../toObjEqual.test-helper';

import { type RealEvaluator } from './RealEvaluator';

declare var expect: ExtendExpect<ObjEqualMatcher>;

export function checkEvaluatorSeq(
  evaluator: RealEvaluator,
  seq: Array<[Precision, string, boolean]>,
) {
  for (const [prec, expVal, expDone] of seq) {
    const res = evaluator.eval(prec);
    expect(res instanceof RealRegularResult);
    if (res instanceof RealRegularResult) {
      expect(res.value.toString()).toBe(expVal);
      expect(res.precision.ge(prec)).toBe(true);
      expect(res.isDone()).toBe(expDone);
      if (!res.value.size().le(evaluator.maxSize())) {
        expect(res.value).toObjEqual(
          RealNum.digitWithSize(res.value.pos, 1, evaluator.maxSize().add(1)),
        );
      }
    }
  }
}

export function checkZeronessSeq(
  evaluator: RealEvaluator,
  seq: Array<[Precision, ZeroTestResult]>,
) {
  for (const [prec, expRes] of seq) {
    const res = evaluator.testZeroness(prec);
    expect(res).toObjEqual(expRes);
  }
}
