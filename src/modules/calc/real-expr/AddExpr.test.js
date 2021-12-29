// @flow

import RealNum from '../RealNum';
import { RealRegularResult } from '../RealEvalResult';
import CalcEnvironment from '../CalcEnvironment';
import { RegularPrec, InfPrec } from '../Precision';
import ConstExpr from './ConstExpr';
import AddExpr from './AddExpr';

import _, { type ObjEqualMatcher } from '../toObjEqual.test-helper';
import { type ExtendExpect } from '../../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('expr can make evaluator', () => {
  const expr = new AddExpr(
    new ConstExpr(RealNum.fromStr('4.3')),
    new ConstExpr(RealNum.fromStr('2.5')),
  );
  const env = new CalcEnvironment({ zeroTestAdditionalPrecLimit: 0 });
  const evaluator = expr.makeEvaluator(env);

  const res = evaluator.eval(new RegularPrec(1));
  expect(res instanceof RealRegularResult);
  if (res instanceof RealRegularResult) {
    expect(res.value).toObjEqual(RealNum.fromStr('6.8'));
    expect(res.precision).toObjEqual(new InfPrec());
    expect(res.isDone()).toBe(true);
  }
});

test('expr can get uniq string', () => {
  const expr = new AddExpr(
    new ConstExpr(RealNum.fromStr('4.3')),
    new ConstExpr(RealNum.fromStr('2.5')),
  );
  expect(expr.uniqString()).toBe('Add(2.5,4.3)');
});
