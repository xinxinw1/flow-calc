// @flow

import ContinuableMult from './ContinuableMult';
import RealNum from './RealNum';
import { type Precision, RegularPrec, InfPrec } from './Precision';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('initializes correctly', () => {
  const cont = new ContinuableMult();

  const n = cont.eval(
    RealNum.fromStr('1'),
    RealNum.fromStr('2'),
    new RegularPrec(0),
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
    new RegularPrec(0),
  );
  expect(n).toObjEqual(RealNum.fromStr('2'));

  expect(() => {
    cont.eval(
      RealNum.fromStr('1'),
      RealNum.fromStr('2'),
      new RegularPrec(0),
      new RegularPrec(0),
    );
  }).toThrow('ContinuableRealNum new prec must be > prev prec');
});

type SeqTuple = [string, string, Precision, Precision, string];

const sequences: Array<[Array<SeqTuple>]> = [
  [
    [
      ['1', '2', new RegularPrec(0), new RegularPrec(0), '2'],
      ['0.4', '1.5', new RegularPrec(1), new RegularPrec(1), '0.6'],
      ['0.49', '1.59', new RegularPrec(2), new RegularPrec(2), '0.7791'],
      ['0.49', '1.595', new RegularPrec(3), new RegularPrec(3), '0.78155'],
      ['0.4891', '1.595', new RegularPrec(4), new RegularPrec(4), '0.7801145'],
      ['0.4891', '1.595', new RegularPrec(5), new RegularPrec(5), '0.7801145'],
      ['0.4891', '1.5950001', new InfPrec(), new InfPrec(), '0.78011454891'],
    ],
  ],
  [
    [
      ['0.4', '2', new RegularPrec(1), new RegularPrec(0), '0.8'],
      ['0.49', '1.5', new RegularPrec(2), new RegularPrec(1), '0.735'],
      ['0.49', '1.59', new RegularPrec(3), new RegularPrec(2), '0.7791'],
      ['0.4891', '1.595', new RegularPrec(4), new RegularPrec(3), '0.7801145'],
      ['0.4891', '1.595', new RegularPrec(5), new RegularPrec(4), '0.7801145'],
      ['0.4891', '1.595', new RegularPrec(6), new RegularPrec(5), '0.7801145'],
      ['0.4891', '1.5950001', new InfPrec(), new InfPrec(), '0.78011454891'],
    ],
  ],
  [
    [
      ['0.4891', '1.595', new RegularPrec(5), new RegularPrec(5), '0.7801145'],
      ['0.4891', '1.5950001', new InfPrec(), new InfPrec(), '0.78011454891'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), new RegularPrec(0), '1'],
      ['0.01', '0.01', new InfPrec(), new InfPrec(), '0.0001'],
    ],
  ],
  [
    [
      ['1', '1', new RegularPrec(0), new RegularPrec(0), '1'],
      ['0.09', '0.09', new InfPrec(), new InfPrec(), '0.0081'],
    ],
  ],
  [
    [
      ['-1', '-2', new RegularPrec(0), new RegularPrec(0), '2'],
      ['-0.4', '-1.5', new InfPrec(), new InfPrec(), '0.6'],
    ],
  ],
  [
    [
      ['1', '-2', new RegularPrec(0), new RegularPrec(0), '-2'],
      ['0.4', '-1.5', new InfPrec(), new InfPrec(), '-0.6'],
    ],
  ],
];

test.each(sequences)(
  'works with the given sequence %#',
  (seq: Array<SeqTuple>) => {
    const cont = new ContinuableMult();

    for (const [a, b, aPrec, bPrec, res] of seq) {
      const n = cont.eval(RealNum.fromStr(a), RealNum.fromStr(b), aPrec, bPrec);
      expect(n.toString()).toBe(res);
    }
  },
);
