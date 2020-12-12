// @flow

import Size, { RegularSize, NegInfSize } from './Size';
import { RegularInt } from './ExtInteger';

test('creates size', () => {
  expect(() => {
    const _ = new Size(new RegularInt(5));
  }).toThrow('Size is an abstract class');

  const r = new RegularSize(3);

  expect(r).toBeInstanceOf(Size);
  expect(r.size).toEqual(3);

  expect(() => {
    r.size = 4;
  }).toThrow('Cannot assign to read only property');

  expect(NegInfSize).toBeInstanceOf(Size);

  const s: Size = r;

  if (s instanceof RegularSize) {
    // check that flow type inference works here
    expect(s.size).toEqual(3);
  }
});

test.each([
  [new RegularSize(0), new RegularSize(0), true],
  [new RegularSize(0), new RegularSize(1), false],
  [new RegularSize(1), new RegularSize(0), false],
  [new RegularSize(0), NegInfSize, false],
  [NegInfSize, new RegularSize(0), false],
  [NegInfSize, NegInfSize, true],
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
  [new RegularSize(0), NegInfSize, NegInfSize],
  [NegInfSize, new RegularSize(0), NegInfSize],
  [NegInfSize, NegInfSize, NegInfSize],
  [NegInfSize, 0, NegInfSize],
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
  [new RegularSize(0), NegInfSize, new RegularSize(0)],
  [NegInfSize, new RegularSize(0), new RegularSize(0)],
  [NegInfSize, NegInfSize, NegInfSize],
  [NegInfSize, 0, new RegularSize(0)],
])(
  'max size of %o and %o should be %o',
  (v1: Size, v2: number | Size, v3: Size) => {
    expect(v1.max(v2)).toObjEqual(v3);
  },
);
