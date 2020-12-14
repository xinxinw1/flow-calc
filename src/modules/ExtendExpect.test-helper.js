// @flow

type OldExpect = typeof expect;
type OldExpectValue = $Call<OldExpect, mixed>;
type OldJestExpectTypeNot = $PropertyType<OldExpectValue, 'not'>;
type OldJestExpectType = $PropertyType<OldExpectValue, 'resolves'>;

type NewJestExpectTypeNot<NewMatcherType> = NewJestExpectType<NewMatcherType> &
  OldJestExpectTypeNot;

type NewJestExpectType<NewMatcherType> = NewMatcherType & {
  not: NewJestExpectTypeNot<NewMatcherType>,
} & OldJestExpectType;

type NewJestPromiseType<NewMatcherType> = {
  rejects: NewJestExpectType<NewMatcherType>,
  resolves: NewJestExpectType<NewMatcherType>,
};

type NewExpectValue<NewMatcherType> = NewJestExpectType<NewMatcherType> &
  NewJestPromiseType<NewMatcherType> &
  OldExpectValue;

export type ExtendExpect<NewMatcherType> = {
  // $FlowIgnore[unclear-type]
  (value: any): NewExpectValue<NewMatcherType>,
} & OldExpect;
