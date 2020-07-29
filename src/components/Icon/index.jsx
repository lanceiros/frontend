import 'antd/lib/icon/style/index.css';
import React from 'react';
import isEmpty from 'lodash.isempty';
import AntIcon from 'antd/lib/icon';

import * as icons from './svgs';

const Icon = ({ type, ...props }) => {
  const component = icons[type];

  if (isEmpty(component)) {
    return <AntIcon type={type} {...props} />;
  }

  return <AntIcon component={component} {...props} />;
};

export const InfoIcon = props => {
  return <AntIcon theme='filled' type='info-circle' style={{'font-size':'80%', 'vertical-align':'top'}} />
};

export default Icon;
