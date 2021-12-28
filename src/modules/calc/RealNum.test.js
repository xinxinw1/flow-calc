// @flow

import fc from 'fast-check';
import RealNum from './RealNum';

import { type Size, RegularSize, NegInfSize } from './Size';
import { type Precision, RegularPrec, InfPrec, NegInfPrec } from './Precision';

import _, { type ObjEqualMatcher } from './toObjEqual.test-helper';
import { type ExtendExpect } from '../ExtendExpect.test-helper';

declare var expect: ExtendExpect<ObjEqualMatcher>;

test('RealNum.zero is correct', () => {
  const n: RealNum = RealNum.zero;

  expect(n.nat.isZero()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('creates RealNum from string', () => {
  let n: RealNum = RealNum.zero;

  n = RealNum.fromStr('1');
  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('10.5');
  expect(n.nat.toString()).toBe('105');
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('0');
  expect(n.nat.isZero()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('-00.00');
  expect(n.nat.isZero()).toBe(true);
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('-1000');
  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(3);
  expect(n.pos).toBe(false);

  n = RealNum.fromStr('0.004000');
  expect(n.nat.toString()).toBe('4');
  expect(n.exp).toBe(-3);
  expect(n.pos).toBe(true);

  n = RealNum.fromStr('123456789123456789123456789');
  expect(n.nat.toString()).toBe('123456789123456789123456789');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('creates RealNum from num', () => {
  let n: RealNum = RealNum.zero;

  n = RealNum.fromNum(1);
  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.fromNum(10.5);
  expect(n.nat.toString()).toBe('105');
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(true);
});

test('RealNum.one is correct', () => {
  const n: RealNum = RealNum.one;

  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);
});

test('RealNum.digitAtPrec is correct', () => {
  let n: RealNum;

  n = RealNum.digitAtPrec(false, 0, new RegularPrec(10));
  expect(n.nat.toString()).toBe('0');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.digitAtPrec(true, 1, new RegularPrec(0));
  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.digitAtPrec(false, 9, new RegularPrec(1));
  expect(n.nat.toString()).toBe('9');
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(false);

  n = RealNum.digitAtPrec(true, 2, new RegularPrec(-1));
  expect(n.nat.toString()).toBe('2');
  expect(n.exp).toBe(1);
  expect(n.pos).toBe(true);
});

test('RealNum.digitWithSize is correct', () => {
  let n: RealNum;

  n = RealNum.digitWithSize(false, 0, new RegularSize(10));
  expect(n.nat.toString()).toBe('0');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(true);

  n = RealNum.digitWithSize(true, 1, new RegularSize(0));
  expect(n.nat.toString()).toBe('1');
  expect(n.exp).toBe(-1);
  expect(n.pos).toBe(true);

  n = RealNum.digitWithSize(false, 9, new RegularSize(1));
  expect(n.nat.toString()).toBe('9');
  expect(n.exp).toBe(0);
  expect(n.pos).toBe(false);

  n = RealNum.digitWithSize(true, 2, new RegularSize(-1));
  expect(n.nat.toString()).toBe('2');
  expect(n.exp).toBe(-2);
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
  [0, new NegInfSize()],
  [0.1, new RegularSize(0)],
  [9.999, new RegularSize(1)],
  [102, new RegularSize(3)],
  [124000, new RegularSize(6)],
])('size of %p should be %o', (v: number, size: Size) => {
  expect(RealNum.fromNum(v).size()).toObjEqual(size);
  if (v !== 0) {
    expect(new RegularSize(RealNum.fromNum(v).sizeNonZero())).toObjEqual(size);
  }
});

test.each([
  [1, new RegularPrec(0)],
  [0, new NegInfPrec()],
  [0.1, new RegularPrec(1)],
  [9.999, new RegularPrec(3)],
  [102, new RegularPrec(0)],
  [124000, new RegularPrec(-3)],
])('prec of %p should be %o', (v: number, prec: Precision) => {
  expect(RealNum.fromNum(v).prec()).toObjEqual(prec);
  if (v !== 0) {
    expect(new RegularPrec(RealNum.fromNum(v).precNonZero())).toObjEqual(prec);
  }
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

const smallNumArb = fc.oneof(
  fc.maxSafeInteger(),
  fc.double({ min: -100, max: 100 }),
);

const smallStringNumArb = smallNumArb.map((n) => n.toString());

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

test('small arbitrary compare check', () => {
  fc.assert(
    fc.property(smallNumArb, smallNumArb, (n1: number, n2: number) => {
      if (n1 === n2) {
        expect(RealNum.fromNum(n1).compare(RealNum.fromNum(n2))).toBe(0);
      } else if (n1 > n2) {
        expect(RealNum.fromNum(n1).compare(RealNum.fromNum(n2))).toBe(1);
      } else {
        expect(RealNum.fromNum(n1).compare(RealNum.fromNum(n2))).toBe(-1);
      }
    }),
  );
});

test.each([
  ['0', new RegularPrec(0), '0'],
  ['0', new RegularPrec(20), '0'],
  ['0', new RegularPrec(-20), '0'],
  ['0', new InfPrec(), '0'],
  ['0', new NegInfPrec(), '0'],
  ['-0.0004352', new RegularPrec(0), '0'],
  ['-0.0004352', new RegularPrec(-20), '0'],
  ['-0.0004352', new RegularPrec(4), '-0.0004'],
  ['-0.0004952', new RegularPrec(5), '-0.0005'],
  ['-0.0004952', new RegularPrec(7), '-0.0004952'],
  ['-0.0004952', new RegularPrec(20), '-0.0004952'],
  ['-0.0004952', new InfPrec(), '-0.0004952'],
  ['-0.0004952', new NegInfPrec(), '0'],
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
  ['0', new InfPrec(), '0'],
  ['0', new NegInfPrec(), '0'],
  ['-0.0004352', new RegularPrec(0), '0'],
  ['-0.0004352', new RegularPrec(-20), '0'],
  ['-0.0004352', new RegularPrec(4), '-0.0004'],
  ['-0.0004952', new RegularPrec(5), '-0.00049'],
  ['-0.0004952', new RegularPrec(7), '-0.0004952'],
  ['-0.0004952', new RegularPrec(20), '-0.0004952'],
  ['-0.0004952', new InfPrec(), '-0.0004952'],
  ['-0.0004952', new NegInfPrec(), '0'],
  ['0.0004352', new RegularPrec(0), '1'],
  ['0.0004352', new RegularPrec(-3), '1000'],
  ['0.0004352', new RegularPrec(4), '0.0005'],
  ['0.0004952', new RegularPrec(5), '0.0005'],
  ['0.0004952', new RegularPrec(7), '0.0004952'],
  ['0.0004952', new RegularPrec(20), '0.0004952'],
  ['0.0004952', new InfPrec(), '0.0004952'],
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
    RealNum.fromStr('1').ceil(new NegInfPrec());
  }).toThrow('Cannot infinitely round 1 away from zero');
});

test.each([
  ['0', new RegularPrec(0), 0],
  ['15.43', new RegularPrec(0), 5],
  ['15.43', new RegularPrec(-1), 1],
  ['15.43', new RegularPrec(-2), 0],
  ['15.43', new RegularPrec(-3), 0],
  ['15.43', new RegularPrec(-4), 0],
  ['15.43', new RegularPrec(1), 4],
  ['15.43', new RegularPrec(2), 3],
  ['15.43', new RegularPrec(3), 0],
  ['15.43', new RegularPrec(4), 0],
  ['10.03', new RegularPrec(0), 0],
  ['10.03', new RegularPrec(-1), 1],
])(
  'expect %p .getDigitAtPrec %o prec to give %p',
  (s1: string, p: Precision, digBefore: number) => {
    expect(RealNum.fromStr(s1).getDigitAtPrec(p)).toBe(digBefore);
  },
);

test.each([
  ['0', new RegularPrec(0), 0, '0'],
  ['15.43', new RegularPrec(0), 5, '0.43'],
  ['15.43', new RegularPrec(-1), 1, '5.43'],
  ['15.43', new RegularPrec(-2), 0, '15.43'],
  ['15.43', new RegularPrec(-3), 0, '15.43'],
  ['15.43', new RegularPrec(-4), 0, '15.43'],
  ['15.43', new RegularPrec(1), 4, '0.03'],
  ['15.43', new RegularPrec(2), 3, '0'],
  ['15.43', new RegularPrec(3), 0, '0'],
  ['15.43', new RegularPrec(4), 0, '0'],
  ['10.03', new RegularPrec(0), 0, '0.03'],
  ['10.03', new RegularPrec(-1), 1, '0.03'],
])(
  'expect %p .getNumAfterPrec %o prec to give [%p, %p]',
  (s1: string, p: Precision, digBefore: number, numAfter: string) => {
    const num = RealNum.fromStr(s1);
    const [ansDigBefore, ansNumAfter] = num.getNumAfterPrec(p);
    expect(ansDigBefore).toBe(digBefore);
    expect(ansNumAfter.toString()).toBe(numAfter);
  },
);

test.each([
  ['0', '0', '0'],
  ['0', '1', '1'],
  ['0', '-1', '-1'],
  ['1', '0', '1'],
  ['1', '1', '2'],
  ['1', '-1', '0'],
  ['-1', '0', '-1'],
  ['-1', '1', '0'],
  ['-1', '-1', '-2'],
])('expect %p + %p == %p', (s1: string, s2: string, ans: string) => {
  expect(RealNum.fromStr(s1).add(RealNum.fromStr(s2)).toString()).toBe(ans);
});

test.each([
  ['0', '0', '0'],
  ['0', '1', '-1'],
  ['0', '-1', '1'],
  ['1', '0', '1'],
  ['1', '1', '0'],
  ['1', '-1', '2'],
  ['-1', '0', '-1'],
  ['-1', '1', '-2'],
  ['-1', '-1', '0'],
])('expect %p - %p == %p', (s1: string, s2: string, ans: string) => {
  expect(RealNum.fromStr(s1).sub(RealNum.fromStr(s2)).toString()).toBe(ans);
});

const expBigIntArb = fc
  .tuple(
    // log_2(10^10000) = 33219.28
    fc.bigIntN(33220),
    fc.integer({ min: 0, max: 100 }),
  )
  .map(([bigInt, baseExp]: [number, number]) => {
    let newBigInt = bigInt;
    for (let i = 0; i < baseExp; i += 1) {
      // $FlowIgnore[bigint-unsupported]
      newBigInt *= 10n;
    }
    return newBigInt;
  });

test('big int add check', () => {
  fc.assert(
    fc.property(expBigIntArb, expBigIntArb, (n1: number, n2: number) => {
      expect(
        RealNum.fromStr(n1.toString())
          .add(RealNum.fromStr(n2.toString()))
          .toString(),
      ).toBe((n1 + n2).toString());
    }),
  );
});

test('big int sub check', () => {
  fc.assert(
    fc.property(expBigIntArb, expBigIntArb, (n1: number, n2: number) => {
      expect(
        RealNum.fromStr(n1.toString())
          .sub(RealNum.fromStr(n2.toString()))
          .toString(),
      ).toBe((n1 - n2).toString());
    }),
  );
});

test.each([
  ['0', '0', '0'],
  ['0', '1', '0'],
  ['0', '-1', '0'],
  ['1', '0', '0'],
  ['1', '1', '1'],
  ['1', '-1', '-1'],
  ['-1', '0', '0'],
  ['-1', '1', '-1'],
  ['-1', '-1', '1'],
])('expect %p * %p == %p', (s1: string, s2: string, ans: string) => {
  expect(RealNum.fromStr(s1).mult(RealNum.fromStr(s2)).toString()).toBe(ans);
});

const smallerExpBigIntArb = fc
  .tuple(fc.bigIntN(500), fc.integer({ min: 0, max: 100 }))
  .map(([bigInt, baseExp]: [number, number]) => {
    let newBigInt = bigInt;
    for (let i = 0; i < baseExp; i += 1) {
      // $FlowIgnore[bigint-unsupported]
      newBigInt *= 10n;
    }
    return newBigInt;
  });

test('big int mult check', () => {
  fc.assert(
    fc.property(
      smallerExpBigIntArb,
      smallerExpBigIntArb,
      (n1: number, n2: number) => {
        expect(
          RealNum.fromStr(n1.toString())
            .mult(RealNum.fromStr(n2.toString()))
            .toString(),
        ).toBe((n1 * n2).toString());
      },
    ),
  );
});

test.each([
  ['0', '1', new RegularPrec(0), '0', '0'],
  ['0', '-1', new RegularPrec(0), '0', '0'],
  ['1', '1', new RegularPrec(0), '1', '0'],
  ['1', '1', new RegularPrec(3), '1', '0'],
  ['1', '1', new RegularPrec(-3), '0', '1'],
  ['1', '1', new InfPrec(), '1', '0'],
  ['1', '1', new NegInfPrec(), '0', '1'],
  ['7', '5', new RegularPrec(0), '1', '2'],
  ['7', '5', new RegularPrec(-1), '0', '7'],
  ['7', '5', new RegularPrec(1), '1.4', '0'],
  ['7', '-5', new RegularPrec(0), '-1', '2'],
  ['7', '-5', new RegularPrec(-1), '0', '7'],
  ['7', '-5', new RegularPrec(1), '-1.4', '0'],
  ['-7', '5', new RegularPrec(0), '-1', '-2'],
  ['-7', '5', new RegularPrec(-1), '0', '-7'],
  ['-7', '5', new RegularPrec(1), '-1.4', '0'],
  ['-7', '-5', new RegularPrec(0), '1', '-2'],
  ['-7', '-5', new RegularPrec(-1), '0', '-7'],
  ['-7', '-5', new RegularPrec(1), '1.4', '0'],
  ['10', '3', new RegularPrec(0), '3', '1'],
  ['1', '3', new RegularPrec(1), '0.3', '0.1'],
  ['1', '3', new RegularPrec(-3), '0', '1'],
  ['444', '2', new RegularPrec(-2), '200', '44'],
  ['254', '23', new RegularPrec(4), '11.0434', '0.0018'],
  [
    '13162096968065896181339813845834808397',
    '17589432253425487839',
    new RegularPrec(0),
    '748295725434947923',
    '0',
  ],
  ['4123', '250', new InfPrec(), '16.492', '0'],
  ['4123', '250', new RegularPrec(1), '16.4', '23'],
  ['4123', '250', new RegularPrec(5), '16.492', '0'],
  ['990', '33', new RegularPrec(0), '30', '0'],
])(
  'expect %p.div(%p, %o) == [%p, %p]',
  (
    s1: string,
    s2: string,
    prec: Precision,
    quotAns: string,
    remAns: string,
  ) => {
    const [quot, rem] = RealNum.fromStr(s1).div(RealNum.fromStr(s2), prec);
    expect(quot.toString()).toBe(quotAns);
    expect(rem.toString()).toBe(remAns);
  },
);

test('big int div identity check', () => {
  fc.assert(
    fc.property(
      smallerExpBigIntArb,
      smallerExpBigIntArb,
      fc.integer(-200, 200),
      (n1: number, n2: number, precNum: number) => {
        const n1Num = RealNum.fromStr(n1.toString());
        const n2Num = RealNum.fromStr(n2.toString());
        const prec = new RegularPrec(precNum);
        if (!n2Num.isZero()) {
          const [quot, rem] = n1Num.div(n2Num, prec);
          expect(quot.mult(n2Num).add(rem).toString()).toBe(n1Num.toString());
          expect(quot.prec().le(prec)).toBe(true);
        } else {
          expect(() => {
            n1Num.div(n2Num, prec);
          }).toThrow('cannot divide by zero');
        }
      },
    ),
  );
});
