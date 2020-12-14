// @flow

/* eslint-disable prefer-promise-reject-errors */

import type { ExtendExpect } from './ExtendExpect.test-helper';

function doTest(num, received, other) {
  if (received === other) {
    return {
      message: () =>
        `${num}: expected ${received.toString()} to not === ${other.toString()}`,
      pass: true,
    };
  }
  return {
    message: () =>
      `${num}: expected ${received.toString()} to ===) ${other.toString()}`,
    pass: false,
  };
}

const addedMethods = {
  toTest1(received, other) {
    return doTest(1, received, other);
  },
  toTest2(received, other) {
    return doTest(2, received, other);
  },
};

expect.extend(addedMethods);

type Test1Matcher = {
  // $FlowIgnore[unclear-type]
  toTest1(other: any): void,
};

type ExpectWithTest1 = ExtendExpect<Test1Matcher>;

// $FlowIgnore[unclear-type]
const expect1: ExpectWithTest1 = (expect: any);

test('expect with test1 has no type errors', async () => {
  const a = expect1(true);
  const aNot = a.not;

  a.toTest1(true);
  aNot.toTest1(false);
  // old functions still work
  a.toBe(true);
  a.not.toBe(false);

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    a.toTestUnknown(true);
  }).toThrow('a.toTestUnknown is not a function');

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    a.not.toTestUnknown(true);
  }).toThrow('a.not.toTestUnknown is not a function');

  const promise = expect1(Promise.resolve(true));
  const promiseResolves = promise.resolves;

  await promiseResolves.toTest1(true);
  await promiseResolves.not.toTest1(false);
  await promiseResolves.toBe(true);
  await promiseResolves.not.toBe(false);

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    promiseResolves.toTestUnknown(true);
  }).toThrow('promiseResolves.toTestUnknown is not a function');

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    promiseResolves.not.toTestUnknown(true);
  }).toThrow('promiseResolves.not.toTestUnknown is not a function');

  await expect1(Promise.reject(true)).rejects.toTest1(true);
  await expect1(Promise.reject(true)).rejects.not.toTest1(false);
  await expect1(Promise.reject(true)).rejects.toBe(true);
  await expect1(Promise.reject(true)).rejects.not.toBe(false);
});

type Test2Matcher = {
  // $FlowIgnore[unclear-type]
  toTest2(other: any): void,
};

declare var expect: ExtendExpect<{
  ...Test1Matcher,
  ...Test2Matcher,
}>;

test('expect with multiple additions has no type errors', async () => {
  const a = expect(true);
  const aNot = a.not;

  a.toTest1(true);
  aNot.toTest1(false);
  a.toTest2(true);
  aNot.toTest2(false);
  // old functions still work
  a.toBe(true);
  a.not.toBe(false);

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    a.toTestUnknown(true);
  }).toThrow('a.toTestUnknown is not a function');

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    a.not.toTestUnknown(true);
  }).toThrow('a.not.toTestUnknown is not a function');

  const promise = expect(Promise.resolve(true));
  const promiseResolves = promise.resolves;

  await promiseResolves.toTest1(true);
  await promiseResolves.not.toTest1(false);
  await promiseResolves.toTest2(true);
  await promiseResolves.not.toTest2(false);
  await promiseResolves.toBe(true);
  await promiseResolves.not.toBe(false);

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    promiseResolves.toTestUnknown(true);
  }).toThrow('promiseResolves.toTestUnknown is not a function');

  expect(() => {
    // $FlowExpectedError[incompatible-call]
    promiseResolves.not.toTestUnknown(true);
  }).toThrow('promiseResolves.not.toTestUnknown is not a function');

  await expect(Promise.reject(true)).rejects.toTest1(true);
  await expect(Promise.reject(true)).rejects.not.toTest1(false);
  await expect(Promise.reject(true)).rejects.toTest2(true);
  await expect(Promise.reject(true)).rejects.not.toTest2(false);
  await expect(Promise.reject(true)).rejects.toBe(true);
  await expect(Promise.reject(true)).rejects.not.toBe(false);
});
