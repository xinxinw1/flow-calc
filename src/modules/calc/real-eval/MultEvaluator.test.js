// @flow

import MultEvaluator from './MultEvaluator';
import RealNum from '../RealNum';
import { type Precision, RegularPrec, InfPrec } from '../Precision';
import ConstEvaluator from './ConstEvaluator';
import { checkEvaluatorSeq } from './RealEvaluator.test-helper';

type SeqTuple = [Precision, string, boolean];

const evalSequences: Array<[string, string, Array<SeqTuple>]> = [
  [
    '0.4891',
    '1.5950001',
    [
      // 0.49 * 1.6 = 0.784
      [new RegularPrec(0), '1', false],
      // 0.489 * 1.60 = 0.7824
      [new RegularPrec(1), '0.8', false],
      // 0.4891 * 1.595 = 0.7801145
      [new RegularPrec(2), '0.78', false],
      // 0.4891  * 1.5950 = 0.7801145
      [new RegularPrec(3), '0.78', false],
      // 0.4891  * 1.59500 = 0.7801145
      [new RegularPrec(4), '0.7801', false],
      // 0.4891  * 1.595000 = 0.7801145
      [new RegularPrec(5), '0.78011', false],
      // 0.4891  * 1.5950001 = 0.78011454891
      [new RegularPrec(6), '0.780115', false],
      [new RegularPrec(7), '0.7801145', false],
      [new RegularPrec(8), '0.78011455', false],
      [new RegularPrec(9), '0.780114549', false],
      [new RegularPrec(11), '0.78011454891', true],
      [new InfPrec(), '0.78011454891', true],
      [new RegularPrec(5), '0.78011', false],
    ],
  ],
  [
    '-0.45214',
    '9.55284',
    [
      // 0 * 10 = 0
      [new RegularPrec(-2), '0', false],
      // -0.5 * 10 = -5
      [new RegularPrec(-1), '-10', false],
      // -0.45 * 9.6 = -4.32
      [new RegularPrec(0), '-4', false],
      // changes because we now know it's
      // abs value is smaller than 5
      [new RegularPrec(-1), '0', false],
      // -0.452 + 9.55 = -4.3166
      [new RegularPrec(1), '-4.3', false],
      // -0.4521 + 9.553 = -4.3189113
      [new RegularPrec(2), '-4.32', false],
      // -0.45214 + 9.5528 = -4.319202992
      [new RegularPrec(3), '-4.319', false],
      // -0.45214 + 9.55284 = -4.3192210776
      [new RegularPrec(4), '-4.3192', false],
      [new RegularPrec(10), '-4.3192210776', true],
      [new RegularPrec(2), '-4.32', false],
      [new InfPrec(), '-4.3192210776', true],
    ],
  ],
  [
    '0.00014525',
    '-0.00014484',
    [
      [new RegularPrec(0), '0', false],
      [new RegularPrec(1), '0', false],
      // 0.00015 * -0.00014 = -0.0000000196
      [new RegularPrec(7), '0', false],
      // 0.000145 * -0.000145 = -0.000000021025
      [new RegularPrec(8), '-0.00000002', false],
      // 0.0001453 * -0.0001448 = -0.00000002103944
      [new RegularPrec(9), '-0.000000021', false],
      // 0.00014525 * -0.00014484 = -0.00000002103801
      [new RegularPrec(10), '-0.000000021', false],
      [new RegularPrec(14), '-0.00000002103801', true],
      [new InfPrec(), '-0.00000002103801', true],
    ],
  ],
];

test.each(evalSequences)(
  'evaluates with the given sequence %#',
  (a: string, b: string, seq: Array<SeqTuple>) => {
    const aEval = new ConstEvaluator(RealNum.fromStr(a));
    const bEval = new ConstEvaluator(RealNum.fromStr(b));
    const evaluator = new MultEvaluator(aEval, bEval);
    checkEvaluatorSeq(evaluator, seq);
  },
);
