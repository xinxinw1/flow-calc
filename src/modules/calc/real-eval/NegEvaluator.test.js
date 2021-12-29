// @flow

import RealNum from '../RealNum';
import CalcEnvironment from '../CalcEnvironment';
import {
  type ZeroTestResult,
  ZeroResult,
  NonZeroResult,
} from '../ZeroTestResult';
import { type Precision, RegularPrec, InfPrec, NegInfPrec } from '../Precision';
import { RegularSize } from '../Size';
import ConstEvaluator from './ConstEvaluator';
import NegEvaluator from './NegEvaluator';
import {
  checkEvaluatorSeq,
  checkZeronessSeq,
} from './RealEvaluator.test-helper';

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
    const env = new CalcEnvironment({ zeroTestAdditionalPrecLimit: 0 });
    const evaluator = new NegEvaluator(
      env,
      new ConstEvaluator(env, RealNum.fromStr(a)),
    );
    checkEvaluatorSeq(evaluator, seq);
  },
);

type ZeroTuple = [Precision, ZeroTestResult];

const zeroSequences: Array<[string, Array<ZeroTuple>]> = [
  [
    '4.3',
    [
      [new NegInfPrec(), new NonZeroResult(false, new RegularSize(1))],
      [new RegularPrec(-200), new NonZeroResult(false, new RegularSize(1))],
      [new RegularPrec(0), new NonZeroResult(false, new RegularSize(1))],
      [new InfPrec(), new NonZeroResult(false, new RegularSize(1))],
    ],
  ],
  [
    '-5.3',
    [
      [new NegInfPrec(), new NonZeroResult(true, new RegularSize(1))],
      [new RegularPrec(-200), new NonZeroResult(true, new RegularSize(1))],
      [new RegularPrec(0), new NonZeroResult(true, new RegularSize(1))],
      [new InfPrec(), new NonZeroResult(true, new RegularSize(1))],
    ],
  ],
  [
    '0',
    [
      [new NegInfPrec(), new ZeroResult()],
      [new RegularPrec(-200), new ZeroResult()],
      [new RegularPrec(0), new ZeroResult()],
      [new InfPrec(), new ZeroResult()],
    ],
  ],
];

test.each(zeroSequences)(
  'tests zeroness with the given sequence %#',
  (a: string, seq: Array<ZeroTuple>) => {
    const env = new CalcEnvironment({ zeroTestAdditionalPrecLimit: 0 });
    const evaluator = new NegEvaluator(
      env,
      new ConstEvaluator(env, RealNum.fromStr(a)),
    );
    checkZeronessSeq(evaluator, seq);
  },
);
