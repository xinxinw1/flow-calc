// @flow

import CalcEnvironment from '../CalcEnvironment';
import AbstractClass from '../../AbstractClass';

// Base class for Real evaluators.
// Adds variable for the calc environment
export default class BaseEvaluator extends AbstractClass {
  env: CalcEnvironment;

  constructor(env: CalcEnvironment) {
    super();
    this.env = env;
    this.abstractClass(BaseEvaluator);
  }

  getEnv(): CalcEnvironment {
    return this.env;
  }
}
