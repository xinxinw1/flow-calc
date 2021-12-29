// @flow

import { type ExtendExpect } from '../ExtendExpect.test-helper';

import ContinuableRealNum from './ContinuableRealNum';
import { type Precision, RegularPrec, InfPrec } from './Precision';
import RealNum from './RealNum';
import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('initializes correctly', () => {
  const contNum = new ContinuableRealNum();

  const [diffAtPrec, diffAfterPrec] = contNum.cont(
    RealNum.fromStr('1'),
    new RegularPrec(0),
  );
  expect(diffAtPrec).toObjEqual(RealNum.zero);
  expect(diffAfterPrec).toObjEqual(RealNum.fromStr('1'));
  expect(contNum.prevLastDig).toBe(1);
  expect(contNum.prevPrec).toObjEqual(new RegularPrec(0));
});

test('throws when repeating precisions', () => {
  const contNum = new ContinuableRealNum();

  const [diffAtPrec, diffAfterPrec] = contNum.cont(
    RealNum.fromStr('1'),
    new RegularPrec(0),
  );
  expect(diffAtPrec).toObjEqual(RealNum.zero);
  expect(diffAfterPrec).toObjEqual(RealNum.fromStr('1'));

  expect(() => {
    contNum.cont(RealNum.fromStr('1'), new RegularPrec(0));
  }).toThrow('ContinuableRealNum new prec must be > prev prec');
});

type SeqTuple = [string, Precision, string, string];

const sequences: Array<[Array<SeqTuple>]> = [
  [
    [
      ['1', new RegularPrec(0), '0', '1'],
      ['0.4', new RegularPrec(1), '-1', '0.4'],
      ['0.49', new RegularPrec(2), '0', '0.09'],
      ['0.49', new RegularPrec(3), '0', '0'],
      ['0.4891', new RegularPrec(4), '-0.001', '0.0001'],
      ['0.4891', new RegularPrec(5), '0', '0'],
      ['0.4891', new InfPrec(), '0', '0'],
    ],
  ],
  [
    [
      ['2', new RegularPrec(0), '0', '2'],
      ['1.5', new RegularPrec(1), '-1', '0.5'],
      ['1.59', new RegularPrec(2), '0', '0.09'],
      ['1.595', new RegularPrec(3), '0', '0.005'],
      ['1.595', new RegularPrec(4), '0', '0'],
      ['1.595', new RegularPrec(5), '0', '0'],
      ['1.5950001', new InfPrec(), '0', '0.0000001'],
    ],
  ],
  [
    [
      ['1', new RegularPrec(0), '0', '1'],
      ['0.01', new InfPrec(), '-1', '0.01'],
    ],
  ],
  [
    [
      ['1', new RegularPrec(0), '0', '1'],
      ['0.09', new InfPrec(), '-1', '0.09'],
    ],
  ],
  [
    [
      ['-1', new RegularPrec(0), '0', '-1'],
      ['-0.4', new InfPrec(), '1', '-0.4'],
    ],
  ],
  [
    [
      ['-2', new RegularPrec(0), '0', '-2'],
      ['-1.5', new InfPrec(), '1', '-0.5'],
    ],
  ],
  [
    [
      ['0.4891', new RegularPrec(5), '0', '0.4891'],
      ['0.4891', new InfPrec(), '0', '0'],
    ],
  ],
  [
    [
      ['1.595', new RegularPrec(5), '0', '1.595'],
      ['1.5950001', new InfPrec(), '0', '0.0000001'],
    ],
  ],
];

test.each(sequences)(
  'works with the given sequence %#',
  (seq: Array<SeqTuple>) => {
    const contNum = new ContinuableRealNum();

    for (const [a, prec, expDiffAtPrec, expDiffAfterPrec] of seq) {
      const [diffAtPrec, diffAfterPrec] = contNum.cont(
        RealNum.fromStr(a),
        prec,
      );
      expect(diffAtPrec.toString()).toBe(expDiffAtPrec);
      expect(diffAfterPrec.toString()).toBe(expDiffAfterPrec);
    }
  },
);
