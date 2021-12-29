// @flow

import { type Size } from './Size';

/**
 * Returned when a zeroness test confirmed a non-zero
 * result, though possibly with an assumed discontinuity.
 *
 * Includes the sign and min size of the result found.
 */
export class NonZeroResult {
  positive: boolean;
  minSize: Size;
  assumedDiscontinuity: boolean;

  constructor(
    positive: boolean,
    minSize: Size,
    assumedDiscontinuity?: boolean,
  ) {
    this.positive = positive;
    this.minSize = minSize;
    this.assumedDiscontinuity = assumedDiscontinuity || false;
  }

  equals(other: ZeroTestResult): boolean {
    return (
      other instanceof NonZeroResult &&
      this.positive === other.positive &&
      this.minSize.equals(other.minSize) &&
      this.assumedDiscontinuity === other.assumedDiscontinuity
    );
  }
}

/**
 * Returned when a zeroness test confirmed a zero
 * result. assumedDiscontinuity is true both if a
 * subevaluation had a discontinuity or if the tested
 * evaluation can't be proved to be non-zero.
 *
 * If assumedDiscontinuity is false, the result
 * is guaranteed to be zero.
 */
export class ZeroResult {
  assumedDiscontinuity: boolean;

  constructor(assumedDiscontinuity?: boolean) {
    this.assumedDiscontinuity = assumedDiscontinuity || false;
  }

  equals(other: ZeroTestResult): boolean {
    return (
      other instanceof ZeroResult &&
      this.assumedDiscontinuity === other.assumedDiscontinuity
    );
  }
}

/**
 * Returned when a zeroness test found a division by zero
 * when computing a sub-expression. assumedDiscontinuity could be true if a sub-expression had a discontinuity.
 */
export class DivisionByZeroResult {
  assumedDiscontinuity: boolean;

  constructor(assumedDiscontinuity?: boolean) {
    this.assumedDiscontinuity = assumedDiscontinuity || false;
  }

  equals(other: ZeroTestResult): boolean {
    return (
      other instanceof DivisionByZeroResult &&
      this.assumedDiscontinuity === other.assumedDiscontinuity
    );
  }
}

export type ZeroTestResult = NonZeroResult | ZeroResult | DivisionByZeroResult;
