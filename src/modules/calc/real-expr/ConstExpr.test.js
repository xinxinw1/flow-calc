// @flow

import RealNum from '../RealNum';
import Environment from '../Environment';
import { RegularPrec, InfPrec, NegInfPrec } from '../Precision';
import ConstExpr from './ConstExpr';

test('eval works correctly', () => {
  const env = new Environment({ precMargin: 0 });
  const expr = new ConstExpr(RealNum.fromNum(4.3));
  const evalObj = env.getRealEvalObj(expr);

  let [value, done]: [RealNum, boolean] = [RealNum.zero, false];

  [value, done] = evalObj.eval(NegInfPrec);
  expect(value).toObjEqual(RealNum.zero);
  expect(done).toBe(false);

  [value, done] = evalObj.eval(new RegularPrec(0));
  expect(value).toObjEqual(RealNum.fromNum(4));
  expect(done).toBe(false);

  [value, done] = evalObj.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.3));
  expect(done).toBe(true);

  [value, done] = evalObj.eval(InfPrec);
  expect(value).toObjEqual(RealNum.fromNum(4.3));
  expect(done).toBe(true);

  [value, done] = evalObj.eval(new RegularPrec(0));
  expect(value).toObjEqual(RealNum.fromNum(4));
  expect(done).toBe(false);

  [value, done] = evalObj.eval(NegInfPrec);
  expect(value).toObjEqual(RealNum.zero);
  expect(done).toBe(false);
});
