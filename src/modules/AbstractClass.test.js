// @flow

import AbstractClass from './AbstractClass';

test('ensure abstract class cannot be instantiated', () => {
  expect(() => {
    const _ = new AbstractClass();
  }).toThrow('AbstractClass is an abstract class');

  class Test extends AbstractClass {
    constructor() {
      super();
      this.abstractClass(Test);
    }

    test(): boolean {
      return this.abstractMethod(this.test);
    }
  }

  expect(() => {
    const _ = new Test();
  }).toThrow('Test is an abstract class');

  class Test2 extends Test {}

  const t2 = new Test2();

  expect(t2).toBeInstanceOf(Test2);
  expect(t2).toBeInstanceOf(Test);
  expect(t2).toBeInstanceOf(AbstractClass);

  expect(() => {
    t2.test();
  }).toThrow('test is an abstract method');

  class Test3 extends Test2 {
    // eslint-disable-next-line class-methods-use-this
    test(): boolean {
      return true;
    }
  }

  const t3 = new Test3();

  expect(t3).toBeInstanceOf(Test3);
  expect(t3).toBeInstanceOf(Test2);
  expect(t3).toBeInstanceOf(Test);
  expect(t3).toBeInstanceOf(AbstractClass);

  expect(t3.test()).toBe(true);
});
