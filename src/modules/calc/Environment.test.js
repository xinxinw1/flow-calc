// @flow

import RealNum from './RealNum';
import Environment from './Environment';
import ConstExpr from './real-expr/ConstExpr';

test('Environment can get an eval object', () => {
  const env = new Environment({ precMargin: 0 });
  const expr = new ConstExpr(RealNum.fromNum(4.3));
  const evalObj = env.getRealEvalObj(expr);

  expect(env.getRealEvalObj(expr)).toBe(evalObj);
  expect(env.realExprCache.has('4.3')).toBe(true);
});
