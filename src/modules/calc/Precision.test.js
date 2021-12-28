// @flow

import Precision, { RegularPrec, InfPrec, NegInfPrec } from './Precision';
import { RegularInt } from './ExtInteger';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('creates precision', () => {
  expect(() => {
    const _ = new Precision(new RegularInt(5));
  }).toThrow('Precision is an abstract class');

  const r = new RegularPrec(3);

  expect(r).toBeInstanceOf(Precision);
  expect(r.prec).toBe(3);

  expect(() => {
    r.prec = 4;
  }).toThrow('Cannot assign to read only property');

  expect(InfPrec).toBeInstanceOf(Precision);

  const s: Precision = r;

  if (s instanceof RegularPrec) {
    // check that flow type inference works here
    expect(s.prec).toBe(3);
  }
});

test.each([
  [new RegularPrec(0), new RegularPrec(0), true],
  [new RegularPrec(0), new RegularPrec(1), false],
  [new RegularPrec(1), new RegularPrec(0), false],
  [new RegularPrec(0), InfPrec, false],
  [new RegularPrec(0), NegInfPrec, false],
  [InfPrec, new RegularPrec(0), false],
  [NegInfPrec, new RegularPrec(0), false],
  [InfPrec, InfPrec, true],
  [InfPrec, NegInfPrec, false],
  [NegInfPrec, InfPrec, false],
  [NegInfPrec, NegInfPrec, true],
])(
  'compares precisions %o == %o should be %p',
  (p1: Precision, p2: Precision, res: boolean) => {
    if (res) {
      expect(p1).toObjEqual(p2);
    } else {
      expect(p1).not.toObjEqual(p2);
    }
  },
);

test.each([
  [new RegularPrec(0), new RegularPrec(0), true],
  [new RegularPrec(0), new RegularPrec(1), true],
  [new RegularPrec(1), new RegularPrec(0), false],
  [new RegularPrec(0), InfPrec, true],
  [new RegularPrec(0), NegInfPrec, false],
  [InfPrec, new RegularPrec(0), false],
  [NegInfPrec, new RegularPrec(0), true],
  [InfPrec, InfPrec, true],
  [InfPrec, NegInfPrec, false],
  [NegInfPrec, InfPrec, true],
  [NegInfPrec, NegInfPrec, true],
])(
  'compares precisions %o <= %o should be %p',
  (p1: Precision, p2: Precision, res: boolean) => {
    expect(p1.le(p2)).toBe(res);
  },
);

test.each([
  [new RegularPrec(0), new RegularPrec(0), false],
  [new RegularPrec(0), new RegularPrec(1), false],
  [new RegularPrec(1), new RegularPrec(0), true],
  [new RegularPrec(0), InfPrec, false],
  [new RegularPrec(0), NegInfPrec, true],
  [InfPrec, new RegularPrec(0), true],
  [NegInfPrec, new RegularPrec(0), false],
  [InfPrec, InfPrec, false],
  [InfPrec, NegInfPrec, true],
  [NegInfPrec, InfPrec, false],
  [NegInfPrec, NegInfPrec, false],
])(
  'compares precisions %o > %o should be %p',
  (p1: Precision, p2: Precision, res: boolean) => {
    expect(p1.gt(p2)).toBe(res);
  },
);

test.each([
  [new RegularPrec(0), new RegularPrec(0), true],
  [new RegularPrec(0), new RegularPrec(1), false],
  [new RegularPrec(1), new RegularPrec(0), true],
  [new RegularPrec(0), InfPrec, false],
  [new RegularPrec(0), NegInfPrec, true],
  [InfPrec, new RegularPrec(0), true],
  [NegInfPrec, new RegularPrec(0), false],
  [InfPrec, InfPrec, true],
  [InfPrec, NegInfPrec, true],
  [NegInfPrec, InfPrec, false],
  [NegInfPrec, NegInfPrec, true],
])(
  'compares precisions %o >= %o should be %p',
  (p1: Precision, p2: Precision, res: boolean) => {
    expect(p1.ge(p2)).toBe(res);
  },
);

test.each([
  [new RegularPrec(0), new RegularPrec(0), false],
  [new RegularPrec(0), new RegularPrec(1), true],
  [new RegularPrec(1), new RegularPrec(0), false],
  [new RegularPrec(0), InfPrec, true],
  [new RegularPrec(0), NegInfPrec, false],
  [InfPrec, new RegularPrec(0), false],
  [NegInfPrec, new RegularPrec(0), true],
  [InfPrec, InfPrec, false],
  [InfPrec, NegInfPrec, false],
  [NegInfPrec, InfPrec, true],
  [NegInfPrec, NegInfPrec, false],
])(
  'compares precisions %o < %o should be %p',
  (p1: Precision, p2: Precision, res: boolean) => {
    expect(p1.lt(p2)).toBe(res);
  },
);

test.each([
  [new RegularPrec(0), new RegularPrec(0), new RegularPrec(0)],
  [new RegularPrec(0), new RegularPrec(1), new RegularPrec(1)],
  [new RegularPrec(1), new RegularPrec(0), new RegularPrec(1)],
  [new RegularPrec(0), 1, new RegularPrec(1)],
  [new RegularPrec(1), 0, new RegularPrec(1)],
  [new RegularPrec(0), InfPrec, InfPrec],
  [new RegularPrec(0), NegInfPrec, NegInfPrec],
  [InfPrec, new RegularPrec(0), InfPrec],
  [NegInfPrec, new RegularPrec(0), NegInfPrec],
  [InfPrec, InfPrec, InfPrec],
  [NegInfPrec, NegInfPrec, NegInfPrec],
  [InfPrec, 0, InfPrec],
  [NegInfPrec, 0, NegInfPrec],
])(
  'adds precisions %o + %o should be %o',
  (p1: Precision, p2: number | Precision, p3: Precision) => {
    expect(p1.add(p2)).toObjEqual(p3);
  },
);

test.each([
  [InfPrec, NegInfPrec],
  [NegInfPrec, InfPrec],
])(
  'adds precisions %o + %o should be an error',
  (p1: Precision, p2: Precision) => {
    expect(() => {
      p1.add(p2);
    }).toThrow('cannot add inf integer with neg inf integer');
  },
);
