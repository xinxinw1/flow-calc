// @flow

import { iter, izip, reversed } from './itertools';

test('izip', () => {
  const first = [1, 2, 3];
  const second = [6, 7, 8, 9];
  const third = [4, 5, 6];

  const zipped = izip(first, second, third);

  expect(zipped.next()).toStrictEqual({
    value: [1, 6, 4],
    done: false,
  });

  expect(zipped.next()).toStrictEqual({
    value: [2, 7, 5],
    done: false,
  });

  expect(zipped.next()).toStrictEqual({
    value: [3, 8, 6],
    done: false,
  });

  expect(zipped.next()).toStrictEqual({
    value: undefined,
    done: true,
  });
});

test('reversed', () => {
  expect([...reversed([1, 2, 3])]).toStrictEqual([3, 2, 1]);
  expect([...reversed([])]).toStrictEqual([]);

  const it = iter([3, 4, 5]);
  const revIt = reversed(it);

  expect(revIt.next()).toStrictEqual({
    value: 5,
    done: false,
  });

  expect(revIt.next()).toStrictEqual({
    value: 4,
    done: false,
  });

  expect(revIt.next()).toStrictEqual({
    value: 3,
    done: false,
  });

  expect(revIt.next()).toStrictEqual({
    value: undefined,
    done: true,
  });
});
