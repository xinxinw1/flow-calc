// @flow

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import util from 'util';

expect.extend({
  toObjEqual(received, other) {
    const pass = received.equals(other);
    if (pass) {
      return {
        message: () =>
          `expected ${util.inspect(received)} to not .equals() ${util.inspect(
            other,
          )}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `expected ${util.inspect(received)} to .equals() ${util.inspect(
          other,
        )}`,
      pass: false,
    };
  },
});
