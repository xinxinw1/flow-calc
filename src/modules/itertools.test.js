// @flow

import { izip } from './itertools';

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
