// @flow

import Precision, { RegularPrec, InfPrec, NegInfPrec } from './Precision';

test('creates precision', () => {
  expect(() => {
    const _ = new Precision();
  }).toThrow('Precision is an abstract class');

  const r = new RegularPrec(3);

  expect(r).toBeInstanceOf(Precision);
  expect(r.prec).toEqual(3);

  expect(() => {
    r.prec = 4;
  }).toThrow('Cannot assign to read only property');

  expect(InfPrec).toBeInstanceOf(Precision);

  const s: Precision = r;

  if (s instanceof RegularPrec) {
    // check that flow type inference works here
    expect(s.prec).toEqual(3);
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
])('compares precisions %o == %o should be %p', (p1, p2, res) => {
  if (res) {
    expect(p1).toObjEqual(p2);
  } else {
    expect(p1).not.toObjEqual(p2);
  }
});

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
])('compares precisions %o <= %o should be %p', (p1, p2, res) => {
  expect(p1.le(p2)).toBe(res);
});
