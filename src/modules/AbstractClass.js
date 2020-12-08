// @flow

/* eslint-disable class-methods-use-this */

export default class AbstractClass {
  constructor() {
    this.abstractClass(AbstractClass);
  }

  abstractClass(o: Class<AbstractClass>, ..._args: Array<mixed>) {
    if (this.constructor.name === o.name) {
      throw new Error(
        `${o.name} is an abstract class and can't be instantiated`,
      );
    }
  }

  abstractMethod(
    // $FlowIgnore[unclear-type]
    f: (...args: Array<any>) => mixed,
    ..._args: Array<mixed>
  ): // $FlowIgnore[unclear-type]
  any {
    throw new Error(`${f.name} is an abstract method and can't be called`);
  }

  static abstractMethod(
    // $FlowIgnore[unclear-type]
    f: (...args: Array<any>) => mixed,
    ..._args: Array<mixed>
  ): // $FlowIgnore[unclear-type]
  any {
    throw new Error(`${f.name} is an abstract method and can't be called`);
  }
}
