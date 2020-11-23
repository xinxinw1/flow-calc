// @flow

import fc from 'fast-check';
import RealNum from './RealNum';

import Size, { RegularSize, NegInfSize } from './Size';
import Precision, { RegularPrec, InfPrec, NegInfPrec } from './Precision';

test('RealNum.zero is correct', () => {
  const n: RealNum = RealNum.zero;

  expect(n.digits.isEmpty()).toBe(true);
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
  expect(n.digits.isEmpty()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('-00.00');
  expect(n.digits.isEmpty()).toBe(true);
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

test.each([
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
])(
  'comparing numbers %o == %o should be %p',
  (v1: number, v2: number, res: boolean) => {
    if (res) {
      expect(RealNum.fromNum(v1)).toObjEqual(RealNum.fromNum(v2));
    } else {
      expect(RealNum.fromNum(v1)).not.toObjEqual(RealNum.fromNum(v2));
    }
  },
);

test('can negate', () => {
  expect(RealNum.fromNum(1).neg()).toObjEqual(RealNum.fromNum(-1));
  expect(RealNum.zero.neg()).toObjEqual(RealNum.zero);
  expect(RealNum.fromNum(-124).neg()).toObjEqual(RealNum.fromNum(124));
});

test.each([
  [1, new RegularSize(1)],
  [0, NegInfSize],
  [0.1, new RegularSize(0)],
  [9.999, new RegularSize(1)],
  [102, new RegularSize(3)],
  [124000, new RegularSize(6)],
])('size of %p should be %o', (v: number, size: Size) => {
  expect(RealNum.fromNum(v).size()).toObjEqual(size);
});

test.each([
  [1, new RegularPrec(0)],
  [0, NegInfPrec],
  [0.1, new RegularPrec(1)],
  [9.999, new RegularPrec(3)],
  [102, new RegularPrec(0)],
  [124000, new RegularPrec(-3)],
])('prec of %p should be %o', (v: number, prec: Precision) => {
  expect(RealNum.fromNum(v).prec()).toObjEqual(prec);
});

test.each([
  ['0'],
  ['-1'],
  ['1000'],
  ['-12345'],
  ['-0.0001'],
  ['0.2541'],
  ['-423.123'],
])('basic can convert to string', (s: string) => {
  expect(RealNum.fromStr(s).toString()).toEqual(s);
});

const smallStringNumArb = fc
  .oneof(fc.maxSafeInteger(), fc.double({ min: -100, max: 100 }))
  .map((n) => n.toString());

test('small arbitrary convert to string', () => {
  // integers and small floats
  fc.assert(
    fc.property(smallStringNumArb, (s: string) => {
      expect(RealNum.fromStr(s).toString()).toEqual(s);
    }),
  );
});

const stringNumArb = fc
  .tuple(
    fc.boolean(),
    // log_2(10^10000) = 33219.28
    fc.bigUintN(33220),
    fc.integer({ min: -10000, max: 10000 }),
  )
  .map(([pos, digitsUint, baseExp]: [boolean, {}, number]) => {
    let digitsStr = digitsUint.toString();
    let exp = baseExp;
    if (digitsStr === '0') return '0';
    let str = pos ? '' : '-';
    for (let i = 0; i < digitsStr.length; i += 1) {
      if (digitsStr[digitsStr.length - 1 - i] !== '0') {
        digitsStr = digitsStr.substr(0, digitsStr.length - i);
        exp += i;
        break;
      }
    }
    if (exp >= 0) {
      str += digitsStr;
      for (let i = 0; i < exp; i += 1) {
        str += '0';
      }
      return str;
    }
    if (-exp >= digitsStr.length) {
      str += '0.';
      for (let i = 0; i < -exp - digitsStr.length; i += 1) {
        str += '0';
      }
      str += digitsStr;
      return str;
    }
    str += digitsStr.substring(0, digitsStr.length + exp);
    str += '.';
    str += digitsStr.substring(digitsStr.length + exp);
    return str;
  });

test('all arbitrary convert to string', () => {
  fc.assert(
    fc.property(stringNumArb, (s: string) => {
      expect(RealNum.fromStr(s).toString()).toEqual(s);
    }),
  );
});

test('small arbitrary equals check', () => {
  fc.assert(
    fc.property(
      smallStringNumArb,
      smallStringNumArb,
      (s1: string, s2: string) => {
        if (s1 === s2) {
          expect(RealNum.fromStr(s1)).toObjEqual(RealNum.fromStr(s2));
        } else {
          expect(RealNum.fromStr(s1)).not.toObjEqual(RealNum.fromStr(s2));
        }
      },
    ),
  );
});

test('all arbitrary equals check', () => {
  fc.assert(
    fc.property(stringNumArb, stringNumArb, (s1: string, s2: string) => {
      if (s1 === s2) {
        expect(RealNum.fromStr(s1)).toObjEqual(RealNum.fromStr(s2));
      } else {
        expect(RealNum.fromStr(s1)).not.toObjEqual(RealNum.fromStr(s2));
      }
    }),
  );
});

test.each([
  ['0', new RegularPrec(0), '0'],
  ['0', new RegularPrec(20), '0'],
  ['0', new RegularPrec(-20), '0'],
  ['0', InfPrec, '0'],
  ['0', NegInfPrec, '0'],
  ['-0.0004352', new RegularPrec(0), '0'],
  ['-0.0004352', new RegularPrec(-20), '0'],
  ['-0.0004352', new RegularPrec(4), '-0.0004'],
  ['-0.0004952', new RegularPrec(5), '-0.0005'],
  ['-0.0004952', new RegularPrec(7), '-0.0004952'],
  ['-0.0004952', new RegularPrec(20), '-0.0004952'],
  ['-0.0004952', InfPrec, '-0.0004952'],
  ['-0.0004952', NegInfPrec, '0'],
  ['99956.99499', new RegularPrec(0), '99957'],
  ['99956.99499', new RegularPrec(-1), '99960'],
  ['99956.99499', new RegularPrec(-5), '100000'],
  ['99956.99499', new RegularPrec(-6), '0'],
  ['99956.99499', new RegularPrec(-7), '0'],
  ['99956.99499', new RegularPrec(2), '99956.99'],
  ['99956.99499', new RegularPrec(4), '99956.995'],
])(
  'expect rounding %s to %o prec to give %s',
  (s1: string, p: Precision, s2: string) => {
    expect(RealNum.fromStr(s1).round(p).toString()).toBe(s2);
  },
);

test.each([
  ['0', new RegularPrec(0), '0'],
  ['0', new RegularPrec(20), '0'],
  ['0', new RegularPrec(-20), '0'],
  ['0', InfPrec, '0'],
  ['0', NegInfPrec, '0'],
  ['-0.0004352', new RegularPrec(0), '0'],
  ['-0.0004352', new RegularPrec(-20), '0'],
  ['-0.0004352', new RegularPrec(4), '-0.0004'],
  ['-0.0004952', new RegularPrec(5), '-0.00049'],
  ['-0.0004952', new RegularPrec(7), '-0.0004952'],
  ['-0.0004952', new RegularPrec(20), '-0.0004952'],
  ['-0.0004952', InfPrec, '-0.0004952'],
  ['-0.0004952', NegInfPrec, '0'],
  ['0.0004352', new RegularPrec(0), '1'],
  ['0.0004352', new RegularPrec(-3), '1000'],
  ['0.0004352', new RegularPrec(4), '0.0005'],
  ['0.0004952', new RegularPrec(5), '0.0005'],
  ['0.0004952', new RegularPrec(7), '0.0004952'],
  ['0.0004952', new RegularPrec(20), '0.0004952'],
  ['0.0004952', InfPrec, '0.0004952'],
  ['99956.99499', new RegularPrec(0), '99957'],
  ['99956.99499', new RegularPrec(-1), '99960'],
  ['99956.99499', new RegularPrec(-5), '100000'],
  ['99956.99499', new RegularPrec(-6), '1000000'],
  ['99956.99499', new RegularPrec(-7), '10000000'],
  ['99956.99499', new RegularPrec(2), '99957'],
  ['99956.99499', new RegularPrec(4), '99956.995'],
])(
  'expect ceil %s to %o prec to give %s',
  (s1: string, p: Precision, s2: string) => {
    expect(RealNum.fromStr(s1).ceil(p).toString()).toBe(s2);
  },
);

test('expect ceil with neg inf prec of pos number to give error', () => {
  expect(() => {
    RealNum.fromStr('1').ceil(NegInfPrec);
  }).toThrow('Cannot infinitely round 1 away from zero');
});
