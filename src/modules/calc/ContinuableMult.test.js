// @flow

import ContinuableMult from './ContinuableMult';
import RealNum from './RealNum';
import Precision, { RegularPrec, InfPrec } from './Precision';

test('initializes correctly', () => {
  const cont = new ContinuableMult();

  const n = cont.eval(
    RealNum.fromStr('1'),
    RealNum.fromStr('2'),
    new RegularPrec(0),
  );
  expect(n).toObjEqual(RealNum.fromStr('2'));
  expect(cont.result).toObjEqual(RealNum.fromStr('2'));
});

test('throws when repeating precisions', () => {
  const cont = new ContinuableMult();

  const n = cont.eval(
    RealNum.fromStr('1'),
    RealNum.fromStr('2'),
    new RegularPrec(0),
  );
  expect(n).toObjEqual(RealNum.fromStr('2'));

  expect(() => {
    cont.eval(RealNum.fromStr('1'), RealNum.fromStr('2'), new RegularPrec(0));
  }).toThrow('ContinuableRealNum new prec must be > prev prec');
});

const sequences = [
  [
    [
      ['1', '2', new RegularPrec(0), '2'],
      ['0.4', '1.5', new RegularPrec(1), '0.6'],
      ['0.49', '1.59', new RegularPrec(2), '0.7791'],
      ['0.49', '1.595', new RegularPrec(3), '0.78155'],
      ['0.4891', '1.595', new RegularPrec(4), '0.7801145'],
      ['0.4891', '1.595', new RegularPrec(5), '0.7801145'],
      ['0.4891', '1.5950001', InfPrec, '0.78011454891'],
    ],
  ],
  [
    [
      ['0.4891', '1.595', new RegularPrec(5), '0.7801145'],
      ['0.4891', '1.5950001', InfPrec, '0.78011454891'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), '1'],
      ['0.01', '0.01', InfPrec, '0.0001'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), '1'],
      ['0.09', '0.09', InfPrec, '0.0081'],
    ],
  ],
  [
    [
      ['-1', '-2', new RegularPrec(0), '2'],
      ['-0.4', '-1.5', InfPrec, '0.6'],
    ],
  ],
  [
    [
      ['1', '-2', new RegularPrec(0), '-2'],
      ['0.4', '-1.5', InfPrec, '-0.6'],
    ],
  ],
];

test.each(sequences)(
  'works with the given sequence %#',
  (seq: Array<[string, string, Precision, string]>) => {
    const cont = new ContinuableMult();

    for (const [a, b, prec, sum] of seq) {
      const n = cont.eval(RealNum.fromStr(a), RealNum.fromStr(b), prec);
      expect(n.toString()).toBe(sum);
    }
  },
);
