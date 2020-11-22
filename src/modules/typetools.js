// @flow

/* eslint-disable import/prefer-default-export */

export function castNoNull<T>(v: T | void): T {
  // $FlowIgnore[unclear-type]
  return ((v: any): T);
}
