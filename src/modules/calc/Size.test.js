// @flow

import {Size, RegularSize, NegInfSize} from './Size';

test('creates size', () => {
  expect(() => {
    const s = new Size();
  }).toThrowError('Size is an abstract class');

  const r = new RegularSize(3);

  expect(r).toBeInstanceOf(Size);
  expect(r.size).toEqual(3);

  expect(() => {
    r.size = 4;
  }).toThrowError('Cannot assign to read only property');

  expect(NegInfSize).toBeInstanceOf(Size);

  const s: Size = r;

  if (s instanceof RegularSize) {
    // check that flow type inference works here
    expect(s.size).toEqual(3);
  }
});
