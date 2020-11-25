// @flow

import fc from 'fast-check';
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

  const digits2 = Digits.fromStr('98765');
  expect([...digits.concat(digits2)]).toStrictEqual([
    1,
    2,
    3,
    4,
    5,
    9,
    8,
    7,
    6,
    5,
  ]);
});

test.each([
  [1, 1, true],
  [12345, 12345, true],
  [12345, 123456, false],
  [12345, 12346, false],
  [0, 0, true],
  [0, 1, false],
  [1234, 12340, false],
  [10, 1, false],
])(
  'comparing digits %o == %o should be %p',
  (v1: number, v2: number, res: boolean) => {
    if (res) {
      expect(Digits.fromNum(v1)).toObjEqual(Digits.fromNum(v2));
    } else {
      expect(Digits.fromNum(v1)).not.toObjEqual(Digits.fromNum(v2));
    }
  },
);

test.each([
  ['0', '1'],
  ['', '1'],
  ['1', '2'],
  ['9', '10'],
  ['000', '001'],
  ['999', '1000'],
  ['59', '60'],
  ['099', '100'],
])('expect digits %o + 1 == %o', (s1: string, s2: string) => {
  expect(Digits.fromStr(s1).add1().toString()).toBe(s2);
});

test('arbitrary add1 check', () => {
  fc.assert(
    fc.property(fc.bigUintN(33220), (n: {}) => {
      expect(Digits.fromStr(n.toString()).add1().toString()).toBe(
        // $FlowIgnore[bigint-unsupported]
        (n + 1n).toString(),
      );
    }),
  );
});
