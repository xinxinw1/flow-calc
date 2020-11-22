// @flow

import FingerTree from './FingerTree';

test('creates FingerTree', () => {
  const measure = {
    plus: (x: number, y: number): number => x + y,
    measure: (x: string) => parseInt(x, 10),
    zero: () => 0,
  };

  const tree = FingerTree.empty(measure);
  expect(tree.empty()).toBe(true);
  expect(() => {
    tree.head();
  }).toThrow('cannot call head on Empty');

  const tree2 = FingerTree.from(measure, ['1', '2', '3', '4', '5']);
  expect(tree2.empty()).toBe(false);
  expect(tree2.head()).toBe('1');
  expect([...tree2]).toStrictEqual(['1', '2', '3', '4', '5']);
  expect([...tree2.init()]).toStrictEqual(['1', '2', '3', '4']);

  const [left, right] = tree2.split((m) => m > 3);
  expect([...left]).toStrictEqual(['1', '2']);
  expect([...right]).toStrictEqual(['3', '4', '5']);
});
