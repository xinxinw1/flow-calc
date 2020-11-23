// @flow

import RealNum from './RealNum';
import Environment from './Environment';
import ConstExpr from './real-expr/ConstExpr';
import { RegularPrec, InfPrec, NegInfPrec } from './Precision';

test('Environment can get an eval object', () => {
  const env = new Environment();
  const expr = new ConstExpr(RealNum.fromNum(4.3));
  const evalObj = env.getRealEvalObj(expr);

  expect(env.realExprCache.has('4.3')).toBe(true);
  let [value, done] = [RealNum.zero, false];

  [value, done] = evalObj.eval(NegInfPrec);
  expect(value).toObjEqual(RealNum.zero);
  expect(done).toBe(false);

  [value, done] = evalObj.eval(new RegularPrec(0));
  expect(value).toObjEqual(RealNum.fromNum(4));
  expect(done).toBe(false);

  [value, done] = evalObj.eval(InfPrec);
  expect(value).toObjEqual(RealNum.fromNum(4.3));
  expect(done).toBe(true);
});
