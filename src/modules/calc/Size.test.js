// @flow

import { type ExtendExpect } from '../ExtendExpect.test-helper';

import { type Size, RegularSize, NegInfSize } from './Size';
import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('creates size', () => {
  const r = new RegularSize(3);

  (r: Size);
  expect(r.size).toBe(3);

  expect(() => {
    r.size = 4;
  }).toThrow('Cannot assign to read only property');

  (new NegInfSize(): Size);

  const s: Size = r;
  if (s instanceof RegularSize) {
    // check that flow type inference works here
    expect(s.size).toBe(3);
  }
});

test.each([
  [new RegularSize(0), new RegularSize(0), true],
  [new RegularSize(0), new RegularSize(1), false],
  [new RegularSize(1), new RegularSize(0), false],
  [new RegularSize(0), new NegInfSize(), false],
  [new NegInfSize(), new RegularSize(0), false],
  [new NegInfSize(), new NegInfSize(), true],
])('compares sizes %o == %o should be %p', (s1, s2, res) => {
  if (res) {
    expect(s1).toObjEqual(s2);
  } else {
    expect(s1).not.toObjEqual(s2);
  }
});

test.each([
  [new RegularSize(0), new RegularSize(0), new RegularSize(0)],
  [new RegularSize(0), new RegularSize(1), new RegularSize(1)],
  [new RegularSize(1), new RegularSize(0), new RegularSize(1)],
  [new RegularSize(0), 1, new RegularSize(1)],
  [new RegularSize(1), 0, new RegularSize(1)],
  [new RegularSize(0), new NegInfSize(), new NegInfSize()],
  [new NegInfSize(), new RegularSize(0), new NegInfSize()],
  [new NegInfSize(), new NegInfSize(), new NegInfSize()],
  [new NegInfSize(), 0, new NegInfSize()],
])(
  'adds sizes %o + %o should be %o',
  (v1: Size, v2: number | Size, v3: Size) => {
    expect(v1.add(v2)).toObjEqual(v3);
  },
);

test.each([
  [new RegularSize(0), new RegularSize(0), new RegularSize(0)],
  [new RegularSize(0), new RegularSize(1), new RegularSize(1)],
  [new RegularSize(1), new RegularSize(0), new RegularSize(1)],
  [new RegularSize(0), 1, new RegularSize(1)],
  [new RegularSize(1), 0, new RegularSize(1)],
  [new RegularSize(0), new NegInfSize(), new RegularSize(0)],
  [new NegInfSize(), new RegularSize(0), new RegularSize(0)],
  [new NegInfSize(), new NegInfSize(), new NegInfSize()],
  [new NegInfSize(), 0, new RegularSize(0)],
])(
  'max size of %o and %o should be %o',
  (v1: Size, v2: number | Size, v3: Size) => {
    expect(v1.max(v2)).toObjEqual(v3);
  },
);
