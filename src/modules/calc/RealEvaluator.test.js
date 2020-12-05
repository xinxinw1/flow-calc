// @flow
import RealNum from './RealNum';
import { RegularPrec, InfPrec, NegInfPrec } from './Precision';
import { type RealGenerator } from './RealGenerator';
import RealEvaluator from './RealEvaluator';

function* makeInstantGen(a: RealNum): RealGenerator {
  yield RealNum.zero;
  return a;
}

function* makeGen(a: RealNum): RealGenerator {
  let prec = yield RealNum.zero;
  for (;;) {
    prec = yield a.round(prec);
  }
  // for type-check only
  // eslint-disable-next-line no-unreachable
  return RealNum.zero;
}

test('generator state eval works correctly with instant gen', () => {
  const evaluator = new RealEvaluator(makeInstantGen(RealNum.fromStr('4.449')));

  let [value, done]: [RealNum, boolean] = [RealNum.zero, false];

  [value, done] = evaluator.eval(NegInfPrec);
  expect(value).toObjEqual(RealNum.zero);
  expect(done).toBe(false);

  [value, done] = evaluator.eval(new RegularPrec(0));
  expect(value).toObjEqual(RealNum.fromNum(4));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.4));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(new RegularPrec(2));
  expect(value).toObjEqual(RealNum.fromNum(4.45));
  expect(done).toBe(false);

  // expected to be the same since result is already known
  // internally to full precision
  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.4));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(InfPrec);
  expect(value).toObjEqual(RealNum.fromNum(4.449));
  expect(done).toBe(true);

  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.4));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(NegInfPrec);
  expect(value).toObjEqual(RealNum.zero);
  expect(done).toBe(false);
});

test('generator state eval works correctly with regular gen', () => {
  const evaluator = new RealEvaluator(makeGen(RealNum.fromStr('4.449')));

  let [value, done]: [RealNum, boolean] = [RealNum.zero, false];

  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.4));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(new RegularPrec(2));
  expect(value).toObjEqual(RealNum.fromNum(4.45));
  expect(done).toBe(false);

  // expected to be different since previous result will be rounded
  // and max allowed error is 0.1
  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.5));
  expect(done).toBe(false);

  [value, done] = evaluator.eval(new RegularPrec(3));
  expect(value).toObjEqual(RealNum.fromNum(4.449));
  expect(done).toBe(false);

  // expected to be different since with more precision, we confirm it's
  // supposed to round to 4.4
  [value, done] = evaluator.eval(new RegularPrec(1));
  expect(value).toObjEqual(RealNum.fromNum(4.4));
  expect(done).toBe(false);
});
