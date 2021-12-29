// @flow

import CalcEnvironment from './CalcEnvironment';
import RealNum from './RealNum';
import ConstExpr from './real-expr/ConstExpr';

test('CalcEnvironment can get an eval object', () => {
  const env = new CalcEnvironment({ zeroTestAdditionalPrecLimit: 0 });
  const expr = new ConstExpr(RealNum.fromStr('4.3'));
  const evaluator = env.getRealEvaluator(expr);

  expect(env.getRealEvaluator(expr)).toBe(evaluator);
  expect(env.realExprCache.has('4.3')).toBe(true);
});
