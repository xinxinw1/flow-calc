// @flow

import RealNum from './RealNum';

test('RealNum.zero is correct', () => {
  const n: RealNum = RealNum.zero;

  expect(n.digits.empty()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('creates RealNum from string', () => {
  let n: RealNum = RealNum.zero;

  n = RealNum.fromStr('1');
  expect([...n.digits]).toStrictEqual([1]);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('10.5');
  expect([...n.digits]).toStrictEqual([1, 0, 5]);
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('0');
  expect(n.digits.empty()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('-00.00');
  expect(n.digits.empty()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('-1000');
  expect([...n.digits]).toStrictEqual([1]);
  expect(n.exp).toBe(3);
  expect(n.pos).toBe(false);

  n = RealNum.fromStr('0.004000');
  expect([...n.digits]).toStrictEqual([4]);
  expect(n.exp).toBe(-3);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('123456789123456789123456789');
  expect([...n.digits]).toStrictEqual([
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
  ]);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('creates RealNum from num', () => {
  let n: RealNum = RealNum.zero;

  n = RealNum.fromNum(1);
  expect([...n.digits]).toStrictEqual([1]);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromNum(10.5);
  expect([...n.digits]).toStrictEqual([1, 0, 5]);
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(true);
});

test('RealNum.one is correct', () => {
  const n: RealNum = RealNum.one;

  expect([...n.digits]).toStrictEqual([1]);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('cannot change RealNum static values', () => {
  expect(() => {
    RealNum.zero = RealNum.fromNum(1);
  }).toThrow("Cannot assign to read only property 'zero'");
});
