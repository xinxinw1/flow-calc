// @flow

/* eslint-disable import/prefer-default-export */

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
