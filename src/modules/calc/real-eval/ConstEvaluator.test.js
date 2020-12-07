// @flow

import RealNum from '../RealNum';
import Precision, { RegularPrec, InfPrec, NegInfPrec } from '../Precision';
import ConstEvaluator from './ConstEvaluator';

const evalSequences = [
  [
    '4.3',
    [
      [NegInfPrec, '0', false],
      [new RegularPrec(0), '4', false],
      [new RegularPrec(1), '4.3', true],
      [InfPrec, '4.3', true],
      [new RegularPrec(0), '4', false],
      [NegInfPrec, '0', false],
    ],
  ],
];

test.each(evalSequences)(
  'evaluates with the given sequence %#',
  (a, seq: Array<[Precision, string, boolean]>) => {
    const evaluator = new ConstEvaluator(RealNum.fromStr(a));

    for (const [prec, expSum, expDone] of seq) {
      const [sum, done] = evaluator.eval(prec);
      expect(sum.toString()).toBe(expSum);
      expect(done).toBe(expDone);
    }
  },
);
