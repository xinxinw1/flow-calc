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
    fName: string,
    ..._args: Array<mixed>
  ): // $FlowIgnore[unclear-type]
  any {
    throw new Error(`${fName} is an abstract method and can't be called`);
  }

  static abstractMethod(
    fName: string,
    ..._args: Array<mixed>
  ): // $FlowIgnore[unclear-type]
  any {
    throw new Error(`${fName} is an abstract method and can't be called`);
  }
}
