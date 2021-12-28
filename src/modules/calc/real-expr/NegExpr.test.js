// @flow

import RealNum from '../RealNum';
import { RealRegularResult } from '../RealEvalResult';
import Environment from '../Environment';
import { RegularPrec, InfPrec } from '../Precision';
import ConstExpr from './ConstExpr';
import NegExpr from './NegExpr';

import _, { type ObjEqualMatcher } from '../toObjEqual.test-helper';
import { type ExtendExpect } from '../../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('expr can make evaluator', () => {
  const expr = new NegExpr(new ConstExpr(RealNum.fromStr('4.3')));
  const env = new Environment({ precMargin: 0 });
  const evaluator = expr.makeEvaluator(env);

  const res = evaluator.eval(new RegularPrec(1));
  expect(res instanceof RealRegularResult);
  if (res instanceof RealRegularResult) {
    expect(res.value).toObjEqual(RealNum.fromStr('-4.3'));
    expect(res.precision).toObjEqual(new InfPrec());
    expect(res.isDone()).toBe(true);
  }
});

test('expr can get uniq string', () => {
  const expr = new NegExpr(new ConstExpr(RealNum.fromStr('4.3')));
  expect(expr.uniqString()).toBe('Neg(4.3)');
});
