// @flow

import RealNum from './RealNum';
import Environment from './Environment';
import ConstExpr from './real-expr/ConstExpr';

test('Environment can get an eval object', () => {
  const env = new Environment({ precMargin: 0 });
  const expr = new ConstExpr(RealNum.fromStr('4.3'));
  const evaluator = env.getRealEvaluator(expr);

  expect(env.getRealEvaluator(expr)).toBe(evaluator);
  expect(env.realExprCache.has('4.3')).toBe(true);
});
