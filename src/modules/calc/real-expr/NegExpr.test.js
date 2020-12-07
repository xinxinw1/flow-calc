// @flow

import RealNum from '../RealNum';
import Environment from '../Environment';
import { RegularPrec } from '../Precision';
import ConstExpr from './ConstExpr';
import NegExpr from './NegExpr';

test('expr can make evaluator', () => {
  const expr = new NegExpr(new ConstExpr(RealNum.fromStr('4.3')));
  const env = new Environment({ precMargin: 0 });
  const evaluator = expr.makeEvaluator(env);

  const [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromStr('-4.3'));
  expect(done).toBe(true);
});

test('expr can get uniq string', () => {
  const expr = new NegExpr(new ConstExpr(RealNum.fromStr('4.3')));
  expect(expr.uniqString()).toBe('Neg(4.3)');
});
