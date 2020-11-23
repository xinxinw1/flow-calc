// @flow

import Digits from './Digits';

test('gets empty Digits', () => {
  const digits = Digits.empty;
  expect(digits.size()).toBe(0);
});

test('creates Digits from iter', () => {
  const digits = Digits.fromIter([1, 2, 3, 4, 5]);
  expect(digits.size()).toBe(5);
});

test('creates Digits from string', () => {
  const digits = Digits.fromStr('12345');
  expect(digits.size()).toBe(5);
});

test('iterate on Digits', () => {
  const digits = Digits.fromStr('12345');
  expect([...digits]).toStrictEqual([1, 2, 3, 4, 5]);
});

test('Digits operations', () => {
  const digits = Digits.fromStr('12345');
  expect(digits.head()).toBe(1);
  expect(digits.last()).toBe(5);
  expect([...digits.init()]).toStrictEqual([1, 2, 3, 4]);
  expect([...digits.tail()]).toStrictEqual([2, 3, 4, 5]);
  expect([...digits.push(6)]).toStrictEqual([1, 2, 3, 4, 5, 6]);
  expect([...digits.cons(0)]).toStrictEqual([0, 1, 2, 3, 4, 5]);
});
