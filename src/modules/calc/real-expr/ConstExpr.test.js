// @flow

import RealNum from '../RealNum';
import Environment from '../Environment';
import { RegularPrec } from '../Precision';
import ConstExpr from './ConstExpr';

import _, { type ObjEqualMatcher } from '../toObjEqual.test-helper';
import { type ExtendExpect } from '../../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('expr can make evaluator', () => {
  const expr = new ConstExpr(RealNum.fromStr('4.3'));
  const env = new Environment({ precMargin: 0 });
  const evaluator = expr.makeEvaluator(env);

  const [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromStr('4.3'));
  expect(done).toBe(true);
});

test('expr can get uniq string', () => {
  const expr = new ConstExpr(RealNum.fromStr('4.3'));
  expect(expr.uniqString()).toBe('4.3');
});
