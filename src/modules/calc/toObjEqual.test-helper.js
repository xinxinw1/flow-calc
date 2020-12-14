// @flow

import util from 'util';

expect.extend({
  toObjEqual(received, other) {
    if (!received || !received.equals) {
      return {
        message: () =>
          `received object ${util.inspect(
            received,
          )} doesn't have a .equals() method`,
        pass: false,
      };
    }

    const pass = received.equals(other);
    if (pass) {
      return {
        message: () =>
          `expected ${received.toString()} to not .equals() ${other.toString()}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected ${received.toString()} to .equals() ${other.toString()}`,
      pass: false,
    };
  },
});

export type ObjEqualMatcher = {
  // $FlowIgnore[unclear-type]
  toObjEqual(other: any): void,
};
