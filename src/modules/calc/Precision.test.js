// @flow

import { type Precision, RegularPrec, InfPrec, NegInfPrec } from './Precision';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('creates precision', () => {
  const r = new RegularPrec(3);

  (r: Precision);
  expect(r.prec).toBe(3);

  expect(() => {
    r.prec = 4;
  }).toThrow('Cannot assign to read only property');

  (new InfPrec(): Precision);
  (new NegInfPrec(): Precision);

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
  [new RegularPrec(0), new InfPrec(), false],
  [new RegularPrec(0), new NegInfPrec(), false],
  [new InfPrec(), new RegularPrec(0), false],
  [new NegInfPrec(), new RegularPrec(0), false],
  [new InfPrec(), new InfPrec(), true],
  [new InfPrec(), new NegInfPrec(), false],
  [new NegInfPrec(), new InfPrec(), false],
  [new NegInfPrec(), new NegInfPrec(), true],
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
  [new RegularPrec(0), new InfPrec(), true],
  [new RegularPrec(0), new NegInfPrec(), false],
  [new InfPrec(), new RegularPrec(0), false],
  [new NegInfPrec(), new RegularPrec(0), true],
  [new InfPrec(), new InfPrec(), true],
  [new InfPrec(), new NegInfPrec(), false],
  [new NegInfPrec(), new InfPrec(), true],
  [new NegInfPrec(), new NegInfPrec(), true],
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
  [new RegularPrec(0), new InfPrec(), false],
  [new RegularPrec(0), new NegInfPrec(), true],
  [new InfPrec(), new RegularPrec(0), true],
  [new NegInfPrec(), new RegularPrec(0), false],
  [new InfPrec(), new InfPrec(), false],
  [new InfPrec(), new NegInfPrec(), true],
  [new NegInfPrec(), new InfPrec(), false],
  [new NegInfPrec(), new NegInfPrec(), false],
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
  [new RegularPrec(0), new InfPrec(), false],
  [new RegularPrec(0), new NegInfPrec(), true],
  [new InfPrec(), new RegularPrec(0), true],
  [new NegInfPrec(), new RegularPrec(0), false],
  [new InfPrec(), new InfPrec(), true],
  [new InfPrec(), new NegInfPrec(), true],
  [new NegInfPrec(), new InfPrec(), false],
  [new NegInfPrec(), new NegInfPrec(), true],
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
  [new RegularPrec(0), new InfPrec(), true],
  [new RegularPrec(0), new NegInfPrec(), false],
  [new InfPrec(), new RegularPrec(0), false],
  [new NegInfPrec(), new RegularPrec(0), true],
  [new InfPrec(), new InfPrec(), false],
  [new InfPrec(), new NegInfPrec(), false],
  [new NegInfPrec(), new InfPrec(), true],
  [new NegInfPrec(), new NegInfPrec(), false],
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
  [new RegularPrec(0), new InfPrec(), new InfPrec()],
  [new RegularPrec(0), new NegInfPrec(), new NegInfPrec()],
  [new InfPrec(), new RegularPrec(0), new InfPrec()],
  [new NegInfPrec(), new RegularPrec(0), new NegInfPrec()],
  [new InfPrec(), new InfPrec(), new InfPrec()],
  [new NegInfPrec(), new NegInfPrec(), new NegInfPrec()],
  [new InfPrec(), 0, new InfPrec()],
  [new NegInfPrec(), 0, new NegInfPrec()],
])(
  'adds precisions %o + %o should be %o',
  (p1: Precision, p2: number | Precision, p3: Precision) => {
    expect(p1.add(p2)).toObjEqual(p3);
  },
);

test.each([
  [new InfPrec(), new NegInfPrec()],
  [new NegInfPrec(), new InfPrec()],
])(
  'adds precisions %o + %o should be an error',
  (p1: Precision, p2: Precision) => {
    expect(() => {
      p1.add(p2);
    }).toThrow('cannot add inf integer with neg inf integer');
  },
);
