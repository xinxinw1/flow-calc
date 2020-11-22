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

test('equals is correct', () => {
  const tests: Array<[number, number, boolean]> = [
    [1, 1, true],
    [12345, 12345, true],
    [12345, 123456, false],
    [12345, 12346, false],
    [0, 0, true],
    [0, 1, false],
    [1, -1, false],
    [1234, 12340, false],
    [0.001, 0.0001, false],
    [0.001, 0.001, true],
  ];

  for (const [v1, v2, res] of tests) {
    expect(RealNum.fromNum(v1).equals(RealNum.fromNum(v2))).toBe(res);
  }
});

test('can negate', () => {
  expect(RealNum.fromNum(1).neg().equals(RealNum.fromNum(-1))).toBe(true);
  expect(RealNum.zero.neg().equals(RealNum.zero)).toBe(true);
  expect(RealNum.fromNum(-124).neg().equals(RealNum.fromNum(124))).toBe(true);
});
