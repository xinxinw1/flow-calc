// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

import util from 'util';

import RealNum from '../../modules/calc/RealNum';

export default function CalcPage(): React.Node {
  return (
    <p>
      The calc page. <Link to="/">Home</Link>. Real num:{' '}
      {util.inspect(RealNum.fromNum(243))}
    </p>
  );
}
