// @flow
import RealNum from './RealNum';
import { RegularPrec, InfPrec, NegInfPrec } from './Precision';
import RealGeneratorState from './RealGeneratorState';
import { makeContinuousGen, makeInstantGen } from './RealGenerator';

test('generator state eval works correctly with instant gen', () => {
  const genState = new RealGeneratorState(
    makeInstantGen(RealNum.fromStr('4.449')),
  );

  const seq = [
    [NegInfPrec, '0', false],
    [new RegularPrec(0), '4', false],
    [new RegularPrec(1), '4.4', false],
    [new RegularPrec(2), '4.45', false],
    // expected to be the same since result is already known
    // internally to full precision
    [new RegularPrec(1), '4.4', false],
    [InfPrec, '4.449', true],
    [new RegularPrec(1), '4.4', false],
    [NegInfPrec, '0', false],
  ];

  for (const [prec, expVal, expDone] of seq) {
    const [val, done] = genState.eval(prec);
    expect(val.toString()).toBe(expVal);
    expect(done).toBe(expDone);
  }
});

test('generator state eval works correctly with regular gen', () => {
  const genState = new RealGeneratorState(
    makeContinuousGen(RealNum.fromStr('4.449')),
  );

  const seq = [
    [new RegularPrec(1), '4.4', false],
    [new RegularPrec(2), '4.45', false],
    // expected to be different since previous result will be rounded
    // and max allowed error is 0.1
    [new RegularPrec(1), '4.5', false],
    [new RegularPrec(3), '4.449', false],
    // expected to be different since with more precision, we confirm it's
    // supposed to round to 4.4
    [new RegularPrec(1), '4.4', false],
  ];

  for (const [prec, expVal, expDone] of seq) {
    const [val, done] = genState.eval(prec);
    expect(val.toString()).toBe(expVal);
    expect(done).toBe(expDone);
  }
});
