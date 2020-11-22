// @flow

import AbstractClass from './AbstractClass';

test('ensure abstract class cannot be instantiated', () => {
  expect(() => {
    const _ = new AbstractClass();
  }).toThrow('AbstractClass is an abstract class');

  class Test extends AbstractClass {
    constructor() {
      super();
      this.assertAbstract(Test);
    }
  }

  expect(() => {
    const _ = new Test();
  }).toThrow('Test is an abstract class');

  class Test2 extends Test {
    constructor() {
      super();
      this.assertAbstract(Test2);
    }
  }

  expect(() => {
    const _ = new Test2();
  }).toThrow('Test2 is an abstract class');

  class Test3 extends Test2 {}

  const a = new Test3();

  expect(a).toBeInstanceOf(Test3);
  expect(a).toBeInstanceOf(Test2);
  expect(a).toBeInstanceOf(Test);
  expect(a).toBeInstanceOf(AbstractClass);
});
