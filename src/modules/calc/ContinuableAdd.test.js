// @flow

import ContinuableAdd from './ContinuableAdd';
import RealNum from './RealNum';
import Precision, { RegularPrec, InfPrec } from './Precision';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('initializes correctly', () => {
  const cont = new ContinuableAdd();

  const n = cont.eval(
    RealNum.fromStr('1'),
    RealNum.fromStr('2'),
    new RegularPrec(0),
  );
  expect(n).toObjEqual(RealNum.fromStr('3'));
  expect(cont.result).toObjEqual(RealNum.fromStr('3'));
});

test('throws when repeating precisions', () => {
  const cont = new ContinuableAdd();

  const n = cont.eval(
    RealNum.fromStr('1'),
    RealNum.fromStr('2'),
    new RegularPrec(0),
  );
  expect(n).toObjEqual(RealNum.fromStr('3'));

  expect(() => {
    cont.eval(RealNum.fromStr('1'), RealNum.fromStr('2'), new RegularPrec(0));
  }).toThrow('ContinuableRealNum new prec must be > prev prec');
});

const sequences = [
  [
    [
      ['1', '2', new RegularPrec(0), '3'],
      ['0.4', '1.5', new RegularPrec(1), '1.9'],
      ['0.49', '1.59', new RegularPrec(2), '2.08'],
      ['0.49', '1.595', new RegularPrec(3), '2.085'],
      ['0.4891', '1.595', new RegularPrec(4), '2.0841'],
      ['0.4891', '1.595', new RegularPrec(5), '2.0841'],
      ['0.4891', '1.5950001', InfPrec, '2.0841001'],
    ],
  ],
  [
    [
      ['0.4891', '1.595', new RegularPrec(5), '2.0841'],
      ['0.4891', '1.5950001', InfPrec, '2.0841001'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), '2'],
      ['0.01', '0.01', InfPrec, '0.02'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), '2'],
      ['0.09', '0.09', InfPrec, '0.18'],
    ],
  ],
  [
    [
      ['-1', '-2', new RegularPrec(0), '-3'],
      ['-0.4', '-1.5', InfPrec, '-1.9'],
    ],
  ],
];

test.each(sequences)(
  'works with the given sequence %#',
  (seq: Array<[string, string, Precision, string]>) => {
    const cont = new ContinuableAdd();

    for (const [a, b, prec, sum] of seq) {
      const n = cont.eval(RealNum.fromStr(a), RealNum.fromStr(b), prec);
      expect(n.toString()).toBe(sum);
    }
  },
);
