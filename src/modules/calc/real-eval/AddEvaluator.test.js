// @flow

import AddEvaluator from './AddEvaluator';
import RealNum from '../RealNum';
import Precision, { RegularPrec, InfPrec } from '../Precision';
import ConstEvaluator from './ConstEvaluator';

const evalSequences = [
  [
    '0.4891',
    '1.5950001',
    [
      [new RegularPrec(0), '2', false],
      [new RegularPrec(1), '2.1', false],
      [new RegularPrec(2), '2.08', false],
      [new RegularPrec(3), '2.084', false],
      [new RegularPrec(4), '2.0841', false],
      [new RegularPrec(5), '2.0841', false],
      [new RegularPrec(6), '2.0841', false],
      [new RegularPrec(7), '2.0841001', true],
      [InfPrec, '2.0841001', true],
      [new RegularPrec(5), '2.0841', false],
    ],
  ],
  [
    '-0.45214',
    '-1.55284',
    [
      // -0.5 + -1.6 = -2.1
      [new RegularPrec(0), '-2', false],
      // -0.45 + -1.55 = -2
      [new RegularPrec(1), '-2', false],
      // -0.452 + -1.553 = -2.005
      [new RegularPrec(2), '-2.01', false],
      // -0.4521 + -1.5528 = -2.0049
      [new RegularPrec(3), '-2.005', false],
      [new RegularPrec(2), '-2.01', false],
      // -0.45214 + -1.55284 = -2.00498
      [new RegularPrec(4), '-2.005', false],
      // changes cause inputs are evaluated to 5 and
      // are now done so know to round down at prec 2
      [new RegularPrec(2), '-2', false],
      [new RegularPrec(5), '-2.00498', true],
      [new RegularPrec(2), '-2', false],
      [InfPrec, '-2.00498', true],
    ],
  ],
  [
    '0.00014525',
    '-0.00014484',
    [
      [new RegularPrec(0), '0', false],
      [new RegularPrec(1), '0', false],
      [new RegularPrec(3), '0', false],
      // 0.00015 - 0.00014 = 0.00001
      [new RegularPrec(4), '0', false],
      // 0.000145 - 0.000144 = 0.000001
      [new RegularPrec(5), '0', false],
      // 0.0001453 - 0.0001448 = 0.0000005
      [new RegularPrec(6), '0.000001', false],
      // 0.00014525 - 0.00014484 = 0.00000041
      [new RegularPrec(7), '0.0000004', false],
      [new RegularPrec(6), '0', false],
      [new RegularPrec(8), '0.00000041', true],
      [InfPrec, '0.00000041', true],
    ],
  ],
];

test.each(evalSequences)(
  'evaluates with the given sequence %#',
  (a, b, seq: Array<[Precision, string, boolean]>) => {
    const aEval = new ConstEvaluator(RealNum.fromStr(a));
    const bEval = new ConstEvaluator(RealNum.fromStr(b));
    const evaluator = new AddEvaluator(aEval, bEval);

    for (const [prec, expVal, expDone] of seq) {
      const [val, done] = evaluator.eval(prec);
      expect(val.toString()).toBe(expVal);
      expect(done).toBe(expDone);
    }
  },
);
