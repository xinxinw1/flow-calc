// @flow

import { absurd } from '../typetools';

export class RegularInt {
  n: number;

  constructor(n: number) {
    if (!Number.isInteger(n)) {
      throw new Error(`Number ${n} must be an integer`);
    }
    this.n = n;
    Object.freeze(this);
  }

  equals(other: ExtInteger): boolean {
    return ExtIntegers.equals(this, other);
  }

  le(other: ExtInteger): boolean {
    return ExtIntegers.le(this, other);
  }

  gt(other: ExtInteger): boolean {
    return ExtIntegers.gt(this, other);
  }

  ge(other: ExtInteger): boolean {
    return ExtIntegers.ge(this, other);
  }

  lt(other: ExtInteger): boolean {
    return ExtIntegers.lt(this, other);
  }

  add(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.add(this, other);
  }

  max(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.max(this, other);
  }
}

export class InfInt {
  equals(other: ExtInteger): boolean {
    return ExtIntegers.equals(this, other);
  }

  le(other: ExtInteger): boolean {
    return ExtIntegers.le(this, other);
  }

  gt(other: ExtInteger): boolean {
    return ExtIntegers.gt(this, other);
  }

  ge(other: ExtInteger): boolean {
    return ExtIntegers.ge(this, other);
  }

  lt(other: ExtInteger): boolean {
    return ExtIntegers.lt(this, other);
  }

  add(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.add(this, other);
  }

  max(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.max(this, other);
  }
}

export class NegInfInt {
  equals(other: ExtInteger): boolean {
    return ExtIntegers.equals(this, other);
  }

  le(other: ExtInteger): boolean {
    return ExtIntegers.le(this, other);
  }

  gt(other: ExtInteger): boolean {
    return ExtIntegers.gt(this, other);
  }

  ge(other: ExtInteger): boolean {
    return ExtIntegers.ge(this, other);
  }

  lt(other: ExtInteger): boolean {
    return ExtIntegers.lt(this, other);
  }

  add(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.add(this, other);
  }

  max(other: number | ExtInteger): ExtInteger {
    return ExtIntegers.max(this, other);
  }
}

export type ExtInteger = RegularInt | InfInt | NegInfInt;

class ExtIntegers {
  static equals(a: ExtInteger, b: ExtInteger): boolean {
    if (a instanceof RegularInt) {
      return b instanceof RegularInt && a.n === b.n;
    } else if (a instanceof InfInt) {
      return b instanceof InfInt;
    } else if (a instanceof NegInfInt) {
      return b instanceof NegInfInt;
    } else {
      return absurd(a);
    }
  }

  static le(a: ExtInteger, b: ExtInteger): boolean {
    if (a instanceof RegularInt) {
      if (b instanceof RegularInt) {
        return a.n <= b.n;
      } else if (b instanceof InfInt) {
        return true;
      } else if (b instanceof NegInfInt) {
        return false;
      } else {
        return absurd(b);
      }
    } else if (a instanceof InfInt) {
      return b instanceof InfInt;
    } else if (a instanceof NegInfInt) {
      return true;
    } else {
      return absurd(a);
    }
  }

  static gt(a: ExtInteger, b: ExtInteger): boolean {
    return !ExtIntegers.le(a, b);
  }

  static ge(a: ExtInteger, b: ExtInteger): boolean {
    return ExtIntegers.le(b, a);
  }

  static lt(a: ExtInteger, b: ExtInteger): boolean {
    return !ExtIntegers.ge(a, b);
  }

  static add(a: ExtInteger, b: number | ExtInteger): ExtInteger {
    if (a instanceof RegularInt) {
      if (typeof b === 'number') {
        return new RegularInt(a.n + b);
      } else if (b instanceof RegularInt) {
        return new RegularInt(a.n + b.n);
      } else {
        return b;
      }
    } else if (a instanceof InfInt) {
      if (b instanceof NegInfInt) {
        throw new Error('cannot add inf integer with neg inf integer');
      } else {
        return a;
      }
    } else if (a instanceof NegInfInt) {
      if (b instanceof InfInt) {
        throw new Error('cannot add inf integer with neg inf integer');
      } else {
        return a;
      }
    } else {
      return absurd(a);
    }
  }

  static max(a: ExtInteger, b: number | ExtInteger): ExtInteger {
    if (a instanceof RegularInt) {
      if (typeof b === 'number') {
        return new RegularInt(Math.max(a.n, b));
      } else if (b instanceof RegularInt) {
        return new RegularInt(Math.max(a.n, b.n));
      } else if (b instanceof InfInt) {
        return b;
      } else if (b instanceof NegInfInt) {
        return a;
      } else {
        return absurd(b);
      }
    } else if (a instanceof InfInt) {
      return a;
    } else if (a instanceof NegInfInt) {
      if (typeof b === 'number') {
        return new RegularInt(b);
      } else {
        return b;
      }
    } else {
      return absurd(a);
    }
  }
}
