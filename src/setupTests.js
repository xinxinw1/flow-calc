// @flow

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

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

// eslint-disable-next-line no-unused-vars
type CustomMatchersType = {
  // $FlowIgnore[unclear-type]
  toObjEqual(other: any): void,
};
