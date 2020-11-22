// @flow

export default class AbstractClass {
  constructor() {
    this.assertAbstract(AbstractClass);
  }

  assertAbstract(o: Class<AbstractClass>) {
    if (this.constructor.name === o.name) {
      throw new Error(
        `${o.name} is an abstract class and can't be instantiated`,
      );
    }
  }
}
