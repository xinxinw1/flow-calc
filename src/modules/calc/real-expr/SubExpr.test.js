// @flow

import RealNum from '../RealNum';
import Environment from '../Environment';
import { RegularPrec } from '../Precision';
import ConstExpr from './ConstExpr';
import SubExpr from './SubExpr';

test('expr can make evaluator', () => {
  const expr = new SubExpr(
    new ConstExpr(RealNum.fromStr('4.3')),
    new ConstExpr(RealNum.fromStr('2.5')),
  );
  const env = new Environment({ precMargin: 0 });
  const evaluator = expr.makeEvaluator(env);

  const [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromStr('1.8'));
  expect(done).toBe(true);
});

test('expr can get uniq string', () => {
  const expr = new SubExpr(
    new ConstExpr(RealNum.fromStr('4.3')),
    new ConstExpr(RealNum.fromStr('2.5')),
  );
  expect(expr.uniqString()).toBe('Sub(4.3,2.5)');
});
