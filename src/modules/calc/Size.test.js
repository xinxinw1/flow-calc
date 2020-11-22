// @flow

import Size, { RegularSize, NegInfSize } from './Size';

test('creates size', () => {
  expect(() => {
    const _ = new Size();
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
  [new RegularSize(0), NegInfSize, false],
  [NegInfSize, NegInfSize, true],
])('compares sizes %o == %o should be %p', (s1, s2, res) => {
  if (res) {
    expect(s1).toObjEqual(s2);
  } else {
    expect(s1).not.toObjEqual(s2);
  }
});
