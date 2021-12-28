// @flow

/* eslint-disable import/prefer-default-export */

export function absurd<T>(_: empty): T {
  throw new Error('Absurd value found');
}

export function assumeNoNull<T>(v: ?T): T {
  // $FlowIgnore[unclear-type]
  return ((v: any): T);
}

// $FlowIgnore[unclear-type]
export function downCast<Base: Object, Child: Base>(
  v: Base,
  c: Class<Child>,
): Child {
  if (!(v instanceof c)) {
    throw new Error(
      `Cannot cast value of type ${v.constructor.name} to class ${c.name}`,
    );
  }
  return v;
}

// $FlowIgnore[unclear-type]
export function unknownSubtype<T: Object>(v: T, base: Class<T>): any {
  throw new Error(`Unknown ${base.name} type ${v.constructor.name}`);
}

// $FlowIgnore[unclear-type]
export type ClassType = Class<Object>;
