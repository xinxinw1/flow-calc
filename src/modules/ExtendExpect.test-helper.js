// @flow

export type OrigExpect = typeof expect;

type OldExpectValue<OldExpect> = $Call<OldExpect, mixed>;

type OldJestExpectTypeNot<OldExpect> = $PropertyType<
  OldExpectValue<OldExpect>,
  'not',
>;

type OldJestExpectType<OldExpect> = $PropertyType<
  OldExpectValue<OldExpect>,
  'resolves',
>;

type NewJestExpectTypeNot<OldExpect, NewMatcherType> = NewJestExpectType<
  OldExpect,
  NewMatcherType,
> &
  OldJestExpectTypeNot<OldExpect>;

type NewJestExpectType<OldExpect, NewMatcherType> = NewMatcherType & {
  not: NewJestExpectTypeNot<OldExpect, NewMatcherType>,
} & OldJestExpectType<OldExpect>;

type NewJestPromiseType<OldExpect, NewMatcherType> = {
  rejects: NewJestExpectType<OldExpect, NewMatcherType>,
  resolves: NewJestExpectType<OldExpect, NewMatcherType>,
};

type NewExpectValue<OldExpect, NewMatcherType> = NewJestExpectType<
  OldExpect,
  NewMatcherType,
> &
  NewJestPromiseType<OldExpect, NewMatcherType> &
  OldExpectValue<OldExpect>;

export type ExtendExpect<OldExpect, NewMatcherType> = {
  // $FlowIgnore[unclear-type]
  (value: any): NewExpectValue<OldExpect, NewMatcherType>,
} & OldExpect;
