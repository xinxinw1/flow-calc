// flow-typed signature: 3b0dfaa561fbd13728fb581fb4d58337
// flow-typed version: <<STUB>>/@aureooms/js-fingertree_v5.0.0/flow_v0.138.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   '@aureooms/js-fingertree'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

declare module '@aureooms/js-fingertree' {
  declare type Measure<T, M> = {
    plus(x: M, y: M): M,
    measure(x: T): M,
    zero(): M,
  }

  declare type Tree<T, M> = {
    measure(): M,
    empty(): boolean,
    head(): T,
    last(): T,
    push(x: T): Tree<T, M>,
    cons(x: T): Tree<T, M>,
    init(): Tree<T, M>,
    tail(): Tree<T, M>,
    split(pred: (m: M) => boolean): [Tree<T, M>, Tree<T, M>],
    concat(t: Tree<T, M>): Tree<T, M>,
    @@iterator(): Iterator<T>,
  };

  declare function empty<T, M>(m: Measure<T, M>): Tree<T, M>;

  declare function from<T, M>(m: Measure<T, M>, it: Iterable<T>): Tree<T, M>;
}
