// @flow

import AbstractClass from './AbstractClass';

test('ensure abstract class cannot be instantiated', () => {
  expect(() => {
    const a = new AbstractClass();
  }).toThrowError('AbstractClass is an abstract class');

  class Test extends AbstractClass {
    constructor() {
      super();
      this.assertAbstract(Test);
    }
  }

  expect(() => {
    const a = new Test();
  }).toThrowError('Test is an abstract class');

  class Test2 extends Test {
    constructor() {
      super();
      this.assertAbstract(Test2);
    }
  }

  expect(() => {
    const a = new Test2();
  }).toThrowError('Test2 is an abstract class');

  class Test3 extends Test2 {
    constructor() {
      super();
    }
  }

  const a = new Test3();

  expect(a).toBeInstanceOf(Test3);
  expect(a).toBeInstanceOf(Test2);
  expect(a).toBeInstanceOf(Test);
  expect(a).toBeInstanceOf(AbstractClass);
});

