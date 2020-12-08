// @flow

import fc from 'fast-check';
import NatNum from './NatNum';

test('gets zero NatNum', () => {
  const n = NatNum.zero;
  expect(n.digits.toString()).toBe('');
});

test('creates NatNum from num', () => {
  const n = NatNum.fromNum(12345);
  expect(n.digits.toString()).toBe('12345');
});

test('creates NatNum from string', () => {
  const n = NatNum.fromStr('12345');
  expect(n.digits.toString()).toBe('12345');
});

test('trims NatNum from string', () => {
  const n = NatNum.fromStr('000');
  expect(n.digits.toString()).toBe('');

  const n2 = NatNum.fromStr('003400');
  expect(n2.digits.toString()).toBe('3400');

  const n3 = NatNum.fromStr('');
  expect(n3.digits.toString()).toBe('');
});

test('NatNum to string', () => {
  const n = NatNum.fromStr('0');
  expect(n.toString()).toBe('0');

  const n2 = NatNum.fromStr('');
  expect(n2.toString()).toBe('0');

  const n3 = NatNum.fromStr('0012345');
  expect(n3.toString()).toBe('12345');
});

test('arbitrary NatNum to string', () => {
  fc.assert(
    fc.property(fc.bigUintN(33220), (n: {}) => {
      const s = n.toString();
      expect(NatNum.fromStr(s).toString()).toBe(s);
    }),
  );
});

test('NatNum operations', () => {
  const n = NatNum.fromStr('123045');

  expect(n.last()).toBe(5);

  expect(n.init().toString()).toBe('12304');
  expect(n.push(6).toString()).toBe('1230456');

  const [left, right] = n.splitRight(3);
  expect(left.toString()).toBe('123');
  expect(right.toString()).toBe('45');

  const [left2, right2] = n.splitRight(2);
  expect(left2.toString()).toBe('1230');
  expect(right2.toString()).toBe('45');

  const [left3, right3] = n.splitRight(8);
  expect(left3.toString()).toBe('0');
  expect(right3.toString()).toBe('123045');

  expect(() => {
    n.splitRight(-1);
  }).toThrow('NatNum.splitRight cannot take a negative number');

  expect(n.shiftLeft(3).toString()).toBe('123045000');
  expect(() => {
    n.shiftLeft(-3);
  }).toThrow('cannot shiftLeft by a negative number, use shiftRight');

  const [shiftedNum, shiftedOff] = n.shiftRight(3);
  expect(shiftedNum.toString()).toBe('123');
  expect(shiftedOff).toStrictEqual([0, 4, 5]);

  const [shiftedNum2, shiftedOff2] = n.shiftRight(2);
  expect(shiftedNum2.toString()).toBe('1230');
  expect(shiftedOff2).toStrictEqual([4, 5]);

  const [shiftedNum3, shiftedOff3] = n.shiftRight(8);
  expect(shiftedNum3.toString()).toBe('0');
  expect(shiftedOff3).toStrictEqual([0, 0, 1, 2, 3, 0, 4, 5]);
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
  'comparing NatNum %o == %o should be %p',
  (v1: number, v2: number, res: boolean) => {
    if (res) {
      expect(NatNum.fromNum(v1)).toObjEqual(NatNum.fromNum(v2));
    } else {
      expect(NatNum.fromNum(v1)).not.toObjEqual(NatNum.fromNum(v2));
    }
  },
);

test('arbitrary NatNum equals', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(33220),
      fc.bigUintN(33220),
      (n1: number, n2: number) => {
        const s1 = n1.toString();
        const s2 = n2.toString();
        if (n1 === n2) {
          expect(NatNum.fromStr(s1)).toObjEqual(NatNum.fromStr(s2));
        } else {
          expect(NatNum.fromStr(s1)).not.toObjEqual(NatNum.fromStr(s2));
        }
      },
    ),
  );
});

test.each([
  ['0', '1'],
  ['1', '2'],
  ['9', '10'],
  ['999', '1000'],
  ['59', '60'],
  ['99', '100'],
])('expect NatNum %o + 1 == %o', (s1: string, s2: string) => {
  expect(NatNum.fromStr(s1).add1().toString()).toBe(s2);
});

test('arbitrary add1 check', () => {
  fc.assert(
    fc.property(fc.bigUintN(33220), (n: {}) => {
      expect(NatNum.fromStr(n.toString()).add1().toString()).toBe(
        // $FlowIgnore[bigint-unsupported]
        (n + 1n).toString(),
      );
    }),
  );
});

test.each([
  ['1', '0'],
  ['9', '8'],
  ['10', '9'],
  ['999', '998'],
  ['1000', '999'],
  ['60', '59'],
  ['100', '99'],
])('expect NatNum %o - 1 == %o', (s1: string, s2: string) => {
  expect(NatNum.fromStr(s1).sub1().toString()).toBe(s2);
});

test('expect NatNum 0 - 1 to throw', () => {
  expect(() => {
    NatNum.fromStr('0').sub1();
  }).toThrow('Cannot subtract 1 from 0');
});

test('arbitrary sub1 check', () => {
  fc.assert(
    fc.property(fc.bigUintN(33220), (n: number) => {
      if (n > 0) {
        expect(NatNum.fromStr(n.toString()).sub1().toString()).toBe(
          // $FlowIgnore[bigint-unsupported]
          (n - 1n).toString(),
        );
      }
    }),
  );
});

test.each([
  ['0', '0', 0, 0, 0],
  ['0', '0', 0, 2, 0],
  ['0', '0', 2, 0, 0],
  ['0', '1', 0, 0, -1],
  ['0', '1', 2, 0, -1],
  ['0', '1', 0, 2, -1],
  ['1', '1', 0, 0, 0],
  ['1', '1', 2, 0, 1],
  ['1', '1', 0, 2, -1],
  ['9', '10', 0, 0, -1],
  ['10', '9', 0, 0, 1],
  ['999', '1000', 0, 0, -1],
  ['59', '60', 0, 0, -1],
  ['99', '100', 0, 0, -1],
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
    const aNum = NatNum.fromStr(a);
    const bNum = NatNum.fromStr(b);
    const res = NatNum.compare(aNum, bNum, aRightWait, bRightWait);
    expect(res).toBe(ans);
  },
);

test('arbitrary compare check', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(33200),
      fc.bigUintN(33200),
      fc.nat(1000),
      fc.boolean(),
      (n1: number, n2: number, rightWait: number, isA: boolean) => {
        const n1Str = n1.toString();
        const n2Str = n2.toString();

        const aNum = NatNum.fromStr(n1Str);
        const bNum = NatNum.fromStr(n2Str);
        const aRightWait = isA ? rightWait : 0;
        const bRightWait = !isA ? rightWait : 0;

        let n1Mod = n1;
        let n2Mod = n2;
        for (let i = 0; i < aRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n1Mod *= 10n;
        }
        for (let i = 0; i < bRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n2Mod *= 10n;
        }
        let expRes = 0;
        if (n1Mod > n2Mod) expRes = 1;
        else if (n1Mod < n2Mod) expRes = -1;
        expect(NatNum.compare(aNum, bNum, aRightWait, bRightWait)).toBe(expRes);
      },
    ),
  );
});

test.each([
  ['0', '0', 0, 0, '0'],
  ['0', '0', 0, 2, '0'],
  ['0', '0', 2, 0, '0'],
  ['0', '1', 0, 0, '1'],
  ['0', '1', 2, 0, '1'],
  ['0', '1', 0, 2, '100'],
  ['1', '1', 0, 0, '2'],
  ['9', '10', 0, 0, '19'],
  ['999', '1000', 0, 0, '1999'],
  ['59', '60', 0, 0, '119'],
  ['99', '100', 0, 0, '199'],
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
    const aNum = NatNum.fromStr(a);
    const bNum = NatNum.fromStr(b);
    const res = NatNum.add(aNum, bNum, aRightWait, bRightWait);
    expect(res.toString()).toBe(ans);
  },
);

test('arbitrary add check', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(33200),
      fc.bigUintN(33200),
      fc.nat(1000),
      fc.boolean(),
      (n1: number, n2: number, rightWait: number, isA: boolean) => {
        const n1Str = n1.toString();
        const n2Str = n2.toString();

        const aNum = NatNum.fromStr(n1Str);
        const bNum = NatNum.fromStr(n2Str);
        const aRightWait = isA ? rightWait : 0;
        const bRightWait = !isA ? rightWait : 0;

        let n1Mod = n1;
        let n2Mod = n2;
        for (let i = 0; i < aRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n1Mod *= 10n;
        }
        for (let i = 0; i < bRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n2Mod *= 10n;
        }

        const expResStr = (n1Mod + n2Mod).toString();

        expect(NatNum.add(aNum, bNum, aRightWait, bRightWait).toString()).toBe(
          expResStr,
        );
      },
    ),
  );
});

test.each([
  ['0', '0', 0, 0, '0'],
  ['0', '0', 0, 2, '0'],
  ['0', '0', 2, 0, '0'],
  ['1', '0', 0, 0, '1'],
  ['1', '0', 2, 0, '100'],
  ['1', '0', 0, 2, '1'],
  ['1', '1', 0, 0, '0'],
  ['10', '0', 0, 1, '10'],
  ['10', '9', 0, 0, '1'],
  ['1000', '999', 0, 0, '1'],
  ['60', '59', 0, 0, '1'],
  ['100', '099', 0, 0, '1'],
  ['2', '1', 2, 0, '199'],
  ['200', '1', 0, 2, '100'],
  ['1234', '9', 0, 1, '1144'],
  ['1234', '2', 0, 1, '1214'],
  // a = 3234
  // b = 234
  ['3234', '234', 0, 1, '894'],
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
    const aNum = NatNum.fromStr(a);
    const bNum = NatNum.fromStr(b);
    const res = NatNum.sub(aNum, bNum, aRightWait, bRightWait);
    expect(res.toString()).toBe(ans);
  },
);

test.each([
  ['0', '1', 0, 0],
  ['0', '1', 2, 0],
  ['0', '1', 0, 2],
  ['9', '10', 0, 0],
  ['999', '1000', 0, 0],
  ['59', '60', 0, 0],
  ['99', '100', 0, 0],
  ['1', '2', 0, 2],
  ['1234', '1234', 0, 1],
])(
  'expect sub(%p, %p, %p, %p) to throw an error',
  (a: string, b: string, aRightWait: number, bRightWait: number) => {
    const aNum = NatNum.fromStr(a);
    const bNum = NatNum.fromStr(b);
    expect(() => {
      NatNum.sub(aNum, bNum, aRightWait, bRightWait);
    }).toThrow(); // messages are varied
  },
);

test('arbitrary sub check', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(33200),
      fc.bigUintN(33200),
      fc.nat(1000),
      fc.boolean(),
      (n1: number, n2: number, rightWait: number, isA: boolean) => {
        const n1Str = n1.toString();
        const n2Str = n2.toString();

        const aNum = NatNum.fromStr(n1Str);
        const bNum = NatNum.fromStr(n2Str);
        const aRightWait = isA ? rightWait : 0;
        const bRightWait = !isA ? rightWait : 0;

        let n1Mod = n1;
        let n2Mod = n2;
        for (let i = 0; i < aRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n1Mod *= 10n;
        }
        for (let i = 0; i < bRightWait; i += 1) {
          // $FlowIgnore[bigint-unsupported]
          n2Mod *= 10n;
        }

        const expRes = n1Mod - n2Mod;
        if (expRes < 0) {
          expect(() => {
            NatNum.sub(aNum, bNum, aRightWait, bRightWait);
          }).toThrow();
        } else {
          const expResStr = expRes.toString();
          expect(
            NatNum.sub(aNum, bNum, aRightWait, bRightWait).toString(),
          ).toBe(expResStr);
        }
      },
    ),
  );
});

test.each([
  ['0', '0', '0'],
  ['1', '0', '0'],
  ['0', '1', '0'],
  ['1', '1', '1'],
  ['10', '9', '90'],
  ['3', '5', '15'],
  ['60', '59', '3540'],
  ['59', '60', '3540'],
  [
    '17589432253425487839',
    '748295725434947923',
    '13162096968065896181339813845834808397',
  ],
])('expect mult(%p, %p) == %p', (a: string, b: string, ans: string) => {
  const aNum = NatNum.fromStr(a);
  const bNum = NatNum.fromStr(b);
  const res = NatNum.mult(aNum, bNum);
  expect(res.toString()).toBe(ans);
});

test('arbitrary mult check', () => {
  fc.assert(
    fc.property(
      fc.bigUintN(500),
      fc.bigUintN(500),
      (n1: number, n2: number) => {
        const n1Str = n1.toString();
        const n2Str = n2.toString();
        const expResStr = (n1 * n2).toString();

        const aNum = NatNum.fromStr(n1Str);
        const bNum = NatNum.fromStr(n2Str);
        expect(NatNum.mult(aNum, bNum).toString()).toBe(expResStr);
      },
    ),
  );
});
