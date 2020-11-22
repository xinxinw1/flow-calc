// @flow

import { assumeNoNull } from './typetools';

export function* iter<T>(iterable: Iterable<T>): Iterator<T> {
  yield* iterable;
}

export function* izip<T>(...iters: Array<Iterable<T>>): Iterator<Array<T>> {
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
