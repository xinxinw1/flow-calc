// @flow

import { downCast, unknownSubtype } from './typetools';

test('down casting works', () => {
  class Base {}
  class Child extends Base {}
  class Child2 extends Base {}

  const b: Base = new Child();

  const c: Child = downCast(b, Child);
  expect(c).toBe(b);

  expect(() => {
    downCast(b, Child2);
  }).toThrow('Cannot cast value of type Child to class Child2');
});

test('unknown subtype works', () => {
  class Base {}
  class Child extends Base {}

  const b: Base = new Child();

  expect(() => {
    unknownSubtype(b, Base);
  }).toThrow('Unknown Base type Child');
});
