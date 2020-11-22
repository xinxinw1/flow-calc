// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage(): React.Node {
  return (
    <p>
      The home page. <Link to="/calc">Calculator</Link>
    </p>
  );
}
