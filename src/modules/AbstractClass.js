// @flow

/* eslint-disable class-methods-use-this */

export default class AbstractClass {
  constructor() {
    this.abstractClass(AbstractClass);
  }

  abstractClass(o: Class<AbstractClass>) {
    if (this.constructor.name === o.name) {
      throw new Error(
        `${o.name} is an abstract class and can't be instantiated`,
      );
    }
  }

  // $FlowIgnore[unclear-type]
  abstractMethod(f: (...args: Array<any>) => mixed): any {
    throw new Error(`${f.name} is an abstract method and can't be called`);
  }
}
