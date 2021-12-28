// @flow

import fc from 'fast-check';
import Digits from './Digits';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

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
  expect([...digits.iter()]).toStrictEqual([1, 2, 3, 4, 5]);
});

test('reverse iterate on Digits', () => {
  const digits = Digits.fromStr('12345');
  expect([...digits.riter()]).toStrictEqual([5, 4, 3, 2, 1]);
});

test('Digits operations', () => {
  const digits = Digits.fromStr('12345');

  expect(digits.head()).toBe(1);
  expect(digits.last()).toBe(5);

  expect([...digits.init()]).toStrictEqual([1, 2, 3, 4]);
  expect([...digits.tail()]).toStrictEqual([2, 3, 4, 5]);
  expect([...digits.push(6)]).toStrictEqual([1, 2, 3, 4, 5, 6]);
  expect([...digits.cons(0)]).toStrictEqual([0, 1, 2, 3, 4, 5]);

  const [left, right] = digits.split(2);
  expect([...left]).toStrictEqual([1, 2]);
  expect([...right]).toStrictEqual([3, 4, 5]);

  const [left2, right2] = digits.split(7);
  expect([...left2]).toStrictEqual([1, 2, 3, 4, 5]);
  expect([...right2]).toStrictEqual([]);

  const [left3, right3] = digits.splitRight(2);
  expect([...left3]).toStrictEqual([1, 2, 3]);
  expect([...right3]).toStrictEqual([4, 5]);

  const digits2 = Digits.fromStr('98765');
  expect([...digits.concat(digits2)]).toStrictEqual([
    1, 2, 3, 4, 5, 9, 8, 7, 6, 5,
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

test.each([
  ['1', '0'],
  ['001', '000'],
  ['9', '8'],
  ['10', '09'],
  ['999', '998'],
  ['1000', '0999'],
  ['60', '59'],
  ['100', '099'],
])('expect digits %o - 1 == %o', (s1: string, s2: string) => {
  expect(Digits.fromStr(s1).sub1().toString()).toBe(s2);
});

test.each([['0'], [''], ['000']])(
  'expect digits %o - 1 to throw',
  (s1: string) => {
    expect(() => {
      Digits.fromStr(s1).sub1();
    }).toThrow('Cannot subtract 1 from 0');
  },
);

test.each([
  ['', '', 0, 0, 0],
  ['', '', 0, 2, 0],
  ['0', '0', 0, 0, 0],
  ['', '1', 0, 0, -1],
  ['', '1', 2, 0, -1],
  ['', '1', 0, 2, -1],
  ['', '0', 0, 0, 0],
  ['', '0', 2, 0, 0],
  ['', '0', 0, 2, 0],
  ['1', '1', 0, 0, 0],
  ['1', '1', 2, 0, 1],
  ['1', '1', 0, 2, -1],
  ['9', '10', 0, 0, -1],
  ['10', '9', 0, 0, 1],
  ['000', '001', 0, 0, -1],
  ['001', '000', 0, 0, 1],
  ['999', '1000', 0, 0, -1],
  ['59', '60', 0, 0, -1],
  ['099', '100', 0, 0, -1],
  ['0099', '100', 0, 0, -1],
  ['1234', '9', 0, 1, 1],
  ['1234', '1234', 0, 1, -1],
])(
  'expect compare(%p, %p, %p, %p) == %p',
  (
    a: string,
    b: string,
    aRightWait: number,
    bRightWait: number,
    ans: number,
  ) => {
    const aDig = Digits.fromStr(a);
    const bDig = Digits.fromStr(b);
    const res = Digits.compare(aDig, bDig, aRightWait, bRightWait);
    expect(res).toBe(ans);
  },
);

test.each([
  ['', '', 0, 0, ''],
  ['', '', 0, 2, '00'],
  ['0', '0', 0, 0, '0'],
  ['', '1', 0, 0, '1'],
  ['', '1', 2, 0, '01'],
  ['', '1', 0, 2, '100'],
  ['1', '1', 0, 0, '2'],
  ['9', '10', 0, 0, '19'],
  ['000', '001', 0, 0, '001'],
  ['999', '1000', 0, 0, '1999'],
  ['59', '60', 0, 0, '119'],
  ['099', '100', 0, 0, '199'],
  ['1', '2', 2, 0, '102'],
  ['1', '2', 0, 2, '201'],
  ['1234', '9', 0, 1, '1324'],
  ['1234', '2', 0, 1, '1254'],
  // a =  1234
  // b = 1234
  ['1234', '1234', 0, 1, '13574'],
])(
  'expect add(%p, %p, %p, %p) == %p',
  (
    a: string,
    b: string,
    aRightWait: number,
    bRightWait: number,
    ans: string,
  ) => {
    const aDig = Digits.fromStr(a);
    const bDig = Digits.fromStr(b);
    const res = Digits.add(aDig, bDig, aRightWait, bRightWait);
    expect(res.toString()).toBe(ans);
  },
);

test.each([
  ['', '', 0, 0, ''],
  ['', '', 0, 2, ''],
  ['', '', 2, 0, '00'],
  ['0', '0', 0, 0, '0'],
  ['1', '', 0, 0, '1'],
  ['1', '', 2, 0, '100'],
  ['1', '', 0, 2, '1'],
  ['1', '1', 0, 0, '0'],
  ['10', '9', 0, 0, '01'],
  ['001', '000', 0, 0, '001'],
  ['1000', '999', 0, 0, '0001'],
  ['60', '59', 0, 0, '01'],
  ['100', '099', 0, 0, '001'],
  ['2', '1', 2, 0, '199'],
  ['200', '1', 0, 2, '100'],
  ['1234', '9', 0, 1, '1144'],
  ['1234', '2', 0, 1, '1214'],
  // a =  3234
  // b = 0234
  ['3234', '0234', 0, 1, '0894'],
  // a = 1234
  // b =  1234
  ['1234', '1234', 1, 0, '11106'],
])(
  'expect sub(%p, %p, %p, %p) == %p',
  (
    a: string,
    b: string,
    aRightWait: number,
    bRightWait: number,
    ans: string,
  ) => {
    const aDig = Digits.fromStr(a);
    const bDig = Digits.fromStr(b);
    const res = Digits.sub(aDig, bDig, aRightWait, bRightWait);
    expect(res.toString()).toBe(ans);
  },
);

test.each([
  ['', '1', 0, 0],
  ['', '1', 2, 0],
  ['', '1', 0, 2],
  ['9', '10', 0, 0],
  ['000', '001', 0, 0],
  ['999', '1000', 0, 0],
  ['59', '60', 0, 0],
  ['099', '100', 0, 0],
  ['1', '2', 0, 2],
  ['1234', '1234', 0, 1],
])(
  'expect sub(%p, %p, %p, %p) to throw an error',
  (a: string, b: string, aRightWait: number, bRightWait: number) => {
    const aDig = Digits.fromStr(a);
    const bDig = Digits.fromStr(b);
    expect(() => {
      Digits.sub(aDig, bDig, aRightWait, bRightWait);
    }).toThrow(); // messages are varied
  },
);

test.each([
  ['', 0, ''],
  ['2134432', 0, ''],
  ['2543', 1, '2543'],
  ['1', 2, '2'],
  ['1', 9, '9'],
  ['2', 9, '18'],
  ['2543', 2, '5086'],
  ['2543', 4, '10172'],
  ['005', 3, '015'],
  ['005', 0, ''],
  ['000', 1, '000'],
])('expect %p.multDig(%p) == %p', (a: string, dig: number, ans: string) => {
  const aDig = Digits.fromStr(a);
  const res = aDig.multDig(dig);
  expect(res.toString()).toBe(ans);
});

test.each([
  ['', '', ''],
  ['0', '0', ''],
  ['0', '', ''],
  ['', '0', ''],
  ['1', '', ''],
  ['0', '1', '0'],
  ['1', '0', ''],
  ['1', '1', '1'],
  ['10', '9', '90'],
  ['3', '5', '15'],
  ['001', '000', ''],
  ['000', '001', '000'],
  ['60', '59', '3540'],
  ['59', '60', '3540'],
  [
    '17589432253425487839',
    '748295725434947923',
    '13162096968065896181339813845834808397',
  ],
])('expect mult(%p, %p) == %p', (a: string, b: string, ans: string) => {
  const aDig = Digits.fromStr(a);
  const bDig = Digits.fromStr(b);
  const res = Digits.mult(aDig, bDig);
  expect(res.toString()).toBe(ans);
});

test('arbitrary mult check', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(100),
      fc.bigUintN(100),
      (n1: number, n2: number) => {
        let n1Str = n1.toString();
        if (n1Str === '0') n1Str = '';
        let n2Str = n2.toString();
        if (n2Str === '0') n2Str = '';
        let expResStr = (n1 * n2).toString();
        if (expResStr === '0') expResStr = '';

        const aDig = Digits.fromStr(n1Str);
        const bDig = Digits.fromStr(n2Str);
        expect(Digits.mult(aDig, bDig).toString()).toBe(expResStr);
      },
    ),
  );
});
