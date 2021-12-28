// @flow

import RealNum from '../RealNum';
import { type Precision, RegularPrec, InfPrec, NegInfPrec } from '../Precision';
import ConstEvaluator from './ConstEvaluator';
import NegEvaluator from './NegEvaluator';
import { checkEvaluatorSeq } from './RealEvaluator.test-helper';

type SeqTuple = [Precision, string, boolean];

const evalSequences: Array<[string, Array<SeqTuple>]> = [
  [
    '4.3',
    [
      [new NegInfPrec(), '0', false],
      [new RegularPrec(0), '-4', false],
      [new RegularPrec(1), '-4.3', true],
      [new InfPrec(), '-4.3', true],
      [new RegularPrec(0), '-4', false],
      [new NegInfPrec(), '0', false],
    ],
  ],
];

test.each(evalSequences)(
  'evaluates with the given sequence %#',
  (a: string, seq: Array<SeqTuple>) => {
    const evaluator = new NegEvaluator(new ConstEvaluator(RealNum.fromStr(a)));
    checkEvaluatorSeq(evaluator, seq);
  },
);
