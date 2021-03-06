// @flow

import { assumeNoNull } from './typetools';

export function* iter<T>(iterable: Iterable<T>): Iterator<T> {
  yield* iterable;
}

export function* zip<T>(...iters: Array<Iterable<T>>): Iterator<Array<T>> {
  const iterators = iters.map(iter);
  while (true) {
    const nextVal: Array<T> = [];
    for (const i of iterators) {
      const { value, done } = i.next();
      if (done) return;
      nextVal.push(assumeNoNull(value));
    }
    yield nextVal;
  }
}

export function* reversed<T>(it: Iterable<T>): Iterator<T> {
  const items = [...it];
  items.reverse();
  yield* items;
}
