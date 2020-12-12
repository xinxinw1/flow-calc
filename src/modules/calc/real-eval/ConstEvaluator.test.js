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
  [
    '5.3',
    [
      [new RegularPrec(-1), '10', false],
      [new RegularPrec(0), '5', false],
      [new RegularPrec(1), '5.3', true],
    ],
  ],
  [
    '0',
    [
      [new RegularPrec(-1), '0', true],
      [NegInfPrec, '0', true],
    ],
  ],
];

test.each(evalSequences)(
  'evaluates with the given sequence %#',
  (a, seq: Array<[Precision, string, boolean]>) => {
    const evaluator = new ConstEvaluator(RealNum.fromStr(a));

    for (const [prec, expVal, expDone] of seq) {
      const [val, done] = evaluator.eval(prec);
      expect(val.toString()).toBe(expVal);
      expect(done).toBe(expDone);
      expect(val.size().le(evaluator.maxSize())).toBe(true);
    }
  },
);
